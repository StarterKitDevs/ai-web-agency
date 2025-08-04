@echo off
echo Opening WebAI Studio in your browser...
echo.

REM Wait a moment for the server to be ready
timeout /t 3 /nobreak >nul

REM Open the browser to localhost:3000
start http://localhost:3000

echo.
echo ✅ Browser opened to http://localhost:3000
echo.
echo 🎉 Your WebAI Studio application is now running!
echo.
echo 📱 Features available:
echo - Modern homepage with Bolt-inspired design
echo - Interactive quote form with image upload
echo - Admin dashboard at /admin/login
echo - Chat bot with quick replies
echo - Dark/light mode toggle
echo.
echo 🔐 Admin Login:
echo Email: admin@webai.studio
echo Password: admin123
echo.
pause 