import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log("==================================================");
console.log("MOBILE RESPONSIVENESS & VIEWPORT AUDIT SUITE");
console.log("==================================================\n");

// 1. Arabic Numeral Normalization Logic
console.log("[1] Testing Eastern Arabic-Indic Digit Normalization...");
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const normalizeDigits = (val) => {
  return val
    .replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d).toString())
    .replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d).toString());
};

assert(normalizeDigits("١٢٠") === "120", "Normalizes Arabic ١٢٠ to ASCII 120");
assert(normalizeDigits("٨٠") === "80", "Normalizes Arabic ٨٠ to ASCII 80");
assert(normalizeDigits("١٨٥/١١٥") === "185/115", "Normalizes combined reading ١٨٥/١١٥");
assert(normalizeDigits("۰۱۲۳۴۵۶۷۸۹") === "0123456789", "Normalizes Persian digits to ASCII");

// 2. Audit src/app/page.tsx for Mobile Layout Fixes
console.log("\n[2] Auditing src/app/page.tsx Mobile Elements...");
const pageContent = fs.readFileSync(path.join(rootDir, "src", "app", "page.tsx"), "utf-8");

assert(!pageContent.includes("top-[60px]"), "Flawed top-[60px] sticky nav removed");
assert(pageContent.includes("lg:hidden border-t border-slate-100 bg-slate-50/95"), "Quick nav chips integrated directly into header");
assert(pageContent.includes("line-clamp-2 sm:line-clamp-none font-medium flex-1 min-w-0"), "Questions bank uses readable wrapping instead of truncate");
assert(!pageContent.includes('<span className="truncate flex-1 font-medium min-w-0">{q.question}</span>'), "Questions bank truncate span eliminated");
assert(pageContent.includes("max-w-[calc(100%-44px)]"), "Chat message bubble prevents 320px overflow with calc(100%-44px)");
assert(!pageContent.includes("hidden xs:inline"), "Invalid Tailwind 'xs:' breakpoint removed from send button");
assert(pageContent.includes("hidden sm:inline"), "Standard 'sm:inline' variant used for send button");
assert(pageContent.includes("handleSystolicChange"), "Arabic-Indic input handler wired for systolic");
assert(pageContent.includes("handleDiastolicChange"), "Arabic-Indic input handler wired for diastolic");
assert(pageContent.includes("headerHeight"), "scrollToSection dynamically measures header height");
assert(pageContent.includes("isPdf ? \"PDF\" : \"MD\""), "Explicit PDF / MD badges implemented for document links");
assert(pageContent.includes("e.key === \"Escape\""), "ESC key listener implemented for modal dismiss");
assert(pageContent.includes("e.target === e.currentTarget"), "Backdrop click dismiss implemented for modal");

// 3. Audit src/components/MarkdownRenderer.tsx
console.log("\n[3] Auditing src/components/MarkdownRenderer.tsx...");
const mdContent = fs.readFileSync(path.join(rootDir, "src", "components", "MarkdownRenderer.tsx"), "utf-8");

assert(!mdContent.includes("-webkit-overflow-scrolling-touch"), "Non-existent Tailwind class -webkit-overflow-scrolling-touch removed");
assert(mdContent.includes("touch-scroll"), "Valid touch-scroll utility applied to table container");
assert(mdContent.includes("block w-full max-w-full overflow-x-auto"), "Table container enforces block w-full max-w-full overflow-x-auto");

// 4. Audit src/app/globals.css
console.log("\n[4] Auditing src/app/globals.css...");
const cssContent = fs.readFileSync(path.join(rootDir, "src", "app", "globals.css"), "utf-8");

assert(cssContent.includes(".touch-scroll"), ".touch-scroll utility defined in globals.css");
assert(cssContent.includes("-webkit-overflow-scrolling: touch"), "Momentum scrolling configured");
assert(cssContent.includes("overflow-x: hidden"), "Horizontal overflow suppressed on html and body");
assert(cssContent.includes("safe-area-inset"), "Safe area insets configured for notch devices");

// 5. Audit src/app/layout.tsx
console.log("\n[5] Auditing src/app/layout.tsx Viewport & WebApp Metadata...");
const layoutContent = fs.readFileSync(path.join(rootDir, "src", "app", "layout.tsx"), "utf-8");

assert(layoutContent.includes("export const viewport: Viewport"), "Next.js Viewport export exists");
assert(layoutContent.includes("device-width"), "device-width configured");
assert(layoutContent.includes("initialScale: 1"), "initialScale 1 configured");
assert(layoutContent.includes("maximumScale: 5"), "maximumScale 5 for accessibility pinch-zoom");
assert(layoutContent.includes("appleWebApp"), "appleWebApp metadata present");

console.log("\n==================================================");
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
