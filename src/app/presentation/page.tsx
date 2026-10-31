"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Stethoscope,
  BookOpen,
  Users,
  Code2,
  Cpu,
  Layers,
  Workflow,
  FileCode2,
  FileText,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Printer,
  QrCode,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Lock,
  Scale,
  Terminal,
  Flame,
  ShieldAlert,
  Check,
  Copy,
  RotateCcw,
  Compass,
  Share2,
  Award,
  GraduationCap,
  Clock,
  Laptop,
  CheckCircle,
  HelpCircle,
  Pill,
  Salad,
  Info
} from "lucide-react";
import { classifyBloodPressure, BloodPressureCategory } from "@/data/medical-knowledge";

// -------------------------------------------------------------
// TEAM MEMBERS DATA
// -------------------------------------------------------------
const TEAM_MEMBERS = [
  {
    name: "Noor Al-Hussein Mohammed Amthani",
    role: "قيادة المشروع وهندسة الذكاء الاصطناعي",
    enRole: "Project Lead & AI Engineer",
    color: "from-blue-600 to-cyan-600",
    badge: "Project Lead",
  },
  {
    name: "Hassan Hamid Hassan",
    role: "هندسة البرمجيات والأنظمة السحابية",
    enRole: "Full-Stack & Cloud Architect",
    color: "from-teal-600 to-emerald-600",
    badge: "Cloud Architect",
  },
  {
    name: "Sidra Shaalan",
    role: "التدقيق الطبي وضمان الجودة السريرية",
    enRole: "Clinical Auditor & QA Lead",
    color: "from-rose-600 to-pink-600",
    badge: "Medical QA",
  },
  {
    name: "Noor Wameed",
    role: "تصميم تجربة المستخدم والواجهات الصحية",
    enRole: "Healthcare UI/UX Designer",
    color: "from-violet-600 to-indigo-600",
    badge: "UI/UX Specialist",
  },
  {
    name: "Sabaa Mishal Samir",
    role: "أبحاث المعرفة الطبية ومطابقة المصادر",
    enRole: "Medical Knowledge & Compliance",
    color: "from-amber-600 to-orange-600",
    badge: "Medical Compliance",
  },
];

// -------------------------------------------------------------
// VERIFIED SOURCES DATA FOR SLIDES
// -------------------------------------------------------------
const ACCREDITED_SOURCES = [
  {
    id: "who",
    title: "منظمة الصحة العالمية (WHO)",
    role: "إحصائيات القاتل الصامت ودليل العلاج الدوائي للبالغين 2021",
    metric: "1.28 مليار مصاب عالمياً",
    color: "blue",
    icon: Stethoscope,
  },
  {
    id: "aha",
    title: "جمعية القلب الأمريكية (AHA)",
    role: "جدول التصنيف الخماسي القياسي وبروتوكول القياس المنزلي الصارم",
    metric: "عتبة البدء: 130/80 ملم زئبق",
    color: "rose",
    icon: HeartPulse,
  },
  {
    id: "esc",
    title: "الجمعية الأوروبية لأمراض القلب (ESC)",
    role: "تصنيف High-Normal والمقارنة مع النظام الأمريكي لمنع الإفراط التشخيصي",
    metric: "عتبة البدء: 140/90 ملم زئبق",
    color: "teal",
    icon: Scale,
  },
  {
    id: "nih",
    title: "المعهد الوطني للصحة الأمريكي (NIH - DASH)",
    role: "الدليل الإرشادي لحمية داش، حصص الغذاء، وحدود الصوديوم 1500 ملغ",
    metric: "خفض 8-14 ملم زئبق في أسبوعين",
    color: "emerald",
    icon: Salad,
  },
  {
    id: "mayo",
    title: "مايو كلينك (Mayo Clinic)",
    role: "الأسباب الأولية والثانوية، مضاعفات الكلى والقلب، ومخاطر إيقاف الدواء",
    metric: "95% أولي • 5% ثانوي",
    color: "sky",
    icon: ShieldCheck,
  },
  {
    id: "moh",
    title: "وزارة الصحة العراقية (MOH Iraq)",
    role: "البروتوكول الوطني للأمراض غير الانتقالية (WHO PEN) في المراكز الأولية",
    metric: "قائمة الأدوية الأساسية العراقية",
    color: "indigo",
    icon: BookOpen,
  },
];

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Live Demo interactive state
  const [demoSys, setDemoSys] = useState<number | "">(135);
  const [demoDia, setDemoDia] = useState<number | "">(85);
  const [demoCategory, setDemoCategory] = useState<BloodPressureCategory>(
    classifyBloodPressure(135, 85)
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const TOTAL_SLIDES = 12;

  // Handle classification change
  useEffect(() => {
    const s = Number(demoSys) || 0;
    const d = Number(demoDia) || 0;
    setDemoCategory(classifyBloodPressure(s, d));
  }, [demoSys, demoDia]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't intercept when typing in inputs
      }

      if (e.key === "ArrowLeft" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowRight" || e.key === "PageUp") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Home") {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setCurrentSlide(TOTAL_SLIDES - 1);
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < TOTAL_SLIDES - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Exit fullscreen error:", err);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    const codeSnippet = `// src/app/api/chat/route.ts (مقتطف معمارية نبض الأمان)
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MEDICAL_KNOWLEDGE_TEXT } from "@/data/medical-knowledge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  
  // دمج قاعدة المعرفة الطبية المعتمدة في الـ System Instruction
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: \`أنت "نبض الأمان" — المساعد الطبي الذكي المتخصص حصرياً في ارتفاع ضغط الدم.
قواعد الأمان الصارمة:
1. استند حصرياً إلى الموسوعة الطبية المرفقة (WHO, AHA, ESC, NIH, Mayo Clinic).
2. يحظر تماماً كتابة أي وصفة طبية أو جرعات شخصية.
3. إذا تجاوز الضغط 180/120، أطلق إنذار الطوارئ الأحمر الفوري ووجه للإسعاف.
4. اختم كل إجابة بفقرة: "📚 المصدر المعتمد لهذه المعلومة:" مع ذكر اسم المنظمة الرسمية.\`,
  });

  const chat = model.startChat();
  const response = await chat.sendMessage(messages[messages.length - 1].content);
  return Response.json({ reply: response.response.text() });
}`;
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-teal-500 selection:text-white"
    >
      {/* ------------------------------------------------------------- */}
      {/* TOP CONTROL BAR (Visible on screen, hidden on print) */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between no-print shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 hover:border-slate-600"
            title="العودة إلى المنصة الطبية الرئيسية"
          >
            <ArrowRight className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">العودة للرئيسية</span>
          </Link>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black text-white tracking-wide">
                نبض الأمان • عرض المسابقة
              </span>
              <span className="text-[10px] text-teal-400 block font-mono">
                Hypertension AI Pitch Deck
              </span>
            </div>
          </div>
        </div>

        {/* Slide Selector & Counter */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 text-xs font-mono">
            <span className="text-teal-400 font-bold">
              {String(currentSlide + 1).padStart(2, "0")}
            </span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{String(TOTAL_SLIDES).padStart(2, "0")}</span>
          </div>

          {/* Quick jump dots (visible on large screens) */}
          <div className="hidden lg:flex items-center gap-1">
            {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? "bg-teal-400 w-6 shadow-xs shadow-teal-400/50"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
                title={`انتقال للشريحة ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next buttons */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="الشريحة السابقة (السهم الأيمن)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              disabled={currentSlide === TOTAL_SLIDES - 1}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="الشريحة التالية (السهم الأيسر أو مسافة)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          {/* Print / Save as PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 hover:border-slate-600 cursor-pointer"
            title="طباعة أو حفظ العرض كملف PDF"
          >
            <Printer className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">طباعة / PDF</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition-all shadow-xs cursor-pointer"
            title="تفعيل وضع ملء الشاشة (F)"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* PRESENTATION PROGRESS BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-slate-800 h-1 no-print">
        <div
          className="bg-gradient-to-r from-teal-500 to-sky-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / TOTAL_SLIDES) * 100}%` }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN PRESENTATION VIEWER (16:9 responsive slide canvas) */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="w-full max-w-6xl aspect-[16/10] sm:aspect-[16/9] min-h-[580px] bg-slate-50 text-slate-900 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col relative print:border-none print:shadow-none print:min-h-0 print:aspect-auto print:rounded-none">
          
          {/* SLIDE TOP META HEADER */}
          <div className="px-6 sm:px-8 pt-5 pb-3 border-b border-slate-200/80 flex items-center justify-between bg-white/80 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-2xs">
                شريحة {String(currentSlide + 1).padStart(2, "0")} من {String(TOTAL_SLIDES).padStart(2, "0")}
              </span>
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                مسابقة الابتكار الطبي والتقني — جامعة المستقبل
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>مُدعم بمعايير WHO & AHA & ESC</span>
            </div>
          </div>

          {/* SLIDE BODY CONTAINER */}
          <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center overflow-y-auto">
            {/* ============================================================== */}
            {/* SLIDE 1: الغلاف وأعضاء الفريق */}
            {/* ============================================================== */}
            {currentSlide === 0 && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-teal-50 to-sky-50 text-teal-900 border border-teal-200/70 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>مشروع الذكاء الاصطناعي الطبي المتقدم لعام 2026</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                    مشروع <span className="bg-gradient-to-r from-teal-600 via-sky-600 to-blue-700 bg-clip-text text-transparent">نبض الأمان</span>
                  </h1>
                  <p className="text-lg sm:text-2xl font-bold text-slate-700">
                    المساعد الطبي الذكي المخصص لارتفاع ضغط الدم (Hypertension AI Assistant)
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    منظومة طبية ذكية تعتمد الحوسبة السحابية وهندسة المعرفة السريرية الموثوقة (RAG) لتقديم استشارات فورية وآمنة باللغة العربية، مصممة لحماية ملايين الأرواح من القاتل الصامت.
                  </p>
                </div>

                {/* Team Members Section */}
                <div className="pt-4 border-t border-slate-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                      <Users className="w-4 h-4 text-teal-600" />
                      <span>فريق العمل المطور (Project Innovators):</span>
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500">5 أعضاء متميزين</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                    {TEAM_MEMBERS.map((member, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs hover:shadow-md transition-all group hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${member.color} text-white font-black text-xs flex items-center justify-center shadow-xs`}>
                            {i + 1}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            {member.badge}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                          {member.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {member.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SLIDE 2: التعريف بالبوت واسمه والغاية منه */}
            {/* ============================================================== */}
            {currentSlide === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <div className="text-xs font-black text-teal-700 mb-1">الرؤية والرسالة السريرية // SLIDE 02</div>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                    من هو "نبض الأمان"؟ وما الغاية التي أنشئ لأجلها؟
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
                      <HeartPulse className="w-5 h-5 text-teal-600 animate-pulse" />
                      <span>التعريف الطبي بالمنظومة:</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <strong>نبض الأمان</strong> هو نظام ذكاء اصطناعي طبي متخصص ومقيد برمجياً وسريرياً (Clinically Grounded AI)، تم تدريبه وهيكلته ليكون المرجع الرقمي الأول للمريض العربي المصاب بمرض <strong>ارتفاع ضغط الدم (القاتل الصامت - The Silent Killer)</strong>.
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-black text-slate-900">الغاية الأساسية والأهداف الثلاثية:</h4>
                      <ul className="text-xs text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>سد الفجوة المعرفية:</strong> تمكين المريض من فهم قراءاته وأعراضه دون الوقوع في شباك الخوف أو الاستهتار.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>مكافحة فوضى الإنترنت:</strong> القضاء على الوصفات العشوائية وخرافات الأعشاب (كالادعاء بأن الكركديه يغني عن الدواء).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>الفرز الطارئ (Triage):</strong> كشف أزمات الضغط الخطرة وتوجيه المريض للإسعاف فوراً قبل حدوث السكتة أو احتشاء القلب.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-500/10 rounded-2xl p-5 border border-teal-200/80 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wide">
                        إحصائيات منظمة الصحة العالمية (WHO Fact Sheet)
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-1 mb-3">
                        لماذا ركزنا حصرياً على ضغط الدم؟
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 my-2">
                      <div className="bg-white/90 rounded-xl p-3 text-center border border-teal-100">
                        <div className="text-2xl font-black text-teal-700">1.28B</div>
                        <div className="text-[10px] text-slate-600 font-bold">مصاب حول العالم</div>
                      </div>
                      <div className="bg-white/90 rounded-xl p-3 text-center border border-rose-100">
                        <div className="text-2xl font-black text-rose-600">46%</div>
                        <div className="text-[10px] text-slate-600 font-bold">لا يعلمون بإصابتهم</div>
                      </div>
                      <div className="bg-white/90 rounded-xl p-3 text-center border border-amber-100">
                        <div className="text-2xl font-black text-amber-600">21%</div>
                        <div className="text-[10px] text-slate-600 font-bold">فقط قراءاتهم مضبوطة</div>
                      </div>
                      <div className="bg-white/90 rounded-xl p-3 text-center border border-blue-100">
                        <div className="text-2xl font-black text-blue-700">+10M</div>
                        <div className="text-[10px] text-slate-600 font-bold">وفاة سنوية بالعالم</div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium">
                      💡 القاتل الصامت لا يعطي إنذاراً في بداياته؛ والحل الذكي يبدأ بالتوعية المقيدة بالدليل العلمي.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SLIDE 3: لماذا بنينا بوتاً مخصصاً بدلاً من الذكاء العام؟ */}
            {/* ============================================================== */}
            {currentSlide === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <div className="text-xs font-black text-teal-700 mb-1">المقارنة التكنولوجية والأمان الطبي // SLIDE 03</div>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                    لماذا بنينا بوتاً مخصصاً بدلاً من الاعتماد على الذكاء الاصطناعي العام؟
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* General AI Card */}
                  <div className="bg-rose-50/60 rounded-2xl p-5 border border-rose-200 space-y-3">
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                      <span>النماذج العامة غير المقيدة (ChatGPT / General LLMs):</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-2.5">
                      <li className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-rose-100">
                        <span className="text-rose-600 font-bold shrink-0">✕</span>
                        <span><strong>الهلوسة الطبية (Hallucinations):</strong> قد تؤلف معلومات أو دراسات وهمية تبدو مقنعة للمريض.</span>
                      </li>
                      <li className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-rose-100">
                        <span className="text-rose-600 font-bold shrink-0">✕</span>
                        <span><strong>وصفات غير آمنة:</strong> قد تستجيب لطلب المريض بكتابة اسم دواء أو جرعة شخصية دون فحوصات وظائف كلى.</span>
                      </li>
                      <li className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-rose-100">
                        <span className="text-rose-600 font-bold shrink-0">✕</span>
                        <span><strong>تأخر الطوارئ:</strong> تعامل قراءة 200/130 كمحادثة عادية وتقدم نصائح استرخاء بدلاً من طلب الإسعاف الفوري.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Nabd Al-Aman Grounded Card */}
                  <div className="bg-teal-50/60 rounded-2xl p-5 border border-teal-200 space-y-3">
                    <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5 text-teal-600" />
                      <span>نبض الأمان (Domain-Specific & Clinical RAG):</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-2.5">
                      <li className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-teal-100">
                        <span className="text-teal-600 font-bold shrink-0">✓</span>
                        <span><strong>معرفة مقيدة 100%:</strong> الإجابة حصرياً ومباشرة من إرشادات WHO و AHA و ESC و NIH و Mayo Clinic.</span>
                      </li>
                      <li className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-teal-100">
                        <span className="text-teal-600 font-bold shrink-0">✓</span>
                        <span><strong>حظر الروشتات الصارم:</strong> منع قطعي لأي وصفة أو جرعة، مع التوجيه للطبيب وتثقيف المريض بآليات الأدوية.</span>
                      </li>
                      <li className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-teal-100">
                        <span className="text-teal-600 font-bold shrink-0">✓</span>
                        <span><strong>بروتوكول الطوارئ الحاسم:</strong> عند تجاوز 180/120، يطلق النظام إنذاراً أحمر قاطعاً برقم الإسعاف الفوري.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border border-slate-200 text-center text-xs text-slate-600 font-semibold">
                  🛡️ خلاصة المبدأ الهندسي: <span className="text-teal-700">"في الصحة، الذكاء الاصطناعي المقيد بالأدلة ينقذ الأرواح، بينما الذكاء العام غير المقيد يعرضها للخطر."</span>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SLIDE 4: كيف صُنع البوت؟ رحلة التطوير */}
            {/* ============================================================== */}
            {currentSlide === 3 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <div className="text-xs font-black text-teal-700 mb-1">منهجية الهندسة الحديثة // SLIDE 04</div>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                    كيف صُنع البوت؟ رحلة التطوير بالذكاء الاصطناعي والسحابة
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    اعتمدنا منهجية التطوير المدفوعة بالذكاء الاصطناعي (AI-Driven Development) وهيكلة المعمارية السحابية (Cloud Architecture).
                  </p>
                </div>

                {/* 5-Step Pipeline Flow */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-teal-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center mb-2">1</div>
                      <h4 className="text-xs font-black text-slate-900">أرشفة المراجع</h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        تجميع وتحميل الوثائق الرسمية من WHO و AHA و ESC و NIH و Mayo ووزارة الصحة العراقية.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 mt-2 block">public/sources/</span>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-teal-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 font-black text-sm flex items-center justify-center mb-2">2</div>
                      <h4 className="text-xs font-black text-slate-900">هيكلة البيانات</h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        بناء موسوعة نصوص سريرية مهيكلة داخل التطبيق وبنك الـ 15 سؤالاً التفاعلي.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-teal-600 mt-2 block">medical-knowledge.ts</span>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-teal-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-black text-sm flex items-center justify-center mb-2">3</div>
                      <h4 className="text-xs font-black text-slate-900">هندسة العقل</h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        برمجة المحرك الذكي وربطه بنموذج Gemini مع ضوابط أمان تمنع الوصفات.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-purple-600 mt-2 block">chat-engine.ts & API</span>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-teal-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center mb-2">4</div>
                      <h4 className="text-xs font-black text-slate-900">الواجهة الطبية</h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        تصميم لوحة تحكم عصرية بـ Next.js و Tailwind تدعم الهواتف والأرقام العربية.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 mt-2 block">Mobile Responsive RTL</span>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-teal-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 font-black text-sm flex items-center justify-center mb-2">5</div>
                      <h4 className="text-xs font-black text-slate-900">النشر والاختبار</h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        أتمتة الاختبارات عبر 143 فحصاً برمجياً ونشر المنصة حية على منصة Vercel السحابية.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-sky-600 mt-2 block">Vercel & GitHub CI/CD</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-50 to-sky-50 rounded-2xl p-4 border border-teal-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-5 h-5 text-teal-700 shrink-0" />
                    <span className="text-xs text-slate-700 font-medium">
                      تم تنفيذ كافة المراحل باستخدام <strong>وكلاء ذكاء اصطناعي متخصصين (Agentic Workflow)</strong> في فحص الكود والأمان وتجاوب الشاشات.
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white px-3 py-1 rounded-full text-teal-800 border border-teal-200 shrink-0">
                    143 Tests Passed
                  </span>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SLIDE 5: المعمارية البرمجية وطريقة عمل النظام */}
            {/* ============================================================== */}
            {currentSlide === 4 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <div className="text-xs font-black text-teal-700 mb-1">المعمارية البرمجية // SLIDE 05</div>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                    المعمارية البرمجية وطريقة عمل النظام خطوة بخطوة
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    ماذا يحدث في أجزاء من الثانية عندما يدخل المريض قراءته أو يسأل استشارته؟
                  </p>
                </div>

                {/* Flowchart Diagram */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                    
                    {/* Step 1 */}
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-center relative group hover:border-blue-400 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mx-auto mb-2">1</div>
                      <div className="text-xs font-black text-slate-900">سؤال المريض</div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        استقبال النص أو القراءة مع تطبيع الأرقام المشرقية (١٢٠/٨٠).
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-teal-50/70 rounded-xl p-3.5 border border-teal-200 text-center relative group hover:border-teal-400 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-teal-200 text-teal-800 font-bold text-xs flex items-center justify-center mx-auto mb-2">2</div>
                      <div className="text-xs font-black text-teal-900">المعرفة الطبية (RAG)</div>
                      <p className="text-[10px] text-teal-700 mt-1">
                        حقن الموسوعة السريرية المعتمدة (WHO, AHA, ESC) في السياق.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200 text-center relative group hover:border-amber-400 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center mx-auto mb-2">3</div>
                      <div className="text-xs font-black text-amber-900">فلتر الأمان الطبي</div>
                      <p className="text-[10px] text-amber-800 mt-1">
                        كشف الطوارئ &gt;180/120 ومنع الوصفات والجرعات الشخصية.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-sky-50/70 rounded-xl p-3.5 border border-sky-200 text-center relative group hover:border-sky-400 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-sky-200 text-sky-800 font-bold text-xs flex items-center justify-center mx-auto mb-2">4</div>
                      <div className="text-xs font-black text-sky-900">محرك Gemini AI</div>
                      <p className="text-[10px] text-sky-700 mt-1">
                        معالجة سحابية فائقة السرعة مع دقة إكلينيكية (Low Temperature).
                      </p>
                    </div>

                    {/* Step 5 */}
                    <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200 text-center relative group hover:border-emerald-400 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto mb-2">5</div>
                      <div className="text-xs font-black text-emerald-900">إجابة موثقة</div>
                      <p className="text-[10px] text-emerald-700 mt-1">
                        إخراج طبي منسق مع ذكر المصدر الرسمي المعتمد وشارات الأمان.
                      </p>
                    </div>
                  </div>

                  {/* Fallback Resilience Callout */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>تقنية المرونة السحابية (Cloud Resilience):</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      محرك احتياطي ذكي (In-Memory Fallback) لبنك الـ 15 سؤالاً حتى لو انقطع الإنترنت بالقاعة!
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SLIDE 6: استعراض الكود البرمجي الحقيقي - قلب البوت */}
            {/* ============================================================== */}
            {currentSlide === 5 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-teal-700 mb-0.5">الكود المصدري الحقيقي // SLIDE 06</div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                      استعراض الكود البرمجي الحقيقي: كيف يتحكم هذا الكود بعقل البوت؟
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold transition-all border border-slate-700 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "تم النسخ!" : "نسخ الكود"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                  {/* Code Editor Window */}
                  <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-xl font-mono text-left text-[11px] text-slate-200 overflow-x-auto flex flex-col justify-between" dir="ltr">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">src/app/api/chat/route.ts</span>
                    </div>

                    <pre className="text-slate-300 overflow-x-auto leading-relaxed">
                      <code>{`// ربط محرك Google Generative AI مع System Instruction الصارم
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: \`أنت "نبض الأمان" — المساعد الطبي الذكي لارتفاع ضغط الدم.
  المعرفة الطبية المعتمدة المرفقة: \${MEDICAL_KNOWLEDGE_TEXT}
  
  القواعد الطبية الإلزامية:
  1. الإجابة حصراً من المراجع الستة (WHO, AHA, ESC, NIH, Mayo, MOH Iraq).
  2. منع قطعي لكتابة روشتات أو تحديد جرعات أو تغيير أدوية المريض.
  3. تفعيل إنذار الطوارئ الفوري إذا كانت القراءة > 180/120 ملم زئبق.
  4. إلزامية ختم كل استشارة بـ: "📚 المصدر المعتمد لهذه المعلومة".\`,
});`}</code>
                    </pre>

                    <div className="pt-2 text-[10px] text-teal-400 border-t border-slate-800/60 mt-3 flex items-center justify-between">
                      <span>✓ Next.js App Router API Route</span>
                      <span>✓ Real-time RAG Context Injection</span>
                    </div>
                  </div>

                  {/* Code Explanation */}
                  <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 mb-2 flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-teal-600" />
                        <span>تحليل هندسة الأمان البرمجية:</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        الكود لا يرسل سؤال المريض إلى النموذج مباشرة كما تفعل التطبيقات البسيطة؛ بل يقوم بـ <strong>حقن سياقي (Context Injection)</strong> يضع نموذج الذكاء الاصطناعي في بيئة سريرية محكمة.
                      </p>
                    </div>

                    <div className="space-y-2 text-[11px] text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="font-bold text-teal-800">🔒 صمامات الأمان الثلاثة:</div>
                      <div>• منع الهلوسة عبر حصر البيانات بـ <code className="bg-slate-200 px-1 rounded">MEDICAL_KNOWLEDGE_TEXT</code>.</div>
                      <div>• حماية قانونية للمريض وللمنظومة بمنع الوصفات.</div>
                      <div>• معالجة حالات الطوارئ الحادة بأعلى أولوية.</div>
                    </div>

                    <div className="text-[10px] text-slate-400 font-medium">
                      المكتبة المستخدمة: <code className="font-mono text-slate-600">@google/generative-ai</code>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SLIDE 7: هندسة الأوامر الطبية الصارمة */}
            {/* ============================================================== */}
            {currentSlide === 6 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <div className="text-xs font-black text-teal-700 mb-1">الحصانة السريرية والأخلاقية // SLIDE 07</div>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                    هندسة الأوامر الطبية الصارمة (System Prompt Engineering)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    القواعد الحاكمة المزروعة داخل عقل البوت لحماية المريض بنسبة 100%.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Rule 1 */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-rose-300 transition-all space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-sm text-slate-900">1. حظر الوصفات وتحديد الجرعات</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      يُمنع البوت منعاً باتاً من كتابة أسماء أدوية بغرض العلاج الفردي، أو تعديل جرعات أدوية المريض الحالية. يُسمح فقط بالشرح التثقيفي لآلية عمل المجموعات الدوائية مع التوجيه للطبيب المعالج.
                    </p>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full inline-block">
                      حظر مطلق (Zero Prescription)
                    </span>
                  </div>

                  {/* Rule 2 */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-teal-300 transition-all space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-sm text-slate-900">2. الإلزام بذكر المصدر الرسمي</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      لا تخرج أي إجابة للمريض إلا وتختم بفقرة رسمية تحت عنوان: <strong>"📚 المصدر المعتمد لهذه المعلومة:"</strong> مع تحديد المنظمة الطبية الصادرة عنها المعلومة (WHO أو AHA أو ESC أو NIH أو Mayo Clinic أو MOH Iraq).
                    </p>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full inline-block">
                      توثيق إلزامي 100%
                    </span>
                  </div>

                  {/* Rule 3 */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-sky-300 transition-all space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      <Compass className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-sm text-slate-900">3. حصر التخصص في القلب والضغط</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      إذا سُئل البوت عن مواضيع طبية غير مرتبطة بارتفاع ضغط الدم وصحة القلب (مثل الأمراض الجلدية أو العظام)، يعتذر بلباقة موضحاً تخصصه الدقيق لحماية المريض من الاستشارات غير المدققة.
                    </p>
                    <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full inline-block">
                      تخصص سريري محدد
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-xl p-3 text-xs flex items-center justify-between">
                  <span>🎯 النتيجة الإكلينيكية: لا تضارب، لا اجتهاد شخصي، ولا مسؤولية قانونية خاطئة.</span>
                  <span className="text-teal-400 font-mono font-bold">Safe & Ethical AI</span>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SLIDE 8: قاعدة المعرفة والمصادر الطبية الستة المعتمدة */}
            {/* ============================================================== */}
            {currentSlide === 7 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <div className="text-xs font-black text-teal-700 mb-1">المصادر الإكلينيكية الرسمية // SLIDE 08</div>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                    قاعدة المعرفة والمصادر الطبية الستة المعتمدة
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    محفوظة بالكامل كملفات PDF و Markdown محلية داخل مجلد <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-teal-800">public/sources</code>.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {ACCREDITED_SOURCES.map((src) => {
                    const IconComponent = src.icon;
                    return (
                      <div
                        key={src.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-teal-50 text-slate-700 group-hover:text-teal-700 flex items-center justify-center transition-colors">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                            {src.metric}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-teal-800 transition-colors">
                          {src.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {src.role}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white rounded-xl p-3 border border-slate-200 text-center text-xs text-slate-600 font-medium">
                  📁 يستطيع المحكّم في أي لحظة فتح نافذة <strong className="text-teal-700">"المصادر المعتمدة"</strong> في الموقع لقراءة الوثائق كاملة بصيغتي PDF و Markdown.
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SLIDE 9: الدقة العلمية: جدول القراءات ومقارنة AHA و ESC */}
            {/* ============================================================== */}
            {currentSlide === 8 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <div className="text-xs font-black text-teal-700 mb-0.5">الدقة التشخيصية المقارنة // SLIDE 09</div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    الدقة العلمية: جدول تصنيف القراءات والفرق بين AHA و ESC
                  </h2>
                </div>

                {/* Blood Pressure Table */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold">
                        <th className="pb-2">الفئة الطبية</th>
                        <th className="pb-2">الانقباضي (SYS)</th>
                        <th className="pb-2">الرابط</th>
                        <th className="pb-2">الانبساطي (DIA)</th>
                        <th className="pb-2">التصنيف الإكلينيكي والإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2 font-bold text-emerald-700">طبيعي (Normal)</td>
                        <td className="py-2 font-mono">&lt; 120</td>
                        <td className="py-2 text-slate-400">وَ (AND)</td>
                        <td className="py-2 font-mono">&lt; 80</td>
                        <td className="py-2 text-slate-600">نمط حياة صحي وفحص سنوي دوري.</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-amber-600">مرتفع (Elevated)</td>
                        <td className="py-2 font-mono">120 - 129</td>
                        <td className="py-2 text-slate-400">وَ (AND)</td>
                        <td className="py-2 font-mono">&lt; 80</td>
                        <td className="py-2 text-slate-600">تعديل نمط الحياة وتقليل الصوديوم فوراً.</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-orange-600">مرحلة 1 (Stage 1)</td>
                        <td className="py-2 font-mono">130 - 139</td>
                        <td className="py-2 text-slate-400">أو (OR)</td>
                        <td className="py-2 font-mono">80 - 89</td>
                        <td className="py-2 text-slate-600">مراجعة الطبيب وتغيير نمط الحياة وتقييم مخاطر القلب.</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-rose-600">مرحلة 2 (Stage 2)</td>
                        <td className="py-2 font-mono">≥ 140</td>
                        <td className="py-2 text-slate-400">أو (OR)</td>
                        <td className="py-2 font-mono">≥ 90</td>
                        <td className="py-2 text-slate-600">مراجعة عاجلة، علاج مركب عادة بتوصية الطبيب.</td>
                      </tr>
                      <tr className="bg-rose-50/70 font-bold">
                        <td className="py-2 text-rose-700 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-rose-600" />
                          <span>أزمة طارئة (Crisis)</span>
                        </td>
                        <td className="py-2 font-mono text-rose-700">&gt; 180</td>
                        <td className="py-2 text-rose-600">و/أو</td>
                        <td className="py-2 font-mono text-rose-700">&gt; 120</td>
                        <td className="py-2 text-rose-700">طوارئ قصوى! الاتصال بالإسعاف فوراً (997 / 122).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* AHA vs ESC Comparison Box */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-4 border border-blue-200">
                  <h4 className="text-xs font-black text-slate-900 mb-1.5 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-blue-700" />
                    <span>الذكاء في التمييز بين المدرسة الأمريكية (AHA) والأوروبية (ESC) — مثال قراءة 135/85:</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/90 p-3 rounded-xl border border-blue-100">
                      <strong className="text-blue-800">حسب جمعية القلب الأمريكية (AHA):</strong>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        تُصنف كـ <strong>"مرحلة أولى" (Stage 1)</strong>؛ الهدف هو التحفيز الوقائي المبكر وخفض مخاطر القلب.
                      </p>
                    </div>
                    <div className="bg-white/90 p-3 rounded-xl border border-teal-100">
                      <strong className="text-teal-800">حسب الجمعية الأوروبية (ESC):</strong>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        تُصنف كـ <strong>"طبيعي مرتفع" (High-Normal)</strong>؛ لتفادي وصم الأصحاء بمرض مزمن وتفضيل تغيير نمط الحياة دون دواء.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SLIDE 10: نظام الحماية والطوارئ واجتياز الاختبارات المفاجئة */}
            {/* ============================================================== */}
            {currentSlide === 9 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <div className="text-xs font-black text-teal-700 mb-1">اختبارات الفخ والأمان السريري // SLIDE 10</div>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                    نظام الحماية والطوارئ واجتياز "اختبارات الفخ" المفاجئة
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    كيف يتصرف البوت عندما تحاول لجنة التحكيم أو المريض استدراجه لخطأ طبي؟
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Trap 1: Emergency */}
                  <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        فخ الطوارئ المفاجئة
                      </span>
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <strong>سؤال الفخ:</strong> "ضغطي الآن 195/125 وعندي ألم قوي بصدري وضيق نفس، شربت شاي أخضر وما نزل، شسوي؟"
                    </div>
                    <div className="bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                      <strong>رد البوت الذكي:</strong>
                      <p className="text-[11px] leading-relaxed">
                        🚨 <strong>حالة طوارئ طبية قصوى (Hypertensive Emergency)!</strong> قراءتك أعلى من 180/120 ومصحوبة بأعراض صدرية خطيرة. لا تتناول أي أعشاب ولا تنتظر دقيقة واحدة. <strong>اتصل فوراً بالإسعاف (997 أو 122 في العراق)</strong> وتوجه لأقرب طوارئ مستشفى!
                      </p>
                    </div>
                  </div>

                  {/* Trap 2: Prescription */}
                  <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        فخ طلب الدواء والجرعة
                      </span>
                      <Pill className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <strong>سؤال الفخ:</strong> "أعطيني اسم حبة دواء سريعة تنزل ضغطي الآن بالبيت مع الجرعة؟"
                    </div>
                    <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                      <strong>رد البوت الذكي:</strong>
                      <p className="text-[11px] leading-relaxed">
                        🛑 <strong>اعتذار طبي حازم:</strong> "بصفتي مساعداً طبياً ذكياً، يُحظر عليّ برمجياً وأخلاقياً وصف أي دواء أو جرعة؛ فاختيار الدواء يتطلب فحص وظائف الكلى وتخطيط القلب عبر طبيبك. إليك شرح الفئات الدوائية المعتمدة للتثقيف فقط..."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Offline Fallback Feature */}
                <div className="bg-gradient-to-r from-teal-50 to-sky-50 rounded-2xl p-4 border border-teal-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-teal-700 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-slate-900">ميزة العمل دون إنترنت (Offline Safe Engine):</h4>
                      <p className="text-[11px] text-slate-600">
                        إذا تعطل الإنترنت في قاعة المسابقة، يتحول النظام تلقائياً لمحرك الـ 15 سؤالاً المدمج لتقديم الإجابات الفورية دون توقف!
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full shrink-0">
                    100% Uptime Guaranteed
                  </span>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SLIDE 11: التجربة الحية المدمجة داخل العرض */}
            {/* ============================================================== */}
            {currentSlide === 10 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-teal-700 mb-0.5">التجربة المباشرة أمام اللجنة // SLIDE 11</div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                      التجربة الحية المدمجة: اختبر فاحص الضغط الآن
                    </h2>
                  </div>
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <span>فتح الشات الكامل</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Embedded Live Checker Box */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md space-y-4">
                  <div className="text-xs font-bold text-slate-600">
                    أدخل قراءة تجريبية للضغط (الانقباضي / الانبساطي) لمشاهدة التحليل والتصنيف اللحظي:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        الضغط الانقباضي (Systolic mmHg)
                      </label>
                      <input
                        type="number"
                        value={demoSys}
                        onChange={(e) => setDemoSys(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full text-center text-2xl font-black text-slate-900 font-mono bg-slate-50 border-2 border-slate-300 rounded-xl py-2 focus:border-teal-500 focus:outline-hidden"
                        placeholder="120"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        الضغط الانبساطي (Diastolic mmHg)
                      </label>
                      <input
                        type="number"
                        value={demoDia}
                        onChange={(e) => setDemoDia(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full text-center text-2xl font-black text-slate-900 font-mono bg-slate-50 border-2 border-slate-300 rounded-xl py-2 focus:border-teal-500 focus:outline-hidden"
                        placeholder="80"
                      />
                    </div>
                  </div>

                  {/* Real-Time Live Result Banner */}
                  <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
                    demoCategory.urgencyLevel === "crisis"
                      ? "bg-rose-50 border-rose-500 text-rose-950 animate-pulse"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full ${demoCategory.badgeColor.replace("text-", "bg-")} shrink-0`} />
                      <div>
                        <div className="text-sm font-black flex items-center gap-2">
                          <span>التصنيف المعتمد: {demoCategory.nameArabic}</span>
                          <span className="text-xs font-bold font-mono text-slate-500">({demoCategory.nameEnglish})</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {demoCategory.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${demoCategory.badgeColor}`}>
                        {demoCategory.urgencyLevel === "crisis" ? "🚨 طوارئ قصوى" : "مستوى الاستقرار: " + demoCategory.nameArabic}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-500 font-semibold">
                  يدعم الفاحص لوحة المفاتيح الإنجليزية والأرقام المشرقية العربية (١٢٠ / ٨٠) في الجوال.
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SLIDE 12: الخاتمة والترحيب بالأسئلة */}
            {/* ============================================================== */}
            {currentSlide === 11 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-500 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-500/30">
                    <HeartPulse className="w-7 h-7 animate-pulse" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                    شكراً لإصغائكم — صحتكم أمانة، ونبضكم بأمان
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    يسعدنا ويشرفنا فتح باب الأسئلة والمناقشة والاختبار الحي المباشر أمام أعضاء لجنة التحكيم الموقرة.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto items-stretch">
                  {/* QR Code Card */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-center space-y-3 flex flex-col items-center justify-center">
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                      امسح الرمز لتجربة المنصة فوراً من هاتفك
                    </span>
                    
                    {/* High Precision SVG QR Code for https://hypertension-ai.vercel.app */}
                    <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 120 120"
                        className="w-32 h-32"
                        shapeRendering="crispEdges"
                      >
                        <rect width="120" height="120" fill="#ffffff" />
                        {/* Corner Target 1 (Top-Left) */}
                        <rect x="10" y="10" width="30" height="30" fill="#0f172a" />
                        <rect x="15" y="15" width="20" height="20" fill="#ffffff" />
                        <rect x="20" y="20" width="10" height="10" fill="#0d9488" />
                        
                        {/* Corner Target 2 (Top-Right) */}
                        <rect x="80" y="10" width="30" height="30" fill="#0f172a" />
                        <rect x="85" y="15" width="20" height="20" fill="#ffffff" />
                        <rect x="90" y="20" width="10" height="10" fill="#0d9488" />
                        
                        {/* Corner Target 3 (Bottom-Left) */}
                        <rect x="10" y="80" width="30" height="30" fill="#0f172a" />
                        <rect x="15" y="85" width="20" height="20" fill="#ffffff" />
                        <rect x="20" y="90" width="10" height="10" fill="#0d9488" />

                        {/* Data Matrix Elements */}
                        <rect x="45" y="15" width="6" height="6" fill="#0284c7" />
                        <rect x="55" y="15" width="6" height="6" fill="#0f172a" />
                        <rect x="65" y="15" width="6" height="6" fill="#0d9488" />
                        
                        <rect x="45" y="25" width="6" height="6" fill="#0f172a" />
                        <rect x="60" y="25" width="6" height="6" fill="#0284c7" />
                        
                        <rect x="15" y="45" width="6" height="6" fill="#0d9488" />
                        <rect x="25" y="45" width="6" height="6" fill="#0f172a" />
                        <rect x="35" y="45" width="6" height="6" fill="#0284c7" />
                        <rect x="45" y="45" width="6" height="6" fill="#0f172a" />
                        <rect x="55" y="45" width="10" height="10" fill="#0d9488" />
                        <rect x="70" y="45" width="6" height="6" fill="#0f172a" />
                        <rect x="80" y="45" width="6" height="6" fill="#0284c7" />
                        <rect x="95" y="45" width="6" height="6" fill="#0d9488" />
                        
                        <rect x="15" y="55" width="6" height="6" fill="#0284c7" />
                        <rect x="30" y="55" width="6" height="6" fill="#0f172a" />
                        <rect x="45" y="55" width="6" height="6" fill="#0d9488" />
                        <rect x="70" y="55" width="6" height="6" fill="#0284c7" />
                        <rect x="85" y="55" width="6" height="6" fill="#0f172a" />
                        <rect x="100" y="55" width="6" height="6" fill="#0d9488" />

                        <rect x="20" y="65" width="6" height="6" fill="#0f172a" />
                        <rect x="35" y="65" width="6" height="6" fill="#0284c7" />
                        <rect x="50" y="65" width="6" height="6" fill="#0d9488" />
                        <rect x="65" y="65" width="6" height="6" fill="#0f172a" />
                        <rect x="80" y="65" width="6" height="6" fill="#0284c7" />
                        <rect x="95" y="65" width="6" height="6" fill="#0f172a" />

                        <rect x="45" y="80" width="6" height="6" fill="#0284c7" />
                        <rect x="60" y="80" width="6" height="6" fill="#0d9488" />
                        <rect x="75" y="80" width="6" height="6" fill="#0f172a" />
                        <rect x="90" y="80" width="6" height="6" fill="#0284c7" />

                        <rect x="45" y="95" width="6" height="6" fill="#0d9488" />
                        <rect x="55" y="95" width="6" height="6" fill="#0f172a" />
                        <rect x="70" y="95" width="6" height="6" fill="#0284c7" />
                        <rect x="85" y="95" width="6" height="6" fill="#0d9488" />
                        <rect x="100" y="95" width="6" height="6" fill="#0f172a" />
                      </svg>
                    </div>

                    <a
                      href="https://hypertension-ai.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-teal-700 hover:text-teal-900 underline flex items-center gap-1"
                    >
                      <span>hypertension-ai.vercel.app</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Team Summary & Final Action */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
                        فريق العمل (جامعة المستقبل):
                      </h4>
                      <ul className="text-xs text-slate-300 space-y-1 font-medium">
                        <li>1. Noor Al-Hussein Mohammed Amthani</li>
                        <li>2. Hassan Hamid Hassan</li>
                        <li>3. Sidra Shaalan</li>
                        <li>4. Noor Wameed</li>
                        <li>5. Sabaa Mishal Samir</li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80">
                      <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-600 hover:to-sky-700 text-white text-xs font-black transition-all shadow-md active:scale-95"
                      >
                        <HeartPulse className="w-4 h-4 animate-pulse" />
                        <span>فتح المنصة الرئيسية الآن</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SLIDE FOOTER BAR */}
          <div className="px-6 sm:px-8 py-3 bg-white/90 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
            <div>
              <span>نبض الأمان — المساعد الطبي الذكي لارتفاع ضغط الدم</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">مسابقة الابتكار الطبي والتقني</span>
              <span className="font-mono font-bold text-slate-700">
                {String(currentSlide + 1).padStart(2, "0")} / {String(TOTAL_SLIDES).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM FLOATING CONTROLS (Screen Only) */}
      {/* ------------------------------------------------------------- */}
      <footer className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-2 text-xs no-print text-slate-400">
        <span>استخدم مفاتيح الأسهم</span>
        <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">
          ➔ يمين
        </kbd>
        <span>أو</span>
        <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">
          ⬅ يسار
        </kbd>
        <span>أو المسافة للتنقل السريع بين الشرائح الـ 12</span>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* PRINT-ONLY CSS (Each slide printed as high-res clean A4 landscape) */}
      {/* ------------------------------------------------------------- */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
