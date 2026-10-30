import { POST } from "../src/app/api/chat/route";
import { findMatchingQuestion, QUESTIONS_BANK } from "../src/data/questions-bank";
import { getLocalFallbackAnswer } from "../src/lib/chat-engine";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runOfflineTests() {
  console.log("==================================================");
  console.log("TASK 4: OFFLINE FALLBACK & INTERNET OUTAGE VERIFICATION");
  console.log("==================================================\n");

  // Temporarily clear API keys to simulate complete offline / API outage
  const origKey = process.env.GEMINI_API_KEY;
  const origGoogleKey = process.env.GOOGLE_API_KEY;
  delete process.env.GEMINI_API_KEY;
  delete process.env.GOOGLE_API_KEY;
  delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  try {
    // 1. Test Silent Killer Query in offline mode
    console.log("[1] Testing Silent Killer query with zero API / offline...");
    const req1 = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "لماذا يُطلق الأطباء على ارتفاع ضغط الدم لقب القاتل الصامت؟" }),
    });
    const res1 = await POST(req1 as any);
    const d1 = await res1.json();
    assert(res1.status === 200, "Offline query returns HTTP 200");
    assert(d1.isAiGenerated === false, "Offline mode correctly flagged as isAiGenerated=false");
    assert(d1.reply.includes("القاتل الصامت") && d1.reply.includes("منظمة الصحة العالمية"), "Matched correct question model answer");
    assert(d1.reply.includes("المصدر المعتمد لهذه المعلومة"), "Offline reply includes citation heading");
    assert(Array.isArray(d1.sources) && d1.sources.length >= 2, "Offline reply returns sources array");

    // 2. Test DASH Diet query in offline mode
    console.log("\n[2] Testing DASH Diet query offline...");
    const req2 = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "ما هو نظام DASH الغذائي بالتفصيل؟" }),
    });
    const res2 = await POST(req2 as any);
    const d2 = await res2.json();
    assert(d2.reply.includes("DASH") || d2.reply.includes("داش"), "Returns DASH diet details offline");
    assert(d2.reply.includes("المصدر المعتمد لهذه المعلومة"), "DASH offline reply includes citation heading");

    // 3. Test General fallback for unknown query
    console.log("\n[3] Testing general offline clinical fallback for general query...");
    const req3 = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "مرحبا، أود ملخصاً شاملاً" }),
    });
    const res3 = await POST(req3 as any);
    const d3 = await res3.json();
    assert(res3.status === 200, "Does not crash or return 500");
    assert(d3.reply.includes("نبض الأمان") && d3.reply.includes("المصدر المعتمد لهذه المعلومة"), "General fallback includes full clinical knowledge and citation");
    assert(d3.isAiGenerated === false, "Offline response correctly tagged as isAiGenerated=false");

    console.log("\n==================================================");
    console.log(`OFFLINE FALLBACK SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");

    if (failed > 0) process.exit(1);
  } finally {
    if (origKey) process.env.GEMINI_API_KEY = origKey;
    if (origGoogleKey) process.env.GOOGLE_API_KEY = origGoogleKey;
  }
}

runOfflineTests().catch((err) => {
  console.error("Offline test failed:", err);
  process.exit(1);
});
