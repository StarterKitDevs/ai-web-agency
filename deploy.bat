@echo off
echo 🚀 Deploying Enhanced Frontend to Production...
echo.

echo 📦 Adding all changes...
git add .

echo 💾 Committing changes...
git commit -m "🎉 Enhanced frontend with Bolt starter kit - Modern UI and better UX"

echo 🚀 Pushing to GitHub...
git push origin master

echo.
echo ✅ Deployment triggered!
echo 📱 Check your GitHub repository for deployment status
echo 🌐 Your site will be live in a few minutes
echo.
echo 🔗 GitHub Actions: https://github.com/StarterKitDevs/ai-web-agency/actions
echo.
pause 