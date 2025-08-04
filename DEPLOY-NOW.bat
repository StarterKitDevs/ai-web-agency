@echo off
echo 🚀 AI Web Agency - Enhanced Frontend Deployment
echo ================================================
echo.

echo 📦 Step 1: Pushing changes to GitHub...
git add .
git commit -m "Enhanced frontend with Bolt starter kit"
git push origin master

echo.
echo ✅ Changes pushed successfully!
echo.

echo 🌐 Step 2: Opening deployment tools...
echo.

echo 📋 Opening Vercel Dashboard...
start https://vercel.com

echo 📋 Opening GitHub Repository...
start https://github.com/StarterKitDevs/ai-web-agency

echo 📋 Opening GitHub Actions...
start https://github.com/StarterKitDevs/ai-web-agency/actions

echo.
echo 🎯 Next Steps:
echo 1. Go to Vercel Dashboard (opened above)
echo 2. Click "New Project"
echo 3. Import: https://github.com/StarterKitDevs/ai-web-agency.git
echo 4. Click "Deploy"
echo 5. Your site will be live in 2-3 minutes!
echo.

echo 🔗 Your enhanced frontend will be live at:
echo https://ai-web-agency.vercel.app
echo.

echo 📖 For detailed instructions, see: COMPLETE-DEPLOYMENT-GUIDE.md
echo.

pause 