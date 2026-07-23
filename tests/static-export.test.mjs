import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("GitHub Pages export contains the entry page", () => {
  assert.equal(existsSync("out/index.html"), true);
  const html = readFileSync("out/index.html", "utf8");
  assert.match(html, /SFI/);
  assert.match(html, /ОБЪЕКТ №‑13/);
});

test("all thirteen mutation images are exported", () => {
  for (let stage = 1; stage <= 13; stage += 1) {
    assert.equal(
      existsSync(`out/mutation-stage-${stage}.webp`),
      true,
      `missing mutation-stage-${stage}.webp`,
    );
  }
});

test("private Sites hosting identity is absent", () => {
  assert.equal(existsSync(".openai/hosting.json"), false);
  assert.equal(existsSync("out/.openai/hosting.json"), false);
});
