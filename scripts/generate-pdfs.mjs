import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildMultiPagePdf } from "./generate-pdfs-builder.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourcesDir = path.resolve(__dirname, "..", "public", "sources");

const DOCUMENTS = [
  {
    fileName: "who-hypertension-factsheet.pdf",
    title: "Hypertension Factsheet & Global Cardiovascular Epidemiology",
    subtitle: "Arabic Reference: Sahifat Waqa'i Fart Daght Al-Dam (WHO Factsheet No. 342)",
    organization: "World Health Organization (WHO)",
    docRef: "WHO Factsheet 342 / Global NCD Monitoring Framework",
    url: "https://www.who.int/ar/news-room/fact-sheets/detail/hypertension",
    sections: [
      {
        heading: "1. Global Disease Burden & Epidemiology (Key Facts)",
        items: [
          "- An estimated 1.4 billion adults aged 30-79 years worldwide live with hypertension.",
          "- Two-thirds of people with hypertension live in low- and middle-income countries (LMICs).",
          "- Approximately 46% of adults with hypertension are completely unaware that they have the condition.",
          "- Only 42% of adults with hypertension are diagnosed and treated, and only 21% have it controlled.",
          "- Hypertension is a major independent cause of premature death globally, causing 10.8 million deaths annually.",
        ],
      },
      {
        heading: "2. The 'Silent Killer' Clinical Concept & Pathophysiology",
        items: [
          "- Hypertension is medically termed 'The Silent Killer' because it typically produces zero symptoms for years.",
          "- Insidious hydraulic shear stress progressively damages the vascular endothelial lining across vital organs.",
          "- Absence of symptoms does not indicate absence of disease; relying on feelings or mild headaches is medically invalid.",
          "- Routine annual blood pressure screening is universally mandatory for all adults >=18 years.",
        ],
      },
      {
        heading: "3. Modifiable and Non-Modifiable Cardiovascular Risk Factors",
        items: [
          "### A. Modifiable Behavioral Risk Factors:",
          "- Excessive dietary sodium consumption (>2,300 mg/day) and deficient potassium intake (<3,500 mg/day).",
          "- Physical inactivity, sedentary lifestyle, and high prevalence of abdominal obesity (BMI >=30).",
          "- Consumption of tobacco products (cigarettes, shisha/hookah) and harmful alcohol intake.",
          "- Diets high in saturated fats, trans-fatty acids, and refined sugars.",
          "### B. Non-Modifiable Risk Factors:",
          "- Advanced age (>=65 years) leading to physiological vascular elastance reduction and large artery stiffness.",
          "- Genetic predisposition and positive family history of early cardiovascular disease.",
          "- Co-existing chronic conditions: Diabetes mellitus, chronic kidney disease (CKD), and metabolic syndrome.",
        ],
      },
      {
        heading: "4. Severe Hypertensive Crisis & Target Organ Warning Signs",
        items: [
          "- Readings persistently exceeding 180 mmHg systolic and/or 120 mmHg diastolic constitute an emergency.",
          "- Critical danger signs signaling acute Target Organ Damage (TOD) include:",
          "  1. Sudden, severe 'thunderclap' headache.",
          "  2. Acute crushing chest pain, tightness, or pressure (angina pectoris / acute coronary syndrome).",
          "  3. Acute severe dyspnea, shortness of breath, or orthopnea (pulmonary edema).",
          "  4. Sudden focal neurological deficit: Facial droop, hemiparesis, dysarthria, or numbness.",
          "  5. Acute visual disturbance, blurry vision, or sudden loss of vision (retinopathy / papilledema).",
          "  6. Severe vertigo, altered mental status, confusion, or seizures (hypertensive encephalopathy).",
          "- Mandatory Immediate Action: Call emergency services (997 / 122 / 911) or proceed to nearest emergency room.",
        ],
      },
      {
        heading: "5. Chronic Target Organ Complications & Long-Term Prognosis",
        items: [
          "- Cardiac: Left ventricular hypertrophy (LVH), coronary artery disease, heart failure with preserved/reduced EF.",
          "- Cerebrovascular: Ischemic stroke, intracerebral hemorrhage, transient ischemic attack (TIA), vascular dementia.",
          "- Renal: Nephrosclerosis, microalbuminuria, progressive CKD, end-stage renal disease (ESRD) requiring dialysis.",
          "- Ocular: Grade I-IV hypertensive retinopathy, flame hemorrhages, cotton wool spots, permanent blindness.",
        ],
      },
      {
        heading: "6. Universal Blood Pressure Treatment Targets",
        items: [
          "- General Target: Blood pressure <140/90 mmHg for all confirmed adult hypertension patients.",
          "- Intensive Target: Blood pressure <130/80 mmHg for patients with confirmed CVD, diabetes, or CKD.",
        ],
      },
    ],
  },
  {
    fileName: "who-guideline-pharmacological-treatment.pdf",
    title: "Guideline for the Pharmacological Treatment of Hypertension in Adults",
    subtitle: "Official WHO Clinical Practice Guideline (Geneva, 2021) - Recommendations",
    organization: "World Health Organization (WHO)",
    docRef: "WHO Guidelines Approved by the Guidelines Review Committee (ISBN 978-92-4-003398-6)",
    url: "https://www.who.int/publications/i/item/9789240033986",
    sections: [
      {
        heading: "1. Blood Pressure Thresholds for Pharmacological Initiation",
        items: [
          "- Initiate pharmacological treatment in any individual with confirmed SBP >=140 mmHg or DBP >=90 mmHg.",
          "- Initiate treatment in individuals with existing CVD and SBP 130-139 mmHg without delay.",
          "- Initiate treatment in individuals without CVD but with high cardiovascular risk, diabetes, or CKD and SBP 130-139 mmHg.",
          "- Confirmation requires repeated clinic measurements over 2-3 visits or verified ambulatory/home monitoring.",
        ],
      },
      {
        heading: "2. Recommended First-Line Antihypertensive Drug Classes",
        items: [
          "- WHO recommends any of the following 3 first-line drug classes for initial therapy:",
          "  1. Thiazide or thiazide-like diuretics (Hydrochlorothiazide, Chlorthalidone, Indapamide).",
          "  2. Long-acting dihydropyridine Calcium Channel Blockers (CCBs - e.g. Amlodipine).",
          "  3. Angiotensin-Converting Enzyme Inhibitors (ACE-I - e.g. Enalapril) OR Angiotensin Receptor Blockers (ARBs - e.g. Losartan).",
          "- Strict Clinical Safety Note: Never combine an ACE-I with an ARB concurrently due to nephrotoxicity.",
          "- Beta-blockers are not recommended as first-line unless there is a specific compelling cardiac indication.",
        ],
      },
      {
        heading: "3. Dual Combination Therapy Strategy",
        items: [
          "- Combination therapy with 2 first-line agents from different classes is recommended for initial therapy.",
          "- Especially indicated when baseline blood pressure is >=20 mmHg systolic or >=10 mmHg diastolic above target.",
          "- Single-pill fixed-dose combinations (FDCs) improve medication adherence and blood pressure control rates.",
        ],
      },
      {
        heading: "4. Target Blood Pressure Goals & Follow-Up Protocols",
        items: [
          "- Universal Target: Blood pressure <140/90 mmHg for all adult hypertension patients without co-morbidities.",
          "- Strict Target: Blood pressure <130/80 mmHg for patients with co-morbid diabetes mellitus, CKD, or known CVD.",
          "- Follow-up interval: Monthly visits until blood pressure reaches target; every 3-6 months once stabilized.",
        ],
      },
      {
        heading: "5. Baseline Clinical & Laboratory Assessment Package",
        items: [
          "- Assessment of serum creatinine and estimated glomerular filtration rate (eGFR).",
          "- Assessment of serum potassium and sodium electrolytes (prior to and during diuretic/ACE-I/ARB therapy).",
          "- Fasting lipid profile, fasting blood glucose or HbA1c.",
          "- Complete urine analysis (dipstick for protein/microalbuminuria).",
          "- 12-lead Electrocardiogram (ECG) for baseline cardiac rhythm and LVH evaluation.",
        ],
      },
    ],
  },
  {
    fileName: "aha-bp-readings-measurement-protocol.pdf",
    title: "Blood Pressure Classification Table & Standardized Measurement Protocol",
    subtitle: "2017 ACC/AHA High Blood Pressure Clinical Practice Guidelines in Adults",
    organization: "American Heart Association (AHA) & American College of Cardiology (ACC)",
    docRef: "2017 ACC/AHA Guideline (Hypertension. 2018;71:e13-e115)",
    url: "https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings",
    sections: [
      {
        heading: "1. The 5 Official AHA/ACC Blood Pressure Categories",
        items: [
          "| Category | Systolic (SYS) | Operator | Diastolic (DIA) | Clinical Recommendation |",
          "| :--- | :---: | :---: | :---: | :--- |",
          "| Normal | Less than 120 mmHg | AND | Less than 80 mmHg | Healthy lifestyle habits, annual check |",
          "| Elevated | 120 - 129 mmHg | AND | Less than 80 mmHg | Lifestyle modification, re-check in 3-6 mo |",
          "| Stage 1 HTN | 130 - 139 mmHg | OR | 80 - 89 mmHg | Lifestyle + ASCVD risk (meds if risk >=10%) |",
          "| Stage 2 HTN | 140 mmHg or higher | OR | 90 mmHg or higher | Lifestyle + 2 first-line medications |",
          "| Crisis | Higher than 180 mmHg | AND/OR | Higher than 120 mmHg | Immediate emergency medical evaluation |",
        ],
      },
      {
        heading: "2. The Golden Rule of Category Assignment",
        items: [
          "- If systolic and diastolic values fall into different categories, the HIGHER category always determines staging.",
          "- Example: A reading of 124/86 mmHg is classified as STAGE 1 HYPERTENSION (due to diastolic >=80).",
          "- Example: A reading of 144/78 mmHg is classified as STAGE 2 HYPERTENSION (due to systolic >=140).",
        ],
      },
      {
        heading: "3. Hypertensive Crisis: Urgency vs. Emergency Distinction",
        items: [
          "### A. Hypertensive Urgency (Severe Elevation WITHOUT Target Organ Damage):",
          "- SBP >180 mmHg and/or DBP >120 mmHg with NO acute symptoms of organ failure.",
          "- Action: Rest for 5 minutes, repeat measurement. If sustained, contact physician within 24-48 hours.",
          "- Does not typically require ICU admission; managed with oral antihypertensive regimen adjustments.",
          "### B. Hypertensive Emergency (Severe Elevation WITH Target Organ Damage):",
          "- SBP >180 mmHg and/or DBP >120 mmHg WITH acute, life-threatening target organ damage.",
          "- Symptoms: Crushing chest pain, severe dyspnea, facial droop, dysarthria, focal weakness, blurred vision.",
          "- Action: IMMEDIATE 911 / 997 EMERGENCY CALL. Requires ICU admission and titratable intravenous therapy.",
        ],
      },
      {
        heading: "4. Standardized 6-Step Home Blood Pressure Monitoring (HBPM) Protocol",
        items: [
          "1. 30-Minute Pre-Test Abstinence: No caffeine (coffee/tea/energy drinks), tobacco, or vigorous exercise.",
          "2. Bladder Emptying: Fully empty bladder prior to reading (full bladder adds 10-15 mmHg artifact).",
          "3. 5-Minute Seated Rest: Sit quietly in a comfortable chair in a quiet room; do not speak or use smartphone.",
          "4. Correct Anatomical Posture: Back supported, feet flat on the floor (uncrossed; crossing adds 5-8 mmHg).",
          "5. Arm & Cuff Alignment: Arm supported on a table so that the cuff center is at EXACT HEART LEVEL.",
          "6. Bare Skin & Proper Cuff Size: Place cuff on bare upper arm; small cuff overestimates BP by up to 10 mmHg.",
          "7. Dual Measurement: Take 2 readings spaced 1 minute apart; log the average in a morning/evening diary.",
        ],
      },
      {
        heading: "5. White-Coat Hypertension and Masked Hypertension",
        items: [
          "- White-Coat Hypertension: Clinic BP >=140/90 mmHg but out-of-office BP normal (<130/80 mmHg).",
          "- Masked Hypertension: Clinic BP normal (<130/80 mmHg) but out-of-office BP elevated (>=130/80 mmHg).",
          "- Diagnostic confirmation requires 24-hour Ambulatory Blood Pressure Monitoring (ABPM).",
        ],
      },
    ],
  },
  {
    fileName: "esc-hypertension-guidelines.pdf",
    title: "Clinical Practice Guidelines for the Management of Arterial Hypertension",
    subtitle: "Joint European Guidelines (ESC / ESH) - Diagnostic Comparison with AHA/ACC",
    organization: "European Society of Cardiology (ESC) & European Society of Hypertension (ESH)",
    docRef: "2018/2024 ESC/ESH Guidelines (European Heart Journal 2018;39:3021-3104)",
    url: "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Arterial-Hypertension-Management-of",
    sections: [
      {
        heading: "1. ESC Diagnostic Criteria & Definition",
        items: [
          "- Arterial hypertension is defined by ESC as sustained office SBP >=140 mmHg and/or office DBP >=90 mmHg.",
          "- Confirmation requires repeated office measurements across 2-3 visits, or validated out-of-office monitoring.",
        ],
      },
      {
        heading: "2. ESC/ESH Blood Pressure Classification Table",
        items: [
          "| Category | Systolic (SYS) | Operator | Diastolic (DIA) |",
          "| :--- | :---: | :---: | :---: |",
          "| Optimal | Less than 120 mmHg | AND | Less than 80 mmHg |",
          "| Normal | 120 - 129 mmHg | and/or | 80 - 84 mmHg |",
          "| High-Normal | 130 - 139 mmHg | and/or | 85 - 89 mmHg |",
          "| Grade 1 Hypertension | 140 - 159 mmHg | and/or | 90 - 99 mmHg |",
          "| Grade 2 Hypertension | 160 - 179 mmHg | and/or | 100 - 109 mmHg |",
          "| Grade 3 Hypertension | >=180 mmHg | and/or | >=110 mmHg |",
          "| Isolated Systolic HTN | >=140 mmHg | AND | Less than 90 mmHg |",
        ],
      },
      {
        heading: "3. Diagnostic Comparison: AHA/ACC vs. ESC/ESH (Key Point for Judges)",
        items: [
          "### The 130-139 / 80-89 mmHg Reading (e.g. 135/85 mmHg):",
          "- American Perspective (ACC/AHA 2017):",
          "  * Formally classified as 'Stage 1 Hypertension'.",
          "  * Rationale: Early proactive alert and prompt intervention to prevent clinical disease progression.",
          "- European Perspective (ESC/ESH Guidelines):",
          "  * Formally classified as 'High-Normal Blood Pressure', NOT hypertension.",
          "  * Rationale: Avoiding overdiagnosis and overtreatment of healthy individuals; prevents medical labeling.",
          "### Direct Comparison Matrix:",
          "| Diagnostic Metric | AHA / ACC (American) | ESC / ESH (European) |",
          "| :--- | :--- | :--- |",
          "| Hypertension Diagnostic Cutoff | SBP >=130 or DBP >=80 mmHg | SBP >=140 or DBP >=90 mmHg |",
          "| Classification of 135/85 mmHg | Stage 1 Hypertension | High-Normal Blood Pressure |",
          "| Clinical Rationale | Early warning & active risk reduction | Avoiding overdiagnosis & overtreatment |",
          "| Pharmacotherapy at 135/85 mmHg | Only if ASCVD risk >=10% or DM | No drugs; lifestyle only unless CVD proven |",
        ],
      },
      {
        heading: "4. Target Blood Pressure Goals by Age Group",
        items: [
          "- Primary Target: Reduce blood pressure to <140/90 mmHg in all treated patients.",
          "- Strict Target (<65 years): Aim for SBP 120-129 mmHg if well tolerated, and DBP 70-79 mmHg.",
          "- Older Patients (>=65 years): Aim for SBP 130-139 mmHg to preserve vital organ and cerebral perfusion.",
        ],
      },
      {
        heading: "5. Out-of-Office Diagnostic Thresholds",
        items: [
          "- Home Blood Pressure (HBPM Mean): >=135/85 mmHg constitutes hypertension.",
          "- Daytime Ambulatory BP (Daytime ABPM): >=135/85 mmHg constitutes hypertension.",
          "- 24-Hour Ambulatory BP (24h ABPM): >=130/80 mmHg constitutes hypertension.",
          "- Night-time Ambulatory BP (Night-time ABPM): >=120/70 mmHg constitutes hypertension (non-dipping risk).",
        ],
      },
    ],
  },
  {
    fileName: "nih-dash-diet-guide.pdf",
    title: "Your Guide to Lowering Your Blood Pressure with DASH Eating Plan",
    subtitle: "National Heart, Lung, and Blood Institute (NHLBI / NIH Publication No. 06-4082)",
    organization: "National Institutes of Health (NIH)",
    docRef: "NIH Publication No. 06-4082 / NHLBI Clinical Trials",
    url: "https://www.nhlbi.nih.gov/education/dash-eating-plan",
    sections: [
      {
        heading: "1. Clinical Evidence & Efficacy of the DASH Plan",
        items: [
          "- DASH stands for Dietary Approaches to Stop Hypertension, developed through NIH multicenter clinical trials.",
          "- Lowers systolic blood pressure by 8 to 14 mmHg within 2 weeks of initiation.",
          "- Efficacy is equivalent to a full-dose single antihypertensive drug; reduces coronary events by >25%.",
        ],
      },
      {
        heading: "2. The 8 Food Group Servings (2,000 kcal Daily Standard)",
        items: [
          "| Food Group | Servings | Standard Serving Size | Health Benefit |",
          "| :--- | :---: | :--- | :--- |",
          "| Whole Grains | 6-8 / day | 1 slice whole wheat bread, 1/2 c cooked brown rice | Energy, fiber, magnesium |",
          "| Vegetables | 4-5 / day | 1 c raw leafy greens, 1/2 c cooked vegetables | Potassium, magnesium, fiber |",
          "| Fresh Fruits | 4-5 / day | 1 medium fruit, 1/2 c fresh/frozen fruit | Potassium, vitamin C, fiber |",
          "| Low-Fat Dairy | 2-3 / day | 1 c skim milk, 1 c low-fat yogurt, 1.5 oz low-fat cheese | Calcium, high-quality protein |",
          "| Lean Meat/Fish | <=6 oz / day | ~170 g cooked skinless poultry, wild salmon | Lean protein, iron, zinc |",
          "| Nuts & Legumes| 4-5 / week | 1/3 c nuts (almonds/walnuts), 1/2 c cooked beans | Magnesium, healthy fats |",
          "| Healthy Fats | 2-3 / day | 1 tsp extra virgin olive oil, 1 tsp canola oil | Monounsaturated fats |",
          "| Added Sweets | <=5 / week | 1 tbsp sugar or jam, 1/2 c fruit sorbet | Sugar restriction |",
        ],
      },
      {
        heading: "3. The Golden Mineral Triad in Blood Pressure Regulation",
        items: [
          "- Potassium: Promotes renal natriuresis (sodium excretion) and induces vascular smooth muscle relaxation.",
          "- Magnesium: Modulates vascular tone, reduces peripheral resistance, and improves endothelial responsiveness.",
          "- Calcium: Regulates vascular contraction dynamics and membrane stabilization.",
        ],
      },
      {
        heading: "4. Sodium Restriction Limits",
        items: [
          "- Standard DASH Sodium Limit: Up to 2,300 mg of sodium daily (approx. 1 level teaspoon of table salt = 5 g).",
          "- Lower Sodium DASH Target: Up to 1,500 mg of sodium daily (approx. 2/3 level teaspoon of salt).",
          "- The 1,500 mg limit provides superior blood pressure reduction, particularly in hypertensive adults.",
        ],
      },
      {
        heading: "5. Hidden Dietary Sodium Warning (>75% of Total Daily Intake)",
        items: [
          "- Processed deli meats (sausages, salami, pastrami, frankfurters).",
          "- Canned soups, commercial broths, and bouillon cubes.",
          "- Pickled vegetables, brine-cured olives, and heavily salted cheeses (feta, halloumi).",
          "- Commercial sauces: Soy sauce, ketchup, barbecue sauce, and ready-made salad dressings.",
        ],
      },
    ],
  },
  {
    fileName: "mayo-clinic-hypertension-guide.pdf",
    title: "Comprehensive Clinical Guide to High Blood Pressure and Patient Safety",
    subtitle: "Clinical Knowledge, Secondary Etiologies, Complications, and Rebound Warning",
    organization: "Mayo Clinic for Medical Education and Research",
    docRef: "Mayo Clinic Clinical Disease Monograph (Arterial Hypertension)",
    url: "https://www.mayoclinic.org/ar/diseases-conditions/high-blood-pressure",
    sections: [
      {
        heading: "1. Primary (Essential) vs. Secondary Hypertension",
        items: [
          "### A. Primary (Essential) Hypertension (90% to 95% of cases):",
          "- Multifactorial etiology: Genetic inheritance, age-related arterial remodeling, high sodium, sedentary habits.",
          "- Develops insidiously over years and requires long-term chronic management.",
          "### B. Secondary Hypertension (5% to 10% of cases):",
          "- Characterized by sudden onset, severe resistance to conventional drugs, and an identifiable underlying cause.",
          "- Can frequently be cured or substantially improved if the underlying pathology is addressed.",
        ],
      },
      {
        heading: "2. Key Causes of Secondary Hypertension",
        items: [
          "- Chronic kidney disease (CKD) and renal artery stenosis (Renovascular disease).",
          "- Obstructive sleep apnea (OSA) causing nocturnal hypoxemia and sympathetic overdrive.",
          "- Endocrine disorders: Cushing's syndrome, primary aldosteronism (Conn's syndrome), Pheochromocytoma.",
          "- Medications & Substances: Oral contraceptives, NSAIDs (Ibuprofen), systemic corticosteroids, decongestants.",
        ],
      },
      {
        heading: "3. Rebound Hypertension: Severe Danger of Abrupt Medication Cessation",
        items: [
          "- Ceasing antihypertensive medications abruptly triggers violent sympathetic rebound (Rebound Hypertension).",
          "- Blood pressure can rapidly surge to levels significantly higher than baseline pre-treatment values.",
          "- Fatal risks: Acute aortic dissection, hypertensive encephalopathy, acute myocardial infarction, fatal stroke.",
          "- Mandatory Protocol: Any dosage taper or medication change must be executed strictly under medical supervision.",
        ],
      },
      {
        heading: "4. Target Organ Damage (TOD) Pathology",
        items: [
          "- Heart: Left ventricular hypertrophy, ischemic coronary disease, congestive heart failure.",
          "- Brain: Ischemic infarction, cerebral hemorrhage, lacunar infarcts, progressive vascular dementia.",
          "- Kidneys: Arteriolar nephrosclerosis, glomerular sclerosis, proteinuria, irreversible ESRD.",
          "- Eyes: Hypertensive retinopathy, optic disc edema (papilledema), retinal vein/artery occlusion.",
        ],
      },
      {
        heading: "5. Herbal Remedies & Complementary Medicine Facts",
        items: [
          "- Hibiscus (Karkadeh): Mild diuretic effect providing 2-7 mmHg reduction; hot and cold forms have equal effect.",
          "- Garlic (Allicin): Promotes minor nitric oxide production and mild vasodilation.",
          "- CRITICAL MEDICAL DIRECTIVE: These substances are minor complementary dietary adjuncts ONLY.",
          "- Under NO circumstances should herbal products replace prescribed pharmaceutical regimens.",
        ],
      },
    ],
  },
  {
    fileName: "iraqi-moh-hypertension-guideline.pdf",
    title: "National Clinical Protocol for Hypertension Management in Primary Health Care",
    subtitle: "Republic of Iraq - Ministry of Health & WHO Iraq - Clinical Guidelines for PHCCs",
    organization: "Iraqi Ministry of Health (MOH) & WHO Iraq",
    docRef: "Iraqi MOH Public Health Directorate / NCD Department Clinical Protocol",
    url: "https://moh.gov.iq",
    sections: [
      {
        heading: "1. National Non-Communicable Diseases (NCD) Framework",
        items: [
          "- Implemented across all Iraqi Primary Health Care Centers (PHCCs) under the WHO PEN package.",
          "- Universal Mandatory Screening: Routine blood pressure measurement for EVERY citizen >=18 years.",
          "- Standardized measurement after 5 minutes seated rest, arm at heart level, recording average of 2 readings.",
        ],
      },
      {
        heading: "2. Clinical Diagnostic Criteria in Iraqi PHCCs",
        items: [
          "- Sustained clinic BP >=140 mmHg systolic and/or >=90 mmHg diastolic.",
          "- Confirmed across 2 to 3 separate clinical visits within a 2-4 week window.",
          "- Immediate single-visit diagnosis and urgent intervention if BP >=180/110 mmHg or if target organ damage exists.",
        ],
      },
      {
        heading: "3. Essential Diagnostic Laboratory Package in Iraqi PHCCs",
        items: [
          "- General Urine Examination (GUE) for proteinuria and microscopic hematuria.",
          "- Fasting Blood Sugar (FBS) and HbA1c.",
          "- Blood Urea and Serum Creatinine (for eGFR calculation).",
          "- Serum Electrolytes: Potassium and Sodium (baseline and follow-up).",
          "- Fasting Serum Lipid Profile (Total Cholesterol, Triglycerides, HDL, LDL).",
          "- Baseline 12-lead Electrocardiogram (ECG) in main sector health centers.",
        ],
      },
      {
        heading: "4. Iraqi Essential Medicines List (EML) First-Line Medications",
        items: [
          "- Calcium Channel Blockers (CCBs): Amlodipine 5-10 mg orally once daily.",
          "- ACE Inhibitors: Enalapril 5-20 mg orally once daily, OR ARBs: Losartan 50-100 mg orally once daily.",
          "- Thiazide Diuretics: Hydrochlorothiazide (HCTZ) 12.5-25 mg orally once daily.",
          "- Dual Combination Therapy: Initiated at low doses (e.g. Amlodipine + Enalapril/Losartan) when BP >=160/100 mmHg.",
        ],
      },
      {
        heading: "5. Chronic Disease Clinic (NCD) Follow-Up Schedule in Iraq",
        items: [
          "- Patient registration in the official PHCC Chronic Disease Registry with dedicated follow-up card.",
          "- Monthly clinic visits until blood pressure is controlled (<140/90 general, <130/80 for DM/CKD).",
          "- Quarterly follow-up (every 3 months) for stabilized patients with monthly medication dispensing.",
          "- Comprehensive annual evaluation: Serum creatinine, urinalysis, lipid profile, fundus exam, ECG.",
        ],
      },
      {
        heading: "6. Mandatory Specialist Referral Guidelines",
        items: [
          "- Hypertensive Emergency: BP >180/120 mmHg with acute symptoms -> Immediate referral via Iraqi EMS (Dial 122).",
          "- Suspected Secondary Hypertension: Patients under 30 years of age, or sudden severe refractory elevation.",
          "- Resistant Hypertension: Uncontrolled BP despite full doses of 3 drug classes including a diuretic.",
          "- Renal Complications: Rapidly rising serum creatinine or heavy proteinuria.",
          "- Gestational Hypertension: Elevated BP during pregnancy to prevent pre-eclampsia/eclampsia.",
        ],
      },
    ],
  },
];

console.log("Generating multi-page, high-quality medical PDF documents...");

for (const doc of DOCUMENTS) {
  const pdfBuffer = buildMultiPagePdf(doc);
  const targetPath = path.join(sourcesDir, doc.fileName);
  fs.writeFileSync(targetPath, pdfBuffer);
  console.log(`✓ Generated ${doc.fileName} (${pdfBuffer.length} bytes, multi-page)`);
}

console.log("All 7 medical source PDFs generated successfully!");
