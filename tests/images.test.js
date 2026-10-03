import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, it, expect } from "vitest";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const files = [
  "src/assets/images/logo.webp",
  "src/assets/images/hero-house-640.webp",
  "src/assets/images/hero-house-1024.webp",
  "src/assets/images/report-sample-800.webp",
  "src/assets/images/report-sample-1200.webp",
  "src/assets/images/video-thumb.webp",
  "public/favicon-32.png",
  "public/apple-touch-icon.png",
  "public/og-image.jpg",
];

describe("images", () => {
  it.each(files)("%s exists and is not empty", (file) => {
    expect(statSync(resolve(root, file)).size).toBeGreaterThan(500);
  });
});
