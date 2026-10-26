@echo off
chcp 65001 >nul
title Taste the Joy - Push to GitHub Terminal
echo ========================================================
echo   Taste the Joy - رفع المشروع إلى GitHub عبر Terminal
echo ========================================================
echo.

set GIT_EXE="%~dp0mingit\cmd\git.exe"

echo 🚀 جاري الرفع إلى المستودع:
echo https://github.com/wabisabiorchard-prog/tastethejoy.git
echo.
echo سيطلب منك GitHub الآن تسجيل الدخول (Username/Password أو Personal Access Token) في هذه النافذة:
echo.

%GIT_EXE% push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   🎉 تم رفع المشروع بنجاح إلى GitHub بنسبة 100%!
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   ⚠️ حدث خطأ أو تم إلغاء تسجيل الدخول.
    echo ========================================================
)

echo.
pause
