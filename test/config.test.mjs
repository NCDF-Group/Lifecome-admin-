import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { browserConfig, readConfig } from "../src/lib/config.ts";

test("local bridge defaults resolve from the browser origin", () => {
  const context = { window: { location: { origin: "http://localhost:4567" } } };
  vm.runInNewContext(browserConfig(readConfig({})), context);
  assert.equal(context.window.LIFECOME_CONFIG.patientAppUrl, "http://localhost:4567/patient/");
  assert.equal(context.window.LIFECOME_CONFIG.professionalOrigin, "http://localhost:4567");
});

test("runtime configuration does not expose environment secrets", () => {
  const script = browserConfig(
    readConfig({ APP_ORIGIN: "https://portal.example.com", PATIENT_APP_URL: "https://patient.example.com", API_SECRET: "do-not-expose" }),
  );
  assert.doesNotMatch(script, /do-not-expose/);
  assert.match(script, /portal\.example\.com/);
  assert.match(script, /patient\.example\.com\//);
});

test("invalid configuration is rejected", () => {
  assert.throws(() => readConfig({ APP_ORIGIN: "https://portal.example.com/path" }));
  assert.throws(() => readConfig({ PATIENT_APP_URL: "javascript:alert(1)" }));
  assert.throws(() => readConfig({ APP_ORIGIN: "https://user:pw@portal.example.com" }));
});
