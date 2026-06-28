import fs from "node:fs";
import path from "node:path";

const dataDir = path.resolve("src/data");
const files = fs
  .readdirSync(dataDir)
  .filter((file) => file.endsWith(".ts") && file !== "mockTenders.ts");

const duplicates = [];

for (const file of files) {
  const source = fs.readFileSync(path.join(dataDir, file), "utf8");
  const names = [...source.matchAll(/^export const (\w+)/gm)].map((match) => match[1]);
  const seen = new Set();

  for (const name of names) {
    if (seen.has(name)) {
      duplicates.push(`${file}: duplicate export "${name}"`);
    }
    seen.add(name);
  }
}

if (duplicates.length > 0) {
  console.error("Duplicate data exports found:\n" + duplicates.join("\n"));
  process.exit(1);
}

console.log("Data export check passed.");
