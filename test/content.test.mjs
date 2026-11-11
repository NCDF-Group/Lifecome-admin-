import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("portal engine reads runtime configuration", () => {
  const portal = fs.readFileSync("public/portal.js", "utf8");
  assert.match(portal, /window\.LIFECOME_CONFIG/);
});

test("patient app ships its entry points and assets", () => {
  for (const file of ["index.html", "app.js", "screens.js", "bridge.js", "boot.js", "app.css"]) {
    assert.ok(fs.existsSync(`public/patient/${file}`), file);
  }
});
