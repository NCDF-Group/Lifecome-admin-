import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const screens = JSON.parse(fs.readFileSync("src/content/screens/index.json", "utf8"));
const tiles = JSON.parse(fs.readFileSync("src/content/screen-board.json", "utf8"));

test("all 56 professional screens are present and well formed", () => {
  assert.equal(screens.length, 56);
  assert.equal(tiles.length, 56);
  for (const { slug } of screens) {
    const html = fs.readFileSync(`src/content/screens/${slug}.html`, "utf8");
    assert.match(html, /<h1/, slug);
    assert.doesNotMatch(html, /\.html["?#]/, `${slug}: legacy .html link`);
    assert.doesNotMatch(html, /<script/i, slug);
  }
});

test("the manifest matches the screen set", () => {
  const manifest = JSON.parse(fs.readFileSync("public/screen-manifest.json", "utf8"));
  assert.equal(manifest.length, 56);
});

test("portal engine reads runtime configuration, not hosted demo URLs", () => {
  const portal = fs.readFileSync("public/portal.js", "utf8");
  assert.match(portal, /window\.LIFECOME_CONFIG/);
  assert.doesNotMatch(portal, /https:\/\/lifecome[^'"]*chatgpt/i);
});
