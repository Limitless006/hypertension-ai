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
  Info,
  CheckCircle2,
  Trash2,
  ArrowUpRight,
  User,
  Bot,
  Sliders,
  ChevronRight,
  Heart,
  FileText
} from "lucide-react";
import {
  BP_CATEGORIES,
  classifyBloodPressure,
  QUICK_QUESTIONS_TABS,
  BloodPressureCategory
} from "@/data/medical-knowledge";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isEmergency?: boolean;
}

export default function HomePage() {
  // Blood Pressure Checker state
  const [systolic, setSystolic] = useState<number | "">(120);
  const [diastolic, setDiastolic] = useState<number | "">(80);
  const [activeTab, setActiveTab] = useState<string>("basics");

  // Chatbot State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `مرحباً بك في **نبض الأمان** 🩺 — منصتك الطبية الذكية والمتخصصة في التوعية بارتفاع ضغط الدم وصحة القلب.

أنا مساعدك الطبي الذكي، مدرب وفق أحدث الإرشادات السريرية الصادرة عن:
- 🏛️ **منظمة الصحة العالمية (WHO)**
- ❤️ **جمعية القلب الأمريكية (AHA)**
- 🏥 **مايو كلينك (Mayo Clinic)**

يمكنك طرح أي استفسار حول:
* تفسير قراءات ضغط الدم وتشخيص الحالات.
* الشروط المعتمدة للقياس المنزلي الدقيق.
* نظام DASH الغذائي والتحكم بالصوديوم والملح.
* أدوية الضغط وآليات عملها، وحقيقة الأعشاب والطب البديل.
* فحص أرقام قراءتك فوراً عبر الأداة الجانبية!`,
      timestamp: "الآن",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Computed classification for interactive tool
  const currentCategory: BloodPressureCategory = classifyBloodPressure(
    Number(systolic) || 0,
    Number(diastolic) || 0
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
        content: `⚠️ نعتذر، واجهنا صعوبة مؤقتة في معالجة طلبك: ${
          err.message || "يرجى المحاولة مجدداً."
        }\n\n*تذكير*: إذا كنت تشعر بأعراض حرجة أو كان ضغطك أعلى من 180/120، يرجى التوجه فوراً لأقرب قسم طوارئ.`,
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
    const prompt = `قمت بقياس ضغط دمي وسجلت قراءة ${sys} انقباضي و ${dia} انبساطي (${sys}/${dia} ملم زئبق). كيف تصنف حالتي وفق المعايير الطبية المعتمدة، وما هي الخطوات والتوجيهات الموصى بها لي؟`;
    handleSendMessage(prompt);
  };

  // Clear Chat
  const handleClearChat = () => {
    if (confirm("هل ترغب في بدء محادثة استشارية جديدة ومسح السجل السابق؟")) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content:
            "تم بدء محادثة جديدة. يمكنك إدخال قراءاتك أو طرح أي سؤال حول صحة ضغط الدم.",
          timestamp: "الآن",
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-200/50 text-slate-900">
      {/* Top Professional Medical Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-100">
              <HeartPulse className="w-6 h-6 animate-pulse" />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>نبض الأمان</span>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-full">
                    Hypertension AI
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                المساعد الطبي الذكي لارتفاع ضغط الدم • مستند إلى أدلة WHO و Mayo Clinic و AHA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>معتمد علمياً لمسابقة الابتكار</span>
            </span>

            <a
              href="tel:997"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
              title="الاتصال بالإسعاف لحالات الطوارئ الحرجة"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>طوارئ (997)</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ============================================================== */}
          {/* SIDEBAR: Blood Pressure Checker Tool & Quick Guidelines (4 cols) */}
          {/* ============================================================== */}
          <aside className="lg:col-span-4 space-y-5 order-2 lg:order-1">
            {/* 1. Interactive Tool: Instant Blood Pressure Checker */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 overflow-hidden relative">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      فاحص قراءة الضغط الفوري
                    </h2>
                    <p className="text-xs text-slate-500">
                      تحليل سريري آني بالألوان المعتمدة
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                  AHA 2026
                </span>
              </div>

              {/* Number Inputs */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    الانقباضي (الأعلى)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={60}
                      max={260}
                      value={systolic}
                      onChange={(e) =>
                        setSystolic(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full text-center text-xl font-extrabold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50/50"
                      placeholder="120"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-semibold">
                      SYS
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block text-center">
                    ملم زئبق
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    الانبساطي (الأدنى)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={40}
                      max={160}
                      value={diastolic}
                      onChange={(e) =>
                        setDiastolic(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full text-center text-xl font-extrabold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50/50"
                      placeholder="80"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-semibold">
                      DIA
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block text-center">
                    ملم زئبق
                  </span>
                </div>
              </div>

              {/* Classification Result Card */}
              <div
                className={`mt-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                  currentCategory.borderColor
                } ${currentCategory.bgColor} ${
                  currentCategory.urgencyLevel === "crisis"
                    ? "emergency-alert-glow"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${currentCategory.badgeColor}`}
                  >
                    {currentCategory.nameArabic}
                  </span>
                  <span className="text-[11px] font-mono font-medium text-slate-500">
                    {currentCategory.nameEnglish}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {currentCategory.description}
                </p>

                <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 text-xs">
                  <strong className="text-slate-900 font-bold block mb-0.5">
                    التوجيه الطبي:
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    {currentCategory.clinicalAction}
                  </p>
                </div>
              </div>

              {/* Action Button: Ask Assistant */}
              <button
                type="button"
                onClick={handleAskAboutReading}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>اسأل المساعد الذكي عن قراءتي ({systolic}/{diastolic})</span>
              </button>
            </div>

            {/* 2. Official Classification Guide (Mini Table) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 text-xs">
              <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>دليل تصنيف الضغط (AHA & WHO)</span>
              </h3>
              <div className="space-y-2">
                {BP_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-bold text-slate-800">
                        {cat.nameArabic}
                      </span>
                    </div>
                    <span className="font-mono text-slate-500 font-medium text-[11px] dir-ltr text-left">
                      {cat.systolicRange} / {cat.diastolicRange}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Emergency Warning Signs Card */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900">
              <div className="flex items-center gap-2 font-bold mb-1.5 text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>أعراض الخطر التي تستوجب الطوارئ</span>
              </div>
              <ul className="space-y-1 pr-4 list-disc text-rose-800/90 leading-relaxed font-medium">
                <li>ضغط انقباضي أعلى من 180 أو انبساطي أعلى من 120.</li>
                <li>ألم أو ضغط حاد في الصدر ينتشر للكتف أو الفك.</li>
                <li>ضيق مفاجئ في التنفس أو صعوبة استنشاق الهواء.</li>
                <li>خدر، ضعف مفاجئ في أحد جانبي الجسم، أو تلعثم بالنطق.</li>
              </ul>
            </div>
          </aside>

          {/* ============================================================== */}
          {/* MAIN COLUMN: Quick Questions Tabs + Smart AI Chatbot (8 cols)  */}
          {/* ============================================================== */}
          <div className="lg:col-span-8 space-y-4 order-1 lg:order-2">
            {/* Quick Questions Component (15 categorized questions) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    الأسئلة الطبية السريعة (اختر موضوعاً للإرسال الفوري)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">
                  15 سؤالاً جاهزاً
                </span>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 scrollbar-none">
                {QUICK_QUESTIONS_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
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
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Questions Chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_QUESTIONS_TABS.find(
                  (t) => t.id === activeTab
                )?.questions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    disabled={isLoading}
                    className="text-right text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200/90 text-slate-700 px-3 py-2 rounded-xl transition-all flex items-center justify-between gap-2 group cursor-pointer active:scale-[0.98] disabled:opacity-50"
                  >
                    <span className="line-clamp-1">{q}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-blue-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Medical Chatbot Box */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md flex flex-col h-[650px] overflow-hidden">
              {/* Chatbot Header */}
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Stethoscope className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>المستشار الطبي الافتراضي</span>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        نشط الآن
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      إجابات معتمدة وفق البروتوكولات الإكلينيكية الرسمية
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearChat}
                    title="مسح المحادثة وبدء استشارة جديدة"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/40">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        isUser ? "flex-row-reverse" : "flex-row"
                      } items-start`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-xs ${
                          isUser
                            ? "bg-slate-700"
                            : "bg-gradient-to-tr from-blue-700 to-cyan-600"
                        }`}
                      >
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 shadow-2xs ${
                          isUser
                            ? "bg-blue-600 text-white rounded-tl-none"
                            : msg.isEmergency
                            ? "bg-rose-50 border-2 border-rose-400 text-slate-900 rounded-tr-none"
                            : "bg-white border border-slate-200/90 text-slate-900 rounded-tr-none"
                        }`}
                      >
                        {isUser ? (
                          <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        ) : (
                          <div className="prose-medical text-sm">
                            <MarkdownRenderer content={msg.content} />

                            {/* Medical Credential Badge Under Every Answer */}
                            <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                              <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50/90 px-2.5 py-1 rounded-full border border-blue-200/60">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                <span>مُدعم بمصادر WHO & Mayo Clinic</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {msg.timestamp}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-cyan-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tr-none p-4 shadow-2xs">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        <span>جاري مراجعة البروتوكولات الطبية وتحليل الإجابة...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80">
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
                    placeholder="اكتب سؤالك الطبي هنا (مثال: ما تأثير القهوة على الضغط؟ أو قراءتي 135/85)..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50/50 disabled:opacity-60 placeholder:text-slate-400"
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="px-4 sm:px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
                  >
                    <span>إرسال</span>
                    <Send className="w-4 h-4 rotate-180" />
                  </button>
                </form>

                <p className="mt-2 text-center text-[10px] text-slate-400">
                  تنبيه طبي: نبض الأمان هو أداة ذكاء اصطناعي تثقيفية موثوقة لمساعدة المرضى، ولا تُعد بديلاً عن الفحص السريري أو استشارة الطبيب المعالج.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700">
            مشروع "نبض الأمان" — المساعد الطبي الذكي لارتفاع ضغط الدم (Hypertension AI Assistant)
          </p>
          <p>
            مطور باللغة العربية لدعم مرضى الضغط ورفع الوعي الصحي المجتمعي وفق أحدث إرشادات منظمة الصحة العالمية (WHO) وجمعية القلب الأمريكية (AHA) ومايو كلينك.
          </p>
        </div>
      </footer>
    </div>
  );
}
