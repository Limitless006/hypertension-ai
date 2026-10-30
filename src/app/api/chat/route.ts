import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  SYSTEM_INSTRUCTION,
  checkEmergencyCondition,
  checkPrescriptionTrap,
  checkOutOfScope,
  getLocalFallbackAnswer,
  formatResponseWithCitation,
} from "@/lib/chat-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, messages } = body;

    // استخراج نص الرسالة الأخيرة وسياق المحادثة
    let userPrompt = "";
    let rawHistory: { role: "user" | "model"; parts: { text: string }[] }[] = [];

    if (Array.isArray(messages) && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      userPrompt = lastMsg.content || lastMsg.text || "";
      rawHistory = messages.slice(0, -1).map((m: any) => ({
        role: (m.role === "assistant" || m.role === "model" ? "model" : "user") as "user" | "model",
        parts: [{ text: m.content || m.text || "" }],
      }));
    } else if (typeof message === "string") {
      userPrompt = message;
    }

    if (!userPrompt || !userPrompt.trim()) {
      return NextResponse.json(
        { error: "الرجاء إدخال سؤال أو استفسار طبي صالح." },
        { status: 400 }
      );
    }

    // تنظيف تاريخ المحادثة وفق متطلبات Gemini API الصارمة:
    // 1. يجب أن تبدأ المحادثة دائماً بدور 'user' (حذف أي رسائل 'model' سابقة مثل رسالة الترحيب الأولى)
    while (rawHistory.length > 0 && rawHistory[0].role === "model") {
      rawHistory.shift();
    }

    // 2. التحقق من التناوب الصحيح user -> model -> user -> model
    const conversationHistory: { role: "user" | "model"; parts: { text: string }[] }[] = [];
    for (const msg of rawHistory) {
      if (!msg.parts[0]?.text?.trim()) continue;
      if (conversationHistory.length === 0) {
        if (msg.role === "user") {
          conversationHistory.push(msg);
        }
      } else {
        const lastRole = conversationHistory[conversationHistory.length - 1].role;
        if (lastRole !== msg.role) {
          conversationHistory.push(msg);
        } else {
          // دمج الرسائل المتتالية لنفس الدور
          conversationHistory[conversationHistory.length - 1].parts[0].text += "\n" + msg.parts[0].text;
        }
      }
    }

    // فحص مسبق محلي لأزمة الطوارئ وحيل الوصفات وخارج النطاق (Deterministic Clinical Guardrails)
    const emergencyCheck = checkEmergencyCondition(userPrompt);
    const trapCheck = checkPrescriptionTrap(userPrompt);
    const scopeCheck = checkOutOfScope(userPrompt);

    // 1. إذا وُجد فخ وصفات أو طلب جرعة، نرد مباشرة بميثاق الأمان الطبي المعتمد
    if (trapCheck.isTrap) {
      const fallback = getLocalFallbackAnswer(userPrompt);
      return NextResponse.json({
        reply: fallback.reply,
        sources: fallback.sources,
        isAiGenerated: false,
      });
    }

    // 2. إذا رُصدت أزمة طوارئ حرجة (>180/120 أو أعراض خطرة)، نرد فوراً ببروتوكول الطوارئ المعتمد لإنقاذ الحياة دون تأخير
    if (emergencyCheck.isEmergency) {
      const fallback = getLocalFallbackAnswer(userPrompt);
      return NextResponse.json({
        reply: fallback.reply,
        sources: fallback.sources,
        isAiGenerated: false,
      });
    }

    // 3. إذا كان السؤال خارج نطاق التخصص الطبي لضغط الدم، نعتذر بلباقة وفق ميثاق التخصص
    if (scopeCheck.isOutOfScope) {
      const fallback = getLocalFallbackAnswer(userPrompt);
      return NextResponse.json({
        reply: fallback.reply,
        sources: fallback.sources,
        isAiGenerated: false,
      });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    // محاولة الاتصال بالذكاء الاصطناعي التوليدي عبر Gemini SDK الرسمي
    if (apiKey && !apiKey.startsWith("YOUR_")) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelNames = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
        let aiText = "";

        for (const modelName of modelNames) {
          try {
            const model = genAI.getGenerativeModel({
              model: modelName,
              systemInstruction: SYSTEM_INSTRUCTION,
            });

            if (conversationHistory.length > 0) {
              const chat = model.startChat({ history: conversationHistory });
              const result = await chat.sendMessage(userPrompt);
              aiText = result.response.text();
            } else {
              const result = await model.generateContent(userPrompt);
              aiText = result.response.text();
            }

            if (aiText && aiText.trim()) {
              break;
            }
          } catch (mErr) {
            continue;
          }
        }

        if (aiText && aiText.trim()) {
          let finalReply = aiText.trim();

          const officialSources = [
            "منظمة الصحة العالمية (WHO)",
            "جمعية القلب الأمريكية (AHA)",
            "الجمعية الأوروبية لأمراض القلب (ESC)",
            "المعهد الوطني للصحة (NIH)",
            "مايو كلينك (Mayo Clinic)",
            "وزارة الصحة العراقية (Iraqi MOH)",
          ];

          // إجبار التوثيق بالمصدر المعتمد في نهاية الإجابة
          finalReply = formatResponseWithCitation(finalReply, officialSources);

          return NextResponse.json({
            reply: finalReply,
            sources: officialSources,
            isAiGenerated: true,
          });
        }
      } catch (geminiError: any) {
        console.warn("Gemini API call failed, activating verified clinical knowledge engine:", geminiError?.message || geminiError);
      }
    }

    // الاعتماد على المحرك الطبي المعرفي الموثق كمرجع فوري ذكي
    const fallback = getLocalFallbackAnswer(userPrompt);
    return NextResponse.json({
      reply: formatResponseWithCitation(fallback.reply, fallback.sources),
      sources: fallback.sources,
      isAiGenerated: false,
    });
  } catch (error: any) {
    console.error("Chat API Route Error:", error);
    return NextResponse.json(
      {
        error: "حدث خطأ غير متوقع أثناء معالجة الاستشارة الطبية.",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
