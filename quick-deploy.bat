@echo off
echo 🚀 AI Web Agency - Quick Deployment Guide
echo ==========================================

echo.
echo 📋 Choose your deployment method:
echo.
echo 1. GitHub + Vercel/Render (Recommended)
echo 2. Local Vercel CLI
echo 3. Manual Upload
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto github
if "%choice%"=="2" goto local
if "%choice%"=="3" goto manual
goto invalid

:github
echo.
echo 🚀 Option 1: GitHub + Vercel/Render Deployment
echo ================================================
echo.
echo 📦 Prerequisites needed:
echo - Node.js: https://nodejs.org
echo - Git: https://git-scm.com
echo.
echo After installing, run: .\setup-github.bat
echo.
echo Then follow the steps in DEPLOYMENT-GUIDE.md
goto end

:local
echo.
echo 🚀 Option 2: Local Vercel CLI Deployment
echo =========================================
echo.
echo 📦 Prerequisites needed:
echo - Node.js: https://nodejs.org
echo.
echo After installing Node.js, run:
echo npm install -g vercel
echo vercel login
echo vercel --prod
echo.
echo Then deploy backend to Render
goto end

:manual
echo.
echo 🚀 Option 3: Manual Upload Deployment
echo ====================================
echo.
echo 🌐 Frontend (Vercel):
echo 1. Go to https://vercel.com
echo 2. Click "New Project"
echo 3. Choose "Upload Template"
echo 4. Upload your project files
echo 5. Add environment variables
echo.
echo 🌐 Backend (Render):
echo 1. Go to https://render.com
echo 2. Create new Web Service
echo 3. Choose "Upload Files"
echo 4. Upload your backend folder
echo 5. Configure environment variables
goto end

:invalid
echo ❌ Invalid choice. Please enter 1, 2, or 3.
goto end

:end
echo.
echo 📖 For detailed instructions, see: DEPLOYMENT-GUIDE.md
echo.
pause 