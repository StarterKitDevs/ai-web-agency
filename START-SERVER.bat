@echo off
echo 🚀 Starting Enhanced Frontend Server...
echo ======================================
echo.

echo 📦 Setting up Node.js PATH...
set PATH=%PATH%;C:\Program Files\nodejs

echo ✅ Node.js version:
node --version

echo.
echo 🌐 Starting development server...
echo.
echo 🎉 Your site will be live at:
echo http://localhost:3000
echo.
echo ⚠️  Keep this window open to run the server
echo 🌐 Open your browser and go to: http://localhost:3000
echo.
echo 🚀 Starting server...
npm run dev 