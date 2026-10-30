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
console.log("RUNNING HYPERTENSION-AI 6-SOURCE & QUALITY AUDIT TESTS");
console.log("==================================================\n");

// 1. Verify Public Sources Files (All 6 organizations: 7 Markdown + 7 PDF + Catalog)
console.log("[1] Verifying public/sources documents (Markdown & PDF)...");
const requiredMdFiles = [
  "who-hypertension-factsheet.md",
  "who-guideline-pharmacological-treatment.md",
  "aha-bp-readings-measurement-protocol.md",
  "esc-hypertension-guidelines.md",
  "nih-dash-diet-guide.md",
  "mayo-clinic-hypertension-guide.md",
  "iraqi-moh-hypertension-guideline.md",
  "sources-catalog.json",
];

const requiredPdfFiles = [
  "who-hypertension-factsheet.pdf",
  "who-guideline-pharmacological-treatment.pdf",
  "aha-bp-readings-measurement-protocol.pdf",
  "esc-hypertension-guidelines.pdf",
  "nih-dash-diet-guide.pdf",
  "mayo-clinic-hypertension-guide.pdf",
  "iraqi-moh-hypertension-guideline.pdf",
];

for (const f of requiredMdFiles) {
  const fullPath = path.join(rootDir, "public", "sources", f);
  const exists = fs.existsSync(fullPath);
  assert(exists, `Markdown File exists: public/sources/${f}`);
  if (exists) {
    const size = fs.statSync(fullPath).size;
    assert(size > 500, `File size is adequate (>500B): ${f} (${size} bytes)`);
  }
}

for (const f of requiredPdfFiles) {
  const fullPath = path.join(rootDir, "public", "sources", f);
  const exists = fs.existsSync(fullPath);
  assert(exists, `PDF File exists: public/sources/${f}`);
  if (exists) {
    const size = fs.statSync(fullPath).size;
    assert(size > 500, `PDF size is adequate (>500B): ${f} (${size} bytes)`);
  }
}

// 2. Verify sources-catalog.json content
console.log("\n[2] Verifying sources-catalog.json structure with all 6 sources...");
try {
  const catalogData = JSON.parse(
    fs.readFileSync(path.join(rootDir, "public", "sources", "sources-catalog.json"), "utf8")
  );
  assert(Array.isArray(catalogData), "sources-catalog.json is an array");
  assert(catalogData.length >= 6, `Catalog contains all 6+ sources (found: ${catalogData.length})`);
  const orgs = catalogData.map((s) => s.organization);
  assert(orgs.some((o) => o.includes("WHO")), "Catalog includes WHO (منظمة الصحة العالمية)");
  assert(orgs.some((o) => o.includes("AHA")), "Catalog includes AHA (جمعية القلب الأمريكية)");
  assert(orgs.some((o) => o.includes("ESC")), "Catalog includes ESC (الجمعية الأوروبية لأمراض القلب)");
  assert(orgs.some((o) => o.includes("NIH")), "Catalog includes NIH (المعهد الوطني للصحة)");
  assert(orgs.some((o) => o.includes("Mayo")), "Catalog includes Mayo Clinic (مايو كلينك)");
  assert(orgs.some((o) => o.includes("العراق") || o.includes("MOH")), "Catalog includes Iraqi MOH (وزارة الصحة العراقية)");
} catch (err) {
  assert(false, `Failed to parse sources-catalog.json: ${err.message}`);
}

// 3. Verify Medical Knowledge Base & Classification
console.log("\n[3] Verifying Classification logic & 6-Source Knowledge base...");
import("../src/data/medical-knowledge.ts")
  .then(async (medModule) => {
    const { BP_CATEGORIES, classifyBloodPressure, MEDICAL_KNOWLEDGE_BASE } = medModule;

    assert(Array.isArray(BP_CATEGORIES) && BP_CATEGORIES.length === 5, "BP_CATEGORIES has exactly 5 categories");
    assert(typeof MEDICAL_KNOWLEDGE_BASE === "string" && MEDICAL_KNOWLEDGE_BASE.length > 8000, "MEDICAL_KNOWLEDGE_BASE is comprehensive (>8000 chars)");

    // Check all clinical sections exist in knowledge base
    assert(MEDICAL_KNOWLEDGE_BASE.includes("الأساسيات والفيزيولوجيا"), "Knowledge base covers Section 1: Physiology");
    assert(MEDICAL_KNOWLEDGE_BASE.includes("جدول التصنيف المعتمد"), "Knowledge base covers Section 2: AHA Table");
    assert(MEDICAL_KNOWLEDGE_BASE.includes("المقارنة التشخيصية الدقيقة بين النظام الأمريكي (AHA) والنظام الأوروبي (ESC)"), "Knowledge base covers Section 2.3: AHA vs ESC diagnostic comparison");
    assert(MEDICAL_KNOWLEDGE_BASE.includes("بروتوكول القياس المنزلي"), "Knowledge base covers Section 3: Home Measurement");
    assert(MEDICAL_KNOWLEDGE_BASE.includes("نظام DASH الغذائي"), "Knowledge base covers Section 4: DASH Diet");
    assert(MEDICAL_KNOWLEDGE_BASE.includes("علم الأدوية"), "Knowledge base covers Section 5: Pharmacology & Rebound");
    assert(MEDICAL_KNOWLEDGE_BASE.includes("البروتوكول الوطني لوزارة الصحة العراقية"), "Knowledge base covers Section 6: Iraqi MOH Guidelines");

    // Check all 6 sources are cited
    assert(MEDICAL_KNOWLEDGE_BASE.includes("WHO"), "Knowledge base explicitly cites WHO");
    assert(MEDICAL_KNOWLEDGE_BASE.includes("AHA"), "Knowledge base explicitly cites AHA");
    assert(MEDICAL_KNOWLEDGE_BASE.includes("ESC"), "Knowledge base explicitly cites ESC");
    assert(MEDICAL_KNOWLEDGE_BASE.includes("NIH"), "Knowledge base explicitly cites NIH");
    assert(MEDICAL_KNOWLEDGE_BASE.includes("Mayo Clinic"), "Knowledge base explicitly cites Mayo Clinic");
    assert(MEDICAL_KNOWLEDGE_BASE.includes("العراقية"), "Knowledge base explicitly cites Iraqi MOH");

    // Test Classification edge cases
    assert(classifyBloodPressure(115, 75).urgencyLevel === "normal", "115/75 -> normal");
    assert(classifyBloodPressure(119, 79).urgencyLevel === "normal", "119/79 -> normal boundary");
    assert(classifyBloodPressure(125, 78).urgencyLevel === "elevated", "125/78 -> elevated");
    assert(classifyBloodPressure(135, 75).urgencyLevel === "stage1", "135/75 (high sys) -> stage1");
    assert(classifyBloodPressure(115, 85).urgencyLevel === "stage1", "115/85 (high dia) -> stage1");
    assert(classifyBloodPressure(145, 85).urgencyLevel === "stage2", "145/85 -> stage2");
    assert(classifyBloodPressure(130, 95).urgencyLevel === "stage2", "130/95 (dia >= 90) -> stage2");
    assert(classifyBloodPressure(185, 90).urgencyLevel === "crisis", "185/90 (sys > 180) -> crisis");
    assert(classifyBloodPressure(140, 125).urgencyLevel === "crisis", "140/125 (dia > 120) -> crisis");
    assert(classifyBloodPressure(200, 130).urgencyLevel === "crisis", "200/130 -> crisis");
    assert(classifyBloodPressure(0, 0).urgencyLevel === "normal", "0/0 handles gracefully");
    assert(classifyBloodPressure(NaN, NaN).urgencyLevel === "normal", "NaN handles gracefully");

    // 4. Verify Phase 3: Questions Bank
    console.log("\n[4] Verifying Questions Bank (15 questions in 4 tabs with citations)...");
    const qModule = await import("../src/data/questions-bank.ts");
    const { QUESTIONS_BANK, QUESTION_TABS, findMatchingQuestion } = qModule;

    assert(QUESTION_TABS.length === 4, "QUESTION_TABS has exactly 4 categories");
    assert(QUESTIONS_BANK.length === 15, `QUESTIONS_BANK has exactly 15 questions (found: ${QUESTIONS_BANK.length})`);

    // Verify category distribution
    const basicsCount = QUESTIONS_BANK.filter((q) => q.categoryId === "basics").length;
    const readingsCount = QUESTIONS_BANK.filter((q) => q.categoryId === "readings").length;
    const lifestyleCount = QUESTIONS_BANK.filter((q) => q.categoryId === "lifestyle").length;
    const medsCount = QUESTIONS_BANK.filter((q) => q.categoryId === "meds_emergency").length;

    assert(basicsCount === 4, `Basics category has 4 questions (found: ${basicsCount})`);
    assert(readingsCount === 4, `Readings category has 4 questions (found: ${readingsCount})`);
    assert(lifestyleCount === 4, `Lifestyle category has 4 questions (found: ${lifestyleCount})`);
    assert(medsCount === 3, `Meds & Emergency category has 3 questions (found: ${medsCount})`);

    // Verify all 15 questions have accredited citations
    const allHaveCitations = QUESTIONS_BANK.every((q) => q.modelAnswer.includes("المصدر المعتمد لهذه المعلومة"));
    assert(allHaveCitations, "ALL 15 questions in questions bank contain explicit citation footers");

    // Verify all PDF files are multi-page and have valid PDF headers
    for (const f of requiredPdfFiles) {
      const fullPath = path.join(rootDir, "public", "sources", f);
      const pdfText = fs.readFileSync(fullPath, "utf8");
      assert(pdfText.startsWith("%PDF-1.4"), `PDF header valid: ${f}`);
      assert(pdfText.includes("/Count 2") || pdfText.includes("/Count 3"), `PDF is multi-page: ${f}`);
      assert(!pdfText.includes("(#                      \\(WHO\\))"), `PDF has NO stripped whitespace corruption: ${f}`);
    }

    // Verify Question 7 specifically covers AHA vs ESC comparison
    const q7 = QUESTIONS_BANK.find((q) => q.id === "q7-classify-reading-135");
    assert(q7 !== null, "Question 7 exists in questions bank");
    assert(q7.modelAnswer.includes("AHA") && q7.modelAnswer.includes("مرحلة أولى"), "Question 7 explains AHA Stage 1");
    assert(q7.modelAnswer.includes("ESC") && q7.modelAnswer.includes("طبيعي مرتفع"), "Question 7 explains ESC High-Normal");
    assert(q7.modelAnswer.includes("المصدر المعتمد لهذه المعلومة"), "Question 7 includes citation heading");

    // Test findMatchingQuestion offline matcher
    const match1 = findMatchingQuestion("لماذا يسمى بالقاتل الصامت؟");
    assert(match1 !== null && match1.id === "q1-silent-killer", "findMatchingQuestion: matches silent killer query");

    const match2 = findMatchingQuestion("هل قراءة 135/85 تعتبر مرض ضغط دم أم طبيعي؟");
    assert(match2 !== null && match2.id === "q7-classify-reading-135", "findMatchingQuestion: matches 135/85 AHA vs ESC query");

    const match3 = findMatchingQuestion("ما هو نظام DASH الغذائي؟");
    assert(match3 !== null && match3.id === "q9-dash-diet-details", "findMatchingQuestion: matches DASH query");

    const match4 = findMatchingQuestion("كيف تعمل المجموعات الدوائية لمرضى الضغط في العراق؟");
    assert(match4 !== null && match4.id === "q13-drug-classes-mechanism", "findMatchingQuestion: matches pharmacology & Iraq EML query");

    // Test colloquial Iraqi emergency and prescription trap checks
    const { checkEmergencyCondition, checkPrescriptionTrap } = await import("../src/lib/chat-engine.ts");
    assert(checkEmergencyCondition("والدي ضغطه 195/125 وعنده وجع بقلبه ولسانه ثكيل").isEmergency, "Emergency check: detects Iraqi dialect 'وجع بقلبه ولسانه ثكيل'");
    assert(checkPrescriptionTrap("انطيني علاج للضغط 160").isTrap, "Prescription check: detects Iraqi dialect 'انطيني علاج'");
    assert(checkPrescriptionTrap("شنو اخذ حبوب للضغط").isTrap, "Prescription check: detects Iraqi dialect 'شنو اخذ حبوب'");

    // Summary
    console.log("\n==================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error("Test execution error:", err);
    process.exit(1);
  });
