@echo off
echo 🚀 Setting up GitHub deployment for AI Web Agency
echo =================================================

echo 📦 Checking prerequisites...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git not found. Please install Git from https://git-scm.com
    echo After installing Git, run this script again.
    pause
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js from https://nodejs.org
    echo After installing Node.js, run this script again.
    pause
    exit /b 1
)

echo ✅ Prerequisites found!

echo 🔧 Initializing Git repository...
if not exist ".git" (
    git init
    git add .
    git commit -m "Initial commit: AI Web Agency MVP"
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo 📋 Next Steps:
echo 1. Create a GitHub repository at https://github.com/new
echo 2. Name it: ai-web-agency
echo 3. Make it public
echo 4. Don't initialize with README (we already have one)
echo 5. Copy the repository URL
echo.
echo 6. Then run: git remote add origin YOUR_REPO_URL
echo 7. Then run: git push -u origin main
echo.
echo 🌐 After pushing to GitHub:
echo - Go to https://vercel.com and import your repository
echo - Go to https://render.com and create a new Web Service
echo.
pause 