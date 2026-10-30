import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#1d4ed8",
};

export const metadata: Metadata = {
  title: "نبض الأمان | المساعد الطبي الذكي لارتفاع ضغط الدم",
  description:
    "المنصة الطبية الذكية التفاعلية لارتفاع ضغط الدم - مستندة إلى معايير منظمة الصحة العالمية (WHO) وجمعية القلب الأمريكية (AHA) ومايو كلينك",
  keywords: [
    "ارتفاع ضغط الدم",
    "نبض الأمان",
    "طبي",
    "صحة القلب",
    "حمية داش",
    "القاتل الصامت",
    "WHO",
    "AHA",
    "Mayo Clinic",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "نبض الأمان",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full font-['Cairo',sans-serif] bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden max-w-full">
        {children}
      </body>
    </html>
  );
}
