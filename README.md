# نبض الأمان (Hypertension AI Assistant) 🩺🫀

> **المساعد الطبي الذكي المتخصص في ارتفاع ضغط الدم وصحة القلب**  
> مشروع ويب طبي متكامل وعالي الاحترافية مقدم لمسابقة الابتكار الجامعية.  
> مبني بأحدث تقنيات الويب: **Next.js (App Router) + TypeScript + Tailwind CSS v4 + Lucide Icons + Google Gemini AI**.

---

## 🌟 مميزات النظام (Key Features)

1. **الذكاء الاصطناعي الطبي الموثق (Clinical AI & RAG Engine):**
   - مدعوم بنموذج Google Gemini مع توجيه فائق الدقة (System Instructions) وقاعدة معرفية مدمجة (In-Memory Clinical Knowledge Base).
   - إجبار المساعد على ذكر المصدر المعتمد في نهاية كل إجابة:  
     `📚 المصدر المعتمد لهذه المعلومة: [WHO / AHA / ESC / NIH / Mayo Clinic / وزارة الصحة العراقية]`.

2. **حواجز الأمان الإكلينيكية الحتمية (Deterministic Clinical Guardrails):**
   - **فخ الوصفات الطبية:** رفض قاطع لكتابة جرعات أو تغيير أدوية وإحالة المريض لطبيبه المعالج فوراً.
   - **أزمة الطوارئ (>180/120):** اكتشاف فوري للحالات الحرجة والأعراض التحذيرية (Red Flags) مع إطلاق تنبيه أحمر عاجل للتوجه لأقرب مستشفى أو الاتصال بالطوارئ (122 / 911).
   - **فهم اللهجات:** معالجة دقيقة للأرقام العربية المشرقية (١٢٠/٨٠) والكلمات العامية (مثل: "راسي ديوجعني حيل"، "شنو أخذ"، "عطني دوه").

3. **حاسبة ومؤشر قياس الضغط الفوري (Instant BP Analyzer & Gauge):**
   - تحليل فوري وتصنيف خماسي ملون معتمد من AHA و ESC:
     - 🟢 طبيعي (< 120/80)
     - 🟡 مرتفع (120-129 / < 80)
     - 🟠 المرحلة الأولى (130-139 / 80-89)
     - 🔴 المرحلة الثانية (≥ 140 / ≥ 90)
     - 🚨 أزمة طارئة (> 180 / 120)
   - مقارنة تشخيصية فورية دقيقة بين معايير AHA الأمريكية (المرحلة 1 تبدأ من 130/80) ومعايير ESC الأوروبية (تعتبرها High-Normal وتبدأ المرحلة 1 من 140/90).

4. **بنك الأسئلة السريعة (15 سؤالاً استراتيجياً في 4 محاور):**
   - أساسيات ضغط الدم والقاتل الصامت.
   - قراءات الضغط والمقارنات الدولية وفخ التدريسي.
   - نمط الحياة وحمية DASH وحدود الصوديوم والكركديه والقهوة.
   - الأدوية والتحذير من الإيقاف المفاجئ وقائمة الأدوية الأساسية العراقية.

5. **المكتبة والمصادر الطبية الرسمية (6 مصادر عالمية ومحلية):**
   - متوفرة بصيغتي **Markdown** و **PDF متعدد الصفحات** داخل مجلد `public/sources`:
     1. منظمة الصحة العالمية (WHO)
     2. جمعية القلب الأمريكية (AHA)
     3. الجمعية الأوروبية لأمراض القلب (ESC)
     4. المعهد الوطني للصحة الأمريكي (NIH - DASH Diet)
     5. مايو كلينك للتعليم والبحوث الطبية (Mayo Clinic)
     6. دليل وزارة الصحة العراقية لبروتوكول الرعاية الأولية

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Webpack Builder)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Integration:** Google Gemini API (`@google/generative-ai` & Native Fallback)
- **Direction:** RTL بالكامل مع خط Cairo العربي
- **Architecture:** Zero-DB, Serverless Ready, Self-Contained Knowledge Engine

---

## 🚀 التشغيل المحلي (Local Development)

```bash
# تثبيت التبعيات
npm install

# تشغيل خادم التطوير
npm run dev
```

افتح المتصفح على: `http://localhost:3000`

---

## ☁️ النشر على Vercel (Deployment)

### الطريقة الأولى: عبر GitHub (الموصى بها)
1. ارفع المشروع إلى مستودع GitHub الخاص بك:
   ```bash
   git add .
   git commit -m "feat: complete Hypertension AI Assistant ready for Vercel"
   git branch -M main
   git remote add origin https://github.com/USERNAME/hypertension-ai.git
   git push -u origin main
   ```
2. توجه إلى [Vercel](https://vercel.com) واضغط **Add New...** -> **Project**.
3. اختر المستودع `hypertension-ai` واضغط **Import**.
4. في خانة **Environment Variables**، أضف:
   - `GEMINI_API_KEY`: مفتاحك الخاص بـ Google Gemini.
5. اضغط **Deploy**! ستحصل على رابط حي ومجاني (`https://your-project.vercel.app`).

### الطريقة الثانية: النشر المباشر عبر Vercel CLI
```bash
npx vercel
# اتبع التعليمات في الشاشة ثم:
npx vercel env add GEMINI_API_KEY
npx vercel --prod
```

---

## ⚖️ إخلاء المسؤولية الطبية (Medical Disclaimer)

هذا التطبيق هو مساعد تثقيفي واستشاري ذكي مبني على أدلة وبحوث طبية معتمدة من كبرى المنظمات الصحية العالمية، ولا يعد بديلاً عن الفحص الطبي السريري أو استشارة الطبيب المختص أو الاتصال بالطوارئ في الحالات الحرجة.
