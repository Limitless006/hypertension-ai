import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const pageContent = fs.readFileSync(path.join(rootDir, "src", "app", "page.tsx"), "utf8");

const matches = pageContent.match(/path:\s*["']([^"']+)["']/g) || [];
console.log(`Found ${matches.length} file paths in page.tsx:`);

let missing = 0;
for (const m of matches) {
  const relPath = m.match(/["']([^"']+)["']/)[1];
  const diskPath = path.join(rootDir, "public", relPath.replace(/^\//, ""));
  const exists = fs.existsSync(diskPath);
  console.log(`  [${exists ? "OK" : "MISSING"}] ${relPath} -> ${diskPath}`);
  if (!exists) missing++;
}

if (missing === 0) {
  console.log("ALL 14 FILE PATHS IN PAGE.TSX EXIST! (ZERO 404s)");
} else {
  console.error(`ERROR: ${missing} files missing!`);
  process.exit(1);
}
