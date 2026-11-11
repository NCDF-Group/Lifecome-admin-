import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lifecome-"));
process.env.DATABASE_PATH = path.join(dir, "test.db");
process.env.SEED_SUPERADMIN_EMAIL = "root@example.com";
process.env.SEED_SUPERADMIN_PASSWORD = "Correct-horse-9";

const { db } = await import("../src/lib/db/index.ts");
const auth = await import("../src/lib/auth/core.ts");
const invites = await import("../src/lib/invites.ts");
const users = await import("../src/lib/users.ts");
const analytics = await import("../src/lib/analytics.ts");
const security = await import("../src/lib/security.ts");

const root = () => db().prepare("SELECT id, email FROM users WHERE role='superadmin'").get();

test("superadmin is seeded once and can sign in", () => {
  assert.equal(db().prepare("SELECT COUNT(*) n FROM users WHERE role='superadmin'").get().n, 1);
  const { token, user } = auth.login("ROOT@example.com", "Correct-horse-9");
  assert.equal(user.role, "superadmin");
  assert.equal(auth.userForToken(token).email, "root@example.com");
  auth.logout(token);
  assert.equal(auth.userForToken(token), null);
});

test("wrong passwords and unknown accounts are rejected identically", () => {
  assert.throws(() => auth.login("root@example.com", "nope-nope-1"), /Incorrect email or password/);
  assert.throws(() => auth.login("ghost@example.com", "nope-nope-1"), /Incorrect email or password/);
});

test("sign-in is throttled after repeated failures", () => {
  for (let i = 0; i < 8; i++) { try { auth.login("lock@example.com", "bad-pass-1"); } catch {} }
  assert.throws(() => auth.login("lock@example.com", "bad-pass-1"), /Too many attempts/);
});

test("passwords are hashed and verifiable", () => {
  const hash = security.hashPassword("Another-pass-1");
  assert.ok(!hash.includes("Another-pass-1"));
  assert.ok(security.verifyPassword("Another-pass-1", hash));
  assert.ok(!security.verifyPassword("wrong", hash));
});

test("invite lifecycle: create, preview, accept once, then sign in", () => {
  const actor = root();
  assert.throws(() => invites.createInvite({ email: "x@example.com", role: "superadmin" }, actor), /Choose a role/);
  const inv = invites.createInvite({ email: "Dr.Who@example.com", role: "doctor", name: "Dr Who" }, actor);
  assert.ok(db().prepare("SELECT token_hash FROM invites WHERE id=?").get(inv.id).token_hash !== inv.token, "token stored hashed");
  assert.equal(invites.previewInvite(inv.token).ok, true);
  assert.throws(() => invites.acceptInvite(inv.token, { name: "Dr Who", password: "short" }), /at least 10/);
  const { user } = invites.acceptInvite(inv.token, { name: "Dr Who", password: "Stethoscope-42" });
  assert.equal(user.role, "doctor");
  assert.equal(invites.previewInvite(inv.token).reason, "accepted");
  assert.throws(() => invites.acceptInvite(inv.token, { name: "Again", password: "Stethoscope-42" }), /no longer valid/);
  assert.equal(auth.login("dr.who@example.com", "Stethoscope-42").user.role, "doctor");
  assert.throws(() => invites.createInvite({ email: "dr.who@example.com", role: "nurse" }, actor), /already exists/);
});

test("revoked, superseded and expired invites cannot be used", () => {
  const actor = root();
  const a = invites.createInvite({ email: "n1@example.com", role: "nurse" }, actor);
  invites.revokeInvite(a.id, actor);
  assert.equal(invites.previewInvite(a.token).reason, "revoked");
  const b = invites.createInvite({ email: "n2@example.com", role: "nurse" }, actor);
  const c = invites.reissueInvite(b.id, actor);
  assert.equal(invites.previewInvite(b.token).ok, false);
  assert.equal(invites.previewInvite(c.token).ok, true);
  db().prepare("UPDATE invites SET expires_at = 1 WHERE id = ?").run(c.id);
  assert.equal(invites.previewInvite(c.token).reason, "expired");
  assert.equal(invites.previewInvite("garbage").reason, "invalid");
});

test("disabling a user ends their access; roles can be changed", () => {
  const actor = root();
  const inv = invites.createInvite({ email: "care@example.com", role: "care" }, actor);
  const { user, token } = invites.acceptInvite(inv.token, { name: "Care Person", password: "Careful-pass-7" });
  users.updateUser(user.id, { role: "manager" }, actor);
  assert.equal(auth.userForToken(token).role, "manager");
  users.updateUser(user.id, { status: "disabled" }, actor);
  assert.equal(auth.userForToken(token), null);
  assert.throws(() => auth.login("care@example.com", "Careful-pass-7"), /disabled/);
  assert.throws(() => users.updateUser(actor.id, { status: "disabled" }, actor), /your own/);
});

test("analytics reflect real activity", () => {
  const o = analytics.overview(14);
  assert.ok(o.totals.total >= 3);
  assert.ok(o.invites.sent >= 4 && o.invites.accepted >= 2);
  assert.equal(o.logins.length, 14);
  assert.ok(o.logins.reduce((s, p) => s + p.value, 0) >= 3);
  assert.equal(o.roles.find((r) => r.role === "superadmin").members, 1);
});
