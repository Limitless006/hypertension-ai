@echo off
chcp 65001 > nul
echo ========================================================
echo   نبض الأمان - تجهيز المشروع وحفظ التعديلات للرفع
echo ========================================================
echo.
echo جاري إضافة جميع الملفات والمصادر والمكونات إلى Git...
git add .
echo.
echo جاري إنشاء الـ Commit...
git commit -m "feat: complete Hypertension AI Assistant (نبض الأمان) ready for Vercel deployment"
echo.
git branch -M main
echo.
echo ========================================================
echo تم حفظ جميع التعديلات في Git بنجاح!
echo.
echo لرفع المشروع إلى مستودعك على GitHub:
echo 1) أنشئ مستودعاً جديداً على GitHub باسم hypertension-ai
echo 2) انسخ الأمر التالي والصقه في سطر الأوامر:
echo.
echo    git remote add origin https://github.com/Limitless006/hypertension-ai.git
echo    git push -u origin main
echo ========================================================
pause
