"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Send,
  RefreshCw,
  Sparkles,
  Stethoscope,
  BookOpen,
  PhoneCall,
  HelpCircle,
  Salad,
  Pill,
  CheckCircle2,
  Trash2,
  ArrowUpRight,
  User,
  Bot,
  Copy,
  Check,
  Printer,
  FileText,
  ExternalLink,
  X,
  ChevronRight,
  Info
} from "lucide-react";
import {
  BP_CATEGORIES,
  classifyBloodPressure,
  BloodPressureCategory,
} from "@/data/medical-knowledge";
import {
  QUESTION_TABS,
  QUESTIONS_BANK,
  QuickQuestionItem,
} from "@/data/questions-bank";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isEmergency?: boolean;
}

// Preset samples for rapid competition demonstration
const PRESETS = [
  { label: "طبيعي", sys: 115, dia: 75, color: "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100" },
  { label: "مرتفع طفيفاً", sys: 125, dia: 78, color: "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100" },
  { label: "مرحلة 1", sys: 135, dia: 85, color: "bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100" },
  { label: "مرحلة 2", sys: 148, dia: 94, color: "bg-red-50 text-red-700 border-red-300 hover:bg-red-100" },
  { label: "أزمة طارئة", sys: 195, dia: 125, color: "bg-rose-100 text-rose-800 border-rose-400 font-bold hover:bg-rose-200" },
];

// Verified sources data for Modal & Section
const VERIFIED_SOURCES = [
  {
    id: "who",
    orgName: "منظمة الصحة العالمية (WHO)",
    title: "صحيفة وقائع فرط ضغط الدم ودليل العلاج الدوائي للبالغين",
    officialUrl: "https://www.who.int/ar/news-room/fact-sheets/detail/hypertension",
    localDocs: [
      { name: "صحيفة الوقائع الرسمية (Markdown)", path: "/sources/who-hypertension-factsheet.md" },
      { name: "صحيفة الوقائع الرسمية (PDF)", path: "/sources/who-hypertension-factsheet.pdf" },
      { name: "دليل العلاج الدوائي 2021 (Markdown)", path: "/sources/who-guideline-pharmacological-treatment.md" },
      { name: "دليل العلاج الدوائي 2021 (PDF)", path: "/sources/who-guideline-pharmacological-treatment.pdf" },
    ],
    badge: "مرجع عالمي موحد",
    summary: "المرجع العالمي الأساسي لوبائيات المرض (1.4 مليار بالغ مصاب)، عوامل الخطر، عتبات بدء العلاج الدوائي، وأهداف خفض الضغط (<140/90 و <130/80).",
    color: "from-blue-600 to-cyan-700",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "aha",
    orgName: "جمعية القلب الأمريكية (AHA / ACC)",
    title: "جدول تصنيف قراءات ضغط الدم والبروتوكول الرسمي للقياس المنزلي",
    officialUrl: "https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings",
    localDocs: [
      { name: "جدول التصنيف الخماسي والبروتوكول المنزلي (Markdown)", path: "/sources/aha-bp-readings-measurement-protocol.md" },
      { name: "جدول التصنيف الخماسي والبروتوكول المنزلي (PDF)", path: "/sources/aha-bp-readings-measurement-protocol.pdf" },
    ],
    badge: "المعيار الذهبي الإكلينيكي",
    summary: "جدول الفئات الخمس (طبيعي، مرتفع، مرحلة 1، مرحلة 2، أزمة الطوارئ >180/120)، الفرق بين Urgency و Emergency، وقواعد القياس المنزلي الست.",
    color: "from-red-600 to-rose-700",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: "esc",
    orgName: "الجمعية الأوروبية لأمراض القلب (ESC / ESH)",
    title: "إرشادات تشخيص وإدارة فرط ضغط الدم الشرياني والمقارنة التشخيصية مع AHA",
    officialUrl: "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Arterial-Hypertension-Management-of",
    localDocs: [
      { name: "الدليل الأوروبي والمقارنة التشخيصية مع AHA (Markdown)", path: "/sources/esc-hypertension-guidelines.md" },
      { name: "الدليل الأوروبي والمقارنة التشخيصية مع AHA (PDF)", path: "/sources/esc-hypertension-guidelines.pdf" },
    ],
    badge: "المعيار الأوروبي المقارن",
    summary: "تحديد عتبة تشخيص مرض الضغط (140/90 ملم زئبق)، وتصنيف قراءة 130-139/85-89 كـ 'طبيعي مرتفع High-Normal' وليست مرض ضغط، وتفادي الإفراط في التطبيب.",
    color: "from-amber-600 to-yellow-700",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-300",
  },
  {
    id: "nih",
    orgName: "المعهد الوطني للصحة (NIH / NHLBI)",
    title: "الدليل الرسمي لحمية داش لخفض ضغط الدم (DASH Diet Guide)",
    officialUrl: "https://www.nhlbi.nih.gov/education/dash-eating-plan",
    localDocs: [
      { name: "دليل حمية DASH والحصص وحدود الصوديوم (Markdown)", path: "/sources/nih-dash-diet-guide.md" },
      { name: "دليل حمية DASH والحصص وحدود الصوديوم (PDF)", path: "/sources/nih-dash-diet-guide.pdf" },
    ],
    badge: "التغذية العلاجية المثبتة",
    summary: "حصص المجموعات الغذائية الثماني، الثلاثي المعدني (البوتاسيوم، المغنيسيوم، الكالسيوم)، وحدود الصوديوم 2300 ملغ و 1500 ملغ ومصادر الصوديوم الخفي.",
    color: "from-emerald-600 to-teal-700",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "mayo",
    orgName: "مايو كلينك (Mayo Clinic)",
    title: "الدليل الطبي الشامل لارتفاع ضغط الدم ومضاعفاته والطب التكميلي",
    officialUrl: "https://www.mayoclinic.org/ar/diseases-conditions/high-blood-pressure",
    localDocs: [
      { name: "الدليل الشامل للتشخيص ومخاطر إيقاف الدواء (Markdown)", path: "/sources/mayo-clinic-hypertension-guide.md" },
      { name: "الدليل الشامل للتشخيص ومخاطر إيقاف الدواء (PDF)", path: "/sources/mayo-clinic-hypertension-guide.pdf" },
    ],
    badge: "الرعاية السريرية الرائدة",
    summary: "الفرق بين الضغط الأولي والثانوي، تلف الأعضاء المستهدفة (القلب، الدماغ، الكلى، العين)، خطورة التوقف المفاجئ (Rebound)، وتفنيد خرافات الأعشاب.",
    color: "from-indigo-600 to-blue-800",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: "iraqi_moh",
    orgName: "وزارة الصحة العراقية (Iraqi MOH / WHO Iraq)",
    title: "الدليل الإرشادي الوطني لإدارة ارتفاع ضغط الدم في الرعاية الصحية الأولية",
    officialUrl: "https://moh.gov.iq",
    localDocs: [
      { name: "بروتوكول الرعاية الأولية والأدوية الأساسية بالعراق (Markdown)", path: "/sources/iraqi-moh-hypertension-guideline.md" },
      { name: "بروتوكول الرعاية الأولية والأدوية الأساسية بالعراق (PDF)", path: "/sources/iraqi-moh-hypertension-guideline.pdf" },
    ],
    badge: "البروتوكول الوطني العراقي",
    summary: "المسح الروتيني لكل مراجع فوق 18 عاماً في المراكز الصحية PHCCs، أدوية الخط الأول في EML، عيادات الأمراض المزمنة NCD، ومعايير الإحالة للمستشفيات.",
    color: "from-teal-600 to-emerald-800",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-300",
  },
];

export default function HomePage() {
  // Blood Pressure Checker State
  const [systolic, setSystolic] = useState<number | "">(120);
  const [diastolic, setDiastolic] = useState<number | "">(80);
  const [analyzedCategory, setAnalyzedCategory] = useState<BloodPressureCategory>(BP_CATEGORIES[0]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Quick Questions Tab State
  const [activeTab, setActiveTab] = useState<'basics' | 'readings' | 'lifestyle' | 'meds_emergency'>('basics');

  // Verified Sources Modal State
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);

  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Chatbot State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `مرحباً بك في منصة **نبض الأمان** 🩺 — المساعد الطبي الذكي المتخصص في ارتفاع ضغط الدم وصحة القلب والشرايين.

أنا مستشارك الطبي الافتراضي، تم تدريبي ومراجعتي إكلينيكياً بالاعتماد الحصري على أحدث الأدلة والمصادر العالمية والوطنية المعتمدة:
- 🏛️ **منظمة الصحة العالمية (WHO)**
- ❤️ **جمعية القلب الأمريكية (AHA / ACC)**
- 🇪🇺 **الجمعية الأوروبية لأمراض القلب (ESC / ESH)**
- 🥗 **المعهد الوطني للصحة (NIH - دليل حمية DASH)**
- 🏥 **مايو كلينك للتعليم والبحوث الطبية (Mayo Clinic)**
- 🇮🇶 **إرشادات وزارة الصحة العراقية (Iraqi MOH)**

### كيف يمكنني مساعدتك الآن؟
1. **الفاحص الفوري:** أدخل قراءتك (الانقباضي والانبساطي) واضغط **"تحليل القراءة"** لمعرفة تصنيفها المعتمد.
2. **الأسئلة السريعة (15 سؤالاً):** اضغط على أي سؤال في الشريط العلوي للإرسال المباشر.
3. **التغذية ونمط الحياة:** استفسر عن تفاصيل حمية DASH، حدود الصوديوم، وتأثير القهوة والرياضة.
4. **المصادر المعتمدة:** اضغط زر **"المصادر المعتمدة (6)"** للاطلاع على الوثائق والمراجع الرسمية المحفوظة.`,
      timestamp: "الآن",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Real-time classification update
  const currentLiveCategory: BloodPressureCategory = classifyBloodPressure(
    Number(systolic) || 0,
    Number(diastolic) || 0
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle explicit "تحليل القراءة" action
  const handleAnalyzeReading = () => {
    const sys = Number(systolic) || 0;
    const dia = Number(diastolic) || 0;
    const cat = classifyBloodPressure(sys, dia);
    setAnalyzedCategory(cat);
    setHasAnalyzed(true);
  };

  // Handle message submission
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل الاتصال بالمساعد الطبي الذكي");
      }

      const isEmergencyAlert =
        data.reply.includes("تحذير طوارئ") ||
        data.reply.includes("أزمة ارتفاع ضغط") ||
        data.reply.includes("🚨") ||
        data.reply.includes("⚠️");

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString("ar-SA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isEmergency: isEmergencyAlert,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ واجهنا صعوبة مؤقتة في معالجة طلبك: ${
          err.message || "يرجى المحاولة مجدداً."
        }\n\n*تنبيه طوارئ*: إذا كان ضغطك أعلى من 180/120 ملم زئبق أو رافقه ألم في الصدر أو ضيق في التنفس أو تنميل، اتصل فوراً بالإسعاف (997) أو توجه لأقرب قسم طوارئ.`,
        timestamp: new Date().toLocaleTimeString("ar-SA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Ask bot about current blood pressure reading
  const handleAskAboutReading = () => {
    const sys = Number(systolic) || 0;
    const dia = Number(diastolic) || 0;
    const prompt = `سجلت قراءة ضغط دم بمقدار ${sys} انقباضي و ${dia} انبساطي (${sys}/${dia} ملم زئبق). كيف تصنف حالتي وفق المعايير الطبية المعتمدة من جمعية القلب الأمريكية AHA، وما هي النصائح والإجراءات الواجب اتباعها؟`;
    handleSendMessage(prompt);
  };

  // Copy Message to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Print Consultation
  const handlePrintChat = () => {
    window.print();
  };

  // Clear Chat
  const handleClearChat = () => {
    if (confirm("هل ترغب في بدء استشارة طبية جديدة ومسح سجل المحادثة السابق؟")) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content:
            "تم بدء جلسة استشارية جديدة. يمكنك إدخال قراءاتك في الفاحص الفوري أو اختيار أي من الأسئلة الطبية المعتمدة في الشريط العلوي.",
          timestamp: "الآن",
        },
      ]);
    }
  };

  // Scroll helper for smooth mobile navigation
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Filter questions for active tab
  const activeTabQuestions = QUESTIONS_BANK.filter((q) => q.categoryId === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white max-w-full overflow-x-hidden" dir="rtl">
      
      {/* Print-Only Header (Appears only on printed report) */}
      <div className="hidden print-only p-6 border-b-2 border-slate-900">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">نبض الأمان — تقرير الاستشارة الطبية الذكية</h1>
            <p className="text-xs text-slate-600">المساعد الطبي الذكي لارتفاع ضغط الدم • مستند إلى أدلة WHO و AHA و NIH و Mayo Clinic</p>
          </div>
          <div className="text-left text-xs font-mono">
            <p>تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}</p>
            <p>وقت الطباعة: {new Date().toLocaleTimeString('ar-SA')}</p>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-slate-500">
          تنبيه قانوني وطبي: هذا التقرير تثقيفي استرشادي ولا يغني عن الفحص السريري مع الطبيب المختص أو التحاليل المخبرية.
        </p>
      </div>

      {/* ============================================================== */}
      {/* 1. TOP PROFESSIONAL MEDICAL HEADER (WHO, AHA, NIH, Mayo Clinic) */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs no-print w-full">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-50 shrink-0">
              <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 animate-heartbeat text-white" />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-slate-950 tracking-tight">
                  نبض الأمان
                </h1>
                <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  Hypertension AI
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  مسابقة الابتكار الطبي والتقني — الفريق الطبي الذكي
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight sm:leading-normal mt-0.5">
                المساعد الطبي الذكي لارتفاع ضغط الدم • <span className="hidden sm:inline">مستند حصرياً إلى مراجع WHO و AHA و ESC و NIH و Mayo Clinic ووزارة الصحة العراقية</span><span className="sm:hidden">مستند لأدلة 6 منظمات صحية دولية معتمدة</span>
              </p>
            </div>
          </div>

          {/* Header Action Badges & Buttons */}
          <div className="grid grid-cols-2 gap-2 w-full md:flex md:w-auto md:items-center md:gap-2.5">
            {/* Live Knowledge Status Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>متصل • مُغذى بالمصادر الـ 6 المعتمدة (WHO & AHA & ESC & NIH & Mayo & MOH Iraq)</span>
            </div>

            {/* Verified Sources Modal Trigger Button */}
            <button
              type="button"
              onClick={() => setIsSourcesModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-full text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs transition-all cursor-pointer active:scale-95 text-center min-h-[38px] sm:min-h-0"
              title="عرض الوثائق والمصادر الطبية الرسمية المعتمدة"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">المصادر المعتمدة (6)</span>
            </button>

            {/* Emergency Hotline Button */}
            <a
              href="tel:997"
              className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer active:scale-95 text-center min-h-[38px] sm:min-h-0"
              title="الاتصال الفوري بالإسعاف لحالات الطوارئ الحرجة"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce shrink-0" />
              <span className="truncate">طوارئ الضغط (997)</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5">

        {/* Mobile Quick Navigation Bar (Sticky chips for fast section navigation on mobile) */}
        <div className="lg:hidden sticky top-[60px] z-30 bg-slate-50/95 backdrop-blur-md pb-2 pt-1 -mx-3 px-3 border-b border-slate-200/80 mb-3 shadow-2xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              type="button"
              onClick={() => scrollToSection("checker-section")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-blue-800 border border-slate-200 shadow-2xs whitespace-nowrap active:scale-95 shrink-0 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>🩺 فاحص الضغط</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("questions-section")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap active:scale-95 shrink-0 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>❓ الـ 15 سؤالاً</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("chat-section")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap active:scale-95 shrink-0 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-600" />
              <span>💬 المستشار الذكي</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("sources-section")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap active:scale-95 shrink-0 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>📚 المصادر (6)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ============================================================== */}
          {/* SIDEBAR: Blood Pressure Checker Tool & Quick Guidelines (4 cols) */}
          {/* ============================================================== */}
          <aside className="lg:col-span-4 space-y-4 order-1 lg:order-1 no-print w-full max-w-full" id="checker-section">
            
            {/* 1. Interactive Tool: Instant Blood Pressure Checker */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 sm:p-5 relative overflow-hidden w-full max-w-full">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      الفاحص الفوري لقراءة ضغط الدم
                    </h2>
                    <p className="text-xs text-slate-500">
                      تحليل سريري فوري وفق جدول AHA المعتمد
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                  مباشر
                </span>
              </div>

              {/* Quick Presets for Rapid Demonstration */}
              <div className="mt-3">
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                  نماذج سريعة للتجربة الفورية:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSystolic(p.sys);
                        setDiastolic(p.dia);
                        setHasAnalyzed(true);
                        setAnalyzedCategory(classifyBloodPressure(p.sys, p.dia));
                      }}
                      className={`text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer active:scale-95 touch-manipulation ${p.color}`}
                    >
                      {p.label} ({p.sys}/{p.dia})
                    </button>
                  ))}
                </div>
              </div>

              {/* Number Inputs */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    الانقباضي (SYS)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={60}
                      max={260}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={systolic}
                      onChange={(e) => {
                        setSystolic(e.target.value === "" ? "" : Number(e.target.value));
                        setHasAnalyzed(false);
                      }}
                      className="w-full text-center text-2xl font-black px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50/70"
                      placeholder="120"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none">
                      SYS
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block text-center font-medium">
                    ملم زئبق (الأعلى)
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    الانبساطي (DIA)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={40}
                      max={160}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={diastolic}
                      onChange={(e) => {
                        setDiastolic(e.target.value === "" ? "" : Number(e.target.value));
                        setHasAnalyzed(false);
                      }}
                      className="w-full text-center text-2xl font-black px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50/70"
                      placeholder="80"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none">
                      DIA
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block text-center font-medium">
                    ملم زئبق (الأدنى)
                  </span>
                </div>
              </div>

              {/* Explicit "تحليل القراءة" Button */}
              <button
                type="button"
                onClick={handleAnalyzeReading}
                className="mt-3.5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs active:scale-[0.99] transition-all cursor-pointer min-h-[44px]"
              >
                <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تحليل القراءة ({systolic || 0}/{diastolic || 0})</span>
              </button>

              {hasAnalyzed && (
                <div className="mt-2.5 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold animate-in fade-in duration-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>تم التحليل الإكلينيكي المعتمد وفق جدول AHA بنجاح</span>
                </div>
              )}

              {/* Visual Segmented Color Meter */}
              <div className="mt-3.5 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-5 text-center text-[9px] sm:text-[10px] text-slate-500 font-bold mb-1">
                  <span className={currentLiveCategory.urgencyLevel === 'normal' ? 'text-emerald-700 font-black' : ''}>طبيعي</span>
                  <span className={currentLiveCategory.urgencyLevel === 'elevated' ? 'text-amber-700 font-black' : ''}>مرتفع</span>
                  <span className={currentLiveCategory.urgencyLevel === 'stage1' ? 'text-orange-700 font-black' : ''}>مرحلة 1</span>
                  <span className={currentLiveCategory.urgencyLevel === 'stage2' ? 'text-red-700 font-black' : ''}>مرحلة 2</span>
                  <span className={currentLiveCategory.urgencyLevel === 'crisis' ? 'text-rose-700 font-black animate-pulse' : ''}>أزمة طارئة</span>
                </div>
                <div className="grid grid-cols-5 gap-1 h-2.5 rounded-full overflow-hidden bg-slate-100 p-0.5">
                  <div className={`h-full rounded-sm transition-all ${currentLiveCategory.urgencyLevel === 'normal' ? 'bg-emerald-500 ring-2 ring-emerald-300' : 'bg-emerald-200'}`} />
                  <div className={`h-full rounded-sm transition-all ${currentLiveCategory.urgencyLevel === 'elevated' ? 'bg-amber-500 ring-2 ring-amber-300' : 'bg-amber-200'}`} />
                  <div className={`h-full rounded-sm transition-all ${currentLiveCategory.urgencyLevel === 'stage1' ? 'bg-orange-500 ring-2 ring-orange-300' : 'bg-orange-200'}`} />
                  <div className={`h-full rounded-sm transition-all ${currentLiveCategory.urgencyLevel === 'stage2' ? 'bg-red-500 ring-2 ring-red-300' : 'bg-red-200'}`} />
                  <div className={`h-full rounded-sm transition-all ${currentLiveCategory.urgencyLevel === 'crisis' ? 'bg-rose-600 ring-2 ring-rose-400 animate-pulse' : 'bg-rose-200'}`} />
                </div>
              </div>

              {/* Classification Result Card */}
              <div
                className={`mt-4 p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                  currentLiveCategory.borderColor
                } ${currentLiveCategory.bgColor} ${
                  currentLiveCategory.urgencyLevel === "crisis"
                    ? "emergency-pulse-active"
                    : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                  <span
                    className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-bold ${currentLiveCategory.badgeColor}`}
                  >
                    {currentLiveCategory.nameArabic}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-500">
                    {currentLiveCategory.nameEnglish}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {currentLiveCategory.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs">
                  <strong className="text-slate-900 font-bold block mb-0.5">
                    التوجيه والإجراء الطبي:
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    {currentLiveCategory.clinicalAction}
                  </p>
                </div>

                <div className="mt-2 pt-1 text-[10px] text-slate-400 font-medium">
                  المرجع: {currentLiveCategory.source}
                </div>
              </div>

              {/* Action Button: Ask Assistant */}
              <button
                type="button"
                onClick={handleAskAboutReading}
                className="mt-3.5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 active:scale-[0.99] transition-all cursor-pointer min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>اطلب نصيحة مفصلة من البوت حول قراءتي ({systolic}/{diastolic})</span>
              </button>
            </div>

            {/* 2. Official Classification Guide (Mini Reference) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-xs">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>جدول تصنيف الضغط (AHA & WHO)</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">AHA 2026</span>
              </div>
              <div className="space-y-1.5">
                {BP_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-bold text-slate-800 text-[11px]">
                        {cat.nameArabic}
                      </span>
                    </div>
                    <span className="font-mono text-slate-500 font-semibold text-[11px] dir-ltr text-left">
                      {cat.systolicRange} / {cat.diastolicRange}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Emergency Warning Signs Card */}
            <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-4 text-xs text-rose-950 shadow-2xs">
              <div className="flex items-center gap-2 font-bold mb-1.5 text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
                <span>أعراض الخطر التي تستوجب الطوارئ فوراً</span>
              </div>
              <ul className="space-y-1 pr-4 list-disc text-rose-900/90 leading-relaxed font-medium">
                <li>قراءة انقباضي أعلى من 180 أو انبساطي أعلى من 120.</li>
                <li>ألم أو ثقل عاصر في منتصف الصدر ينتشر للكتف أو الفك.</li>
                <li>ضيق مفاجئ وحاد في التنفس.</li>
                <li>تنميل، خدر بالوجه أو صعوبة في نطق الكلمات.</li>
              </ul>
            </div>
          </aside>

          {/* ============================================================== */}
          {/* MAIN COLUMN: Quick Questions Tabs + Smart AI Chatbot (8 cols)  */}
          {/* ============================================================== */}
          <div className="lg:col-span-8 space-y-4 order-2 lg:order-2 w-full max-w-full" id="chat-section">
            
            {/* Quick Questions Component (15 categorized strategic questions) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 sm:p-4 quick-questions-panel w-full max-w-full overflow-hidden" id="questions-section">
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      لوحة الـ 15 سؤالاً الطبية الذكية
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      أسئلة استراتيجية بإجابات نموذجية موثقة — اضغط للإرسال الفوري
                    </p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-bold shrink-0">
                  15 سؤالاً معتمداً
                </span>
              </div>

              {/* 4 Categorized Tabs with smooth horizontal swipe */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 scrollbar-none w-full max-w-full">
                {QUESTION_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const count = QUESTIONS_BANK.filter(q => q.categoryId === tab.id).length;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tab.id === "basics" && <HelpCircle className="w-3.5 h-3.5" />}
                      {tab.id === "readings" && <Activity className="w-3.5 h-3.5" />}
                      {tab.id === "lifestyle" && <Salad className="w-3.5 h-3.5" />}
                      {tab.id === "meds_emergency" && <Pill className="w-3.5 h-3.5" />}
                      <span>{tab.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-700"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Questions Buttons */}
              <div className="mt-3 grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                {activeTabQuestions.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      handleSendMessage(q.question);
                      scrollToSection("chat-section");
                    }}
                    disabled={isLoading}
                    className="w-full sm:w-auto max-w-full text-right text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200/90 text-slate-700 px-3 py-2 rounded-xl transition-all flex items-center justify-between gap-2 group cursor-pointer active:scale-[0.98] disabled:opacity-50 min-h-[38px]"
                  >
                    <span className="truncate flex-1 font-medium min-w-0">{q.question}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-blue-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Medical Chatbot Box */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] sm:h-[600px] lg:h-[650px] overflow-hidden chat-container w-full max-w-full" id="chat-panel">
              
              {/* Chatbot Header */}
              <div className="px-3.5 sm:px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 sm:gap-2">
                      <span className="truncate">المستشار الطبي الافتراضي</span>
                      <span className="text-[9px] sm:text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        متصل وجاهز
                      </span>
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
                      إجابات إكلينيكية معتمدة وفق أدلة WHO & AHA & NIH & Mayo Clinic
                    </p>
                  </div>
                </div>

                {/* Chat Action Buttons (Export/Print + Clear Chat) */}
                <div className="flex items-center gap-1.5 no-print shrink-0">
                  {/* Export / Print Chat Button */}
                  <button
                    type="button"
                    onClick={handlePrintChat}
                    title="تصدير أو طباعة المحادثة الطبية"
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors cursor-pointer font-medium min-h-[36px]"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden sm:inline">طباعة / تصدير</span>
                  </button>

                  {/* Clear Chat Button */}
                  <button
                    type="button"
                    onClick={handleClearChat}
                    title="مسح المحادثة وبدء استشارة جديدة"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors cursor-pointer min-h-[36px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Container */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5 bg-slate-50/40 chat-messages w-full max-w-full">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 sm:gap-3 ${
                        isUser ? "flex-row-reverse" : "flex-row"
                      } items-start w-full max-w-full`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-xs ${
                          isUser
                            ? "bg-slate-700"
                            : "bg-gradient-to-tr from-blue-700 to-cyan-600"
                        }`}
                      >
                        {isUser ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[88%] sm:max-w-[80%] min-w-0 break-words [overflow-wrap:anywhere] rounded-2xl p-3 sm:p-4 shadow-2xs ${
                          isUser
                            ? "bg-blue-600 text-white rounded-tl-none font-medium"
                            : msg.isEmergency
                            ? "bg-rose-50 border-2 border-rose-400 text-slate-900 rounded-tr-none"
                            : "bg-white border border-slate-200 text-slate-900 rounded-tr-none"
                        }`}
                      >
                        {isUser ? (
                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        ) : (
                          <div className="prose-medical text-xs sm:text-sm">
                            <MarkdownRenderer content={msg.content} />

                            {/* Medical Credential Badge Under Every Answer */}
                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-500">
                              <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-blue-200 text-[10px] sm:text-[11px]">
                                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
                                <span>مُدعم بمصادر WHO & AHA المعتمدة</span>
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleCopy(msg.id, msg.content)}
                                  className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 hover:text-slate-700 px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="نسخ الإجابة"
                                >
                                  {copiedId === msg.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="text-emerald-600 font-bold">تم النسخ</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>نسخ</span>
                                    </>
                                  )}
                                </button>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {msg.timestamp}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 sm:gap-3 items-start">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-blue-700 to-cyan-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tr-none p-3.5 sm:p-4 shadow-2xs">
                      <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600 shrink-0" />
                        <span>جاري مراجعة البروتوكولات الإكلينيكية وصياغة التوجيه الطبي المعتمد...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-2.5 sm:p-4 bg-white border-t border-slate-200 no-print">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="اكتب سؤالك الطبي أو استفسارك هنا..."
                    disabled={isLoading}
                    className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50/70 disabled:opacity-60 placeholder:text-slate-400"
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95 min-h-[44px]"
                    aria-label="إرسال السؤال"
                  >
                    <span className="hidden xs:inline">إرسال</span>
                    <Send className="w-4 h-4 -scale-x-100" />
                  </button>
                </form>

                <p className="mt-1.5 text-center text-[10px] text-slate-400 leading-tight">
                  ⚠️ إخلاء مسؤولية طبية: منصة نبض الأمان تثقيفية قائمة على أدلة WHO و AHA و Mayo Clinic، ولا تغني عن استشارة الطبيب.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION: Verified Sources Section (Below grid for presentation)*/}
        {/* ============================================================== */}
        <section className="mt-8 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm no-print w-full max-w-full overflow-hidden" id="sources-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <h2 className="text-sm sm:text-lg font-bold text-slate-900">
                  المصادر الطبية المعتمدة للذكاء الاصطناعي (Verified Medical Sources)
                </h2>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                كافة المعارف الطبية مستخرجة وموثقة من المنظمات الصحية الدولية المعتمدة والبروتوكول الوطني العراقي (6 مصادر) ومحفوظة محلياً لضمان النزاهة العلمية
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSourcesModalOpen(true)}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors self-start sm:self-auto cursor-pointer min-h-[38px] shrink-0"
            >
              عرض التفاصيل الكاملة والملفات
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
            {VERIFIED_SOURCES.map((src) => (
              <div
                key={src.id}
                className="rounded-xl border border-slate-200 p-3.5 sm:p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${src.badgeColor}`}>
                      {src.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs mb-1">
                    {src.orgName}
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                    {src.summary}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5">
                  {src.localDocs.map((doc, dIdx) => (
                    <a
                      key={dIdx}
                      href={doc.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold flex items-center justify-between group gap-2"
                    >
                      <span className="truncate flex-1 min-w-0">📄 {doc.name}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </a>
                  ))}
                  <a
                    href={src.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1 pt-1"
                  >
                    <span>الموقع الرسمي للمنظمة</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ============================================================== */}
      {/* 5. VERIFIED SOURCES MODAL (Modal Dialog for Judges & Detailed Review) */}
      {/* ============================================================== */}
      {isSourcesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/60 backdrop-blur-xs no-print animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92dvh] sm:max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-blue-600 text-white shadow-xs shrink-0">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 truncate">
                    وثائق المراجع والمصادر الطبية الرسمية المعتمدة
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                    توثيق كامل للملفات المحفوظة محلياً والروابط الدولية المعتمدة في "نبض الأمان"
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSourcesModalOpen(false)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-3.5 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed bg-blue-50 border border-blue-200 p-2.5 sm:p-3 rounded-xl font-medium">
                🏛️ **ملاحظة للجنة التحكيم الموقرة:** تم حفظ المحتوى النصي الموثق لكل مرجع دولي داخل المجلد <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-blue-900 font-bold">public/sources</code> لضمان استقلالية النظام وموثوقيته العلمية (RAG / In-Memory Knowledge Base) حتى بدون اتصال خارجي بالإنترنت.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {VERIFIED_SOURCES.map((source) => (
                  <div
                    key={source.id}
                    className="border border-slate-200 rounded-2xl p-3.5 sm:p-4 bg-white hover:border-blue-300 transition-all shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold border ${source.badgeColor}`}>
                          {source.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-950 text-xs sm:text-sm mb-1">
                        {source.orgName}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-blue-900 font-semibold mb-1.5 sm:mb-2">
                        {source.title}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mb-3">
                        {source.summary}
                      </p>
                    </div>

                    <div className="pt-2.5 sm:pt-3 border-t border-slate-100 space-y-1.5 sm:space-y-2">
                      <div className="text-[10px] sm:text-[11px] font-bold text-slate-700">الملفات الموثقة المحفوظة محلياً:</div>
                      {source.localDocs.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between text-[11px] sm:text-xs px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-700 font-semibold border border-slate-200 transition-colors gap-2"
                        >
                          <span className="flex items-center gap-1.5 min-w-0">
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{doc.name}</span>
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      ))}

                      <a
                        href={source.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 hover:text-slate-800 font-medium pt-1"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span>زيارة الرابط في الموقع الرسمي</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row items-center sm:justify-between gap-2.5">
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium text-center sm:text-right">
                جميع الحقوق محفوظة للهيئات الطبية المصدرة • استخدام أكاديمي وتثقيفي
              </span>
              <button
                type="button"
                onClick={() => setIsSourcesModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer min-h-[40px]"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-200 bg-white py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
          <p className="font-bold text-slate-800 text-sm">
            مشروع "نبض الأمان" — المساعد الطبي الذكي لارتفاع ضغط الدم (Hypertension AI Assistant)
          </p>
          <p className="max-w-2xl mx-auto leading-relaxed">
            تم التطوير باستخدام Next.js (App Router) و TypeScript و Tailwind CSS و Lucide Icons لدعم مسابقات الابتكار والتحكيم الطبي والأكاديمي، مع الالتزام الصارم بإرشادات منظمة الصحة العالمية (WHO) وجمعية القلب الأمريكية (AHA) والجمعية الأوروبية لأمراض القلب (ESC) والمعهد الوطني للصحة (NIH) ومايو كلينك (Mayo Clinic) ووزارة الصحة العراقية.
          </p>
        </div>
      </footer>
    </div>
  );
}
