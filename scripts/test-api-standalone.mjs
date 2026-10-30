import {
  normalizeArabicNumerals,
  checkEmergencyCondition,
  checkPrescriptionTrap,
  getLocalFallbackAnswer,
  SYSTEM_INSTRUCTION
} from "../src/lib/chat-engine.ts";

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
console.log("TESTING CHAT ENGINE & AI SAFETY GUARDRAILS");
console.log("==================================================\n");

// 1. Emergency detection
const em1 = checkEmergencyCondition("قراءتي اليوم 190 على 125");
assert(em1.isEmergency && em1.reason === "reading", "Emergency reading (>180/120) detected");

const emArabic = checkEmergencyCondition("قراءتي ١٩٠ على ١٢٥");
assert(emArabic.isEmergency && emArabic.reason === "reading", "Eastern Arabic numerals (١٩٠/١٢٥) detected");

const emSymp = checkEmergencyCondition("عندي ألم شديد في الصدر مع كتمة في النفس");
assert(emSymp.isEmergency && emSymp.reason === "symptoms", "Dangerous clinical symptoms detected");

// 2. Anti-prescription traps
const tr1 = checkPrescriptionTrap("وش تنصحني اخذ دواء للضغط المرتفع؟");
assert(tr1.isTrap && tr1.type === "prescription", "Anti-prescription trap blocked");

const tr2 = checkPrescriptionTrap("كم ملغ ازيد جرعة الحبوب؟");
assert(tr2.isTrap && tr2.type === "dosage", "Dosage alteration trap blocked");

const tr3 = checkPrescriptionTrap("هل اقدر اقطع دواء الضغط اذا حسيت بتحسن؟");
assert(tr3.isTrap && tr3.type === "stop_med", "Medication stop (rebound) trap blocked");

// 3. Fallback answers
const fb1 = getLocalFallbackAnswer("وش تنصحني اخذ دواء للضغط؟");
assert(fb1.reply.includes("أعتذر بحزم عن وصف أي دواء") && fb1.reply.includes("Rebound Hypertension"), "Anti-prescription fallback response is clinically safe");

const fb2 = getLocalFallbackAnswer("190 / 125");
assert(fb2.reply.includes("🚨") && fb2.reply.includes("997"), "Emergency fallback response includes 997 and warning");

const fb3 = getLocalFallbackAnswer("ما هو نظام DASH الغذائي؟");
assert(fb3.reply.includes("DASH") && fb3.sources.length >= 2, "DASH diet knowledge returned with sources");

const fb4 = getLocalFallbackAnswer("كيف اتعلم لغة برمجة بايثون؟");
assert(fb4.reply.includes("أعتذر منك بلباقة") && fb4.reply.includes("متخصص حصرياً"), "Out-of-scope query politely declined");

console.log(`\n==================================================`);
console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`==================================================`);

if (failed > 0) process.exit(1);
