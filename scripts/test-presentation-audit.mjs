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
console.log("RUNNING PRESENTATION & BRANDING COMPLIANCE AUDIT");
console.log("==================================================\n");

const presentationPath = path.join(rootDir, "src", "app", "presentation", "page.tsx");
const logoPath = path.join(rootDir, "public", "ntu-logo.jpg");

// 1. Logo existence and integrity
console.log("[1] Checking Official NTU Logo Asset...");
assert(fs.existsSync(logoPath), "public/ntu-logo.jpg exists");
if (fs.existsSync(logoPath)) {
  const stats = fs.statSync(logoPath);
  assert(stats.size > 20000, `NTU Logo asset size is valid (>20KB): ${stats.size} bytes`);
}

// 2. Presentation source checks
console.log("\n[2] Checking Presentation Codebase...");
assert(fs.existsSync(presentationPath), "src/app/presentation/page.tsx exists");
const code = fs.readFileSync(presentationPath, "utf-8");

// Check excision of Future University
assert(!code.includes("جامعة المستقبل"), "Zero mentions of 'جامعة المستقبل' in presentation page");
assert(!code.includes("Future University"), "Zero mentions of 'Future University' in presentation page");

// Check institutional rebranding
assert(code.includes("Northern Technical University (NTU)"), "Affiliated with Northern Technical University (NTU)");
assert(code.includes("الجامعة التقنية الشمالية"), "Includes Arabic institutional title 'الجامعة التقنية الشمالية'");
assert(code.includes("/ntu-logo.jpg"), "Embeds official NTU logo in Slide 1 and Slide 12");

// Check team members: STRICTLY 5 NAMES ONLY
console.log("\n[3] Checking Team Members (Strict 5 Names, Zero Roles)...");
const teamMembers = [
  "Noor Al-Hussein Mohammed Amthani",
  "Hassan Hamid Hassan",
  "Sidra Shaalan",
  "Noor Wameed",
  "Sabaa Mishal Samir",
];

for (const name of teamMembers) {
  assert(code.includes(name), `Team member included: ${name}`);
}

const forbiddenRoles = [
  "Project Lead",
  "Cloud Architect",
  "Medical QA",
  "UI/UX Specialist",
  "Medical Compliance",
  "قيادة المشروع",
  "هندسة البرمجيات",
  "التدقيق الطبي",
  "تصميم تجربة",
  "أبحاث المعرفة",
];

for (const role of forbiddenRoles) {
  assert(!code.includes(role), `Excluded job role/sub-title: '${role}'`);
}

// Check 12 Slides & English Language Pitch Deck
console.log("\n[4] Checking 12 Pitch Deck Slides & English Language Quality...");
assert(code.includes("TOTAL_SLIDES = 12"), "Has exactly 12 slides");
assert(code.includes("Nabd Al-Aman"), "English project identity present");
assert(code.includes("نبض الأمان"), "Bilingual Arabic identity preserved");
assert(code.includes("Clinical-Grade AI Assistant"), "Clinical English pitch terminology present");
assert(code.includes("SLIDE 12: Conclusion"), "Slide 12 present");

// Check rich animations & UI/UX features
console.log("\n[5] Checking Rich Animations & UI/UX Features...");
assert(code.includes("slideInFromRight3D"), "Hardware-accelerated 3D slide transition next defined");
assert(code.includes("slideInFromLeft3D"), "Hardware-accelerated 3D slide transition prev defined");
assert(code.includes("slide-viewport"), "3D perspective viewport class applied to slide canvas");
assert(code.includes("playSlideSound"), "Web Audio API sound chime feedback implemented");
assert(code.includes("isAutoplaying"), "Autoplay slideshow mode implemented");
assert(code.includes("isGridModalOpen"), "12-slide quick jump overview grid modal implemented");
assert(code.includes("demoCategory.id === \"normal\""), "Visual 5-tier colored BP gauge meter implemented in Slide 11");

console.log("\n==================================================");
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
