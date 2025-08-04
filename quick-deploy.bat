@echo off
echo 🚀 Starting Enhanced Frontend Deployment...
echo.

echo 📦 Adding all files to git...
git add .

echo 💾 Committing changes...
git commit -m "Enhanced frontend with Bolt starter kit"

echo 🚀 Pushing to GitHub...
git push origin master

echo.
echo ✅ Changes pushed successfully!
echo.
echo 🌐 Now deploying to Vercel...
echo.
echo 📋 Next steps:
echo 1. Go to https://vercel.com
echo 2. Sign up/Login with GitHub
echo 3. Click "New Project"
echo 4. Import: https://github.com/StarterKitDevs/ai-web-agency.git
echo 5. Click "Deploy"
echo.
echo 🔗 Your site will be live in 2-3 minutes!
echo.
pause 