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

test("invite creates the account with a default password and a 2-minute link", () => {
  const actor = root();
  assert.throws(() => invites.createInvite({ email: "x@example.com", role: "superadmin" }, actor), /Choose a role/);
  assert.throws(() => invites.createInvite({ email: "x@example.com", role: "doctor", password: "short" }, actor), /Default password/);
  const inv = invites.createInvite({ email: "Dr.Who@example.com", role: "doctor", name: "Dr Who", password: "Default-pass-1" }, actor);
  assert.equal(inv.defaultPassword, "Default-pass-1");
  const ttl = inv.expiresAt - Date.now();
  assert.ok(ttl > 110_000 && ttl <= 120_000, `ttl ${ttl}`);
  const row = db().prepare("SELECT token_hash, temp_password_sealed FROM invites WHERE id=?").get(inv.id);
  assert.notEqual(row.token_hash, inv.token, "token stored hashed");
  assert.equal(row.temp_password_sealed, null, "default password is never stored in readable form");
  assert.equal(invites.previewInvite(inv.token).invite.defaultPassword, undefined, "the link does not reveal the default");
  // Account exists already but must change its password.
  const signedIn = auth.login("dr.who@example.com", "Default-pass-1");
  assert.equal(signedIn.user.mustChangePassword, true);
  assert.equal(auth.userForToken(signedIn.token).mustChangePassword, true);
  assert.throws(() => invites.createInvite({ email: "dr.who@example.com", role: "nurse" }, actor), /already been invited/);
});

test("two-step invite: verify the default password, then set a new one (once)", () => {
  const actor = root();
  const inv = invites.createInvite({ email: "nurse.a@example.com", role: "nurse", name: "Nurse A" }, actor);
  assert.match(inv.defaultPassword, /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/, "generated when blank");
  // Step 1
  assert.throws(() => invites.verifyInvite(inv.token, "wrong-pass-1"), /isn’t right/);
  assert.equal(invites.verifyInvite(inv.token, inv.defaultPassword).ok, true);
  // Step 2 re-checks the default password
  assert.throws(() => invites.acceptInvite(inv.token, { currentPassword: "wrong-pass-1", name: "Nurse A", newPassword: "Stethoscope-42" }), /isn’t right/);
  assert.throws(() => invites.acceptInvite(inv.token, { currentPassword: inv.defaultPassword, name: "Nurse A", newPassword: inv.defaultPassword }), /not the default/);
  assert.throws(() => invites.acceptInvite(inv.token, { currentPassword: inv.defaultPassword, name: "Nurse A", newPassword: "short" }), /at least 10/);
  const { user } = invites.acceptInvite(inv.token, { currentPassword: inv.defaultPassword, name: "Nurse A", newPassword: "Stethoscope-42" });
  assert.equal(user.role, "nurse");
  assert.equal(invites.previewInvite(inv.token).reason, "accepted");
  assert.throws(() => invites.verifyInvite(inv.token, "Stethoscope-42"), /expired/);
  assert.throws(() => auth.login("nurse.a@example.com", inv.defaultPassword), /Incorrect/);
  assert.equal(auth.login("nurse.a@example.com", "Stethoscope-42").user.mustChangePassword, false);
});

test("after the link expires, sign in with the default password and change it", () => {
  const actor = root();
  const inv = invites.createInvite({ email: "late@example.com", role: "wellbeing", name: "Late Person" }, actor);
  db().prepare("UPDATE invites SET expires_at = 1 WHERE id = ?").run(inv.id);
  assert.equal(invites.previewInvite(inv.token).reason, "expired");
  assert.equal(db().prepare("SELECT temp_password_sealed s FROM invites WHERE id=?").get(inv.id).s, null, "sealed password wiped on expiry");
  assert.throws(() => invites.acceptInvite(inv.token, { currentPassword: inv.defaultPassword, name: "Late", newPassword: "Whatever-pass-9" }), /expired/);
  const { token, user } = auth.login("late@example.com", inv.defaultPassword);
  assert.equal(user.mustChangePassword, true);
  assert.throws(() => auth.changePassword(user.id, "wrong-pass-1", "Brand-new-pass-1"), /current password/);
  assert.throws(() => auth.changePassword(user.id, inv.defaultPassword, inv.defaultPassword), /different/);
  auth.changePassword(user.id, inv.defaultPassword, "Brand-new-pass-1", token);
  invites.completeInvitesFor(user.id);
  assert.equal(auth.userForToken(token).mustChangePassword, false);
  assert.equal(invites.listInvites().find((i) => i.id === inv.id).activated, 1);
});

test("revoke removes a never-activated account; new link keeps the default password", () => {
  const actor = root();
  const a = invites.createInvite({ email: "n1@example.com", role: "nurse" }, actor);
  invites.revokeInvite(a.id, actor);
  assert.equal(invites.previewInvite(a.token).reason, "revoked");
  assert.equal(db().prepare("SELECT COUNT(*) n FROM users WHERE email='n1@example.com'").get().n, 0);
  const b = invites.createInvite({ email: "n2@example.com", role: "nurse" }, actor);
  const c = invites.reissueInvite(b.id, actor);
  assert.equal(invites.previewInvite(b.token).ok, false);
  assert.equal(invites.previewInvite(c.token).ok, true);
  assert.equal(invites.verifyInvite(c.token, b.defaultPassword).ok, true, "same default password still works");
  const d = invites.reissueInvite(c.id, actor, "Changed-pass-5");
  assert.throws(() => auth.login("n2@example.com", b.defaultPassword), /Incorrect/);
  assert.equal(auth.login("n2@example.com", "Changed-pass-5").user.mustChangePassword, true);
  assert.equal(invites.previewInvite(d.token).ok, true);
  assert.equal(invites.previewInvite("garbage").reason, "invalid");
});

test("disabling a user ends their access; roles can be changed", () => {
  const actor = root();
  const inv = invites.createInvite({ email: "care@example.com", role: "care" }, actor);
  const { user, token } = invites.acceptInvite(inv.token, { currentPassword: inv.defaultPassword, name: "Care Person", newPassword: "Careful-pass-7" });
  users.updateUser(user.id, { role: "manager" }, actor);
  assert.equal(auth.userForToken(token).role, "manager");
  users.updateUser(user.id, { status: "disabled" }, actor);
  assert.equal(auth.userForToken(token), null);
  assert.throws(() => auth.login("care@example.com", "Careful-pass-7"), /disabled/);
  assert.throws(() => users.updateUser(actor.id, { status: "disabled" }, actor), /your own/);
});

test("practitioners appear in the patient app only once activated, visible and patient-facing", () => {
  const actor = root();
  const inv = invites.createInvite({ email: "gp.one@example.com", role: "doctor", name: "Dr Ada Obi" }, actor);
  const list = () => users.listPractitioners();
  assert.equal(list().find((p) => p.name === "Dr Ada Obi"), undefined, "hidden until they set their own password");
  const { user } = invites.acceptInvite(inv.token, { currentPassword: inv.defaultPassword, name: "Dr Ada Obi", newPassword: "Stethoscope-77" });
  const p = list().find((x) => x.id === user.id);
  assert.ok(p, "visible after activation");
  assert.equal(p.role, "doctor");
  assert.equal(p.initials, "AO", "titles like Dr are skipped in initials");
  assert.equal(p.title, "Doctor / prescriber", "falls back to the role label");
  assert.equal("email" in p, false, "no emails in public data");

  users.updateUser(user.id, { title: "GP · online and in-clinic", languages: "English, Igbo", bio: "Family medicine." }, actor);
  const updated = list().find((x) => x.id === user.id);
  assert.equal(updated.title, "GP · online and in-clinic");
  assert.equal(updated.languages, "English, Igbo");
  assert.throws(() => users.updateUser(user.id, { bio: "x".repeat(601) }, actor), /600/);
  assert.throws(() => users.updateUser(user.id, { name: " " }, actor), /full name/);

  users.updateUser(user.id, { showInApp: false }, actor);
  assert.equal(list().find((x) => x.id === user.id), undefined, "admin can hide someone");
  users.updateUser(user.id, { showInApp: true }, actor);
  users.updateUser(user.id, { role: "wellbeing" }, actor);
  assert.equal(list().find((x) => x.id === user.id).role, "wellbeing", "role changes flow through");
  users.updateUser(user.id, { status: "disabled" }, actor);
  assert.equal(list().find((x) => x.id === user.id), undefined, "disabled staff disappear");
  assert.equal(list().some((x) => x.role === "superadmin"), false, "super admin never listed");
});

test("analytics reflect real activity", () => {
  const o = analytics.overview(14);
  assert.ok(o.totals.total >= 4);
  assert.ok(o.invites.sent >= 5 && o.invites.accepted >= 3);
  assert.equal(o.logins.length, 14);
  assert.ok(o.logins.reduce((s, p) => s + p.value, 0) >= 3);
  assert.equal(o.roles.find((r) => r.role === "superadmin").members, 1);
});
