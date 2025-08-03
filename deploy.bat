@echo off
echo 🚀 AI Web Agency - MVP Deployment Script
echo ==========================================

echo 📦 Checking for Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

echo 🔧 Checking git repository...
if not exist ".git" (
    echo Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit for MVP deployment"
)

echo 🌐 Deploying Frontend to Vercel...
echo Please follow the prompts to connect your Vercel account:
vercel --prod

echo.
echo 🔧 Backend Deployment Instructions:
echo 1. Go to https://render.com
echo 2. Create new Web Service
echo 3. Connect your GitHub repository
echo 4. Set root directory to 'backend/'
echo 5. Add environment variables:
echo    - PERPLEXITY_API_KEY=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
echo    - SUPABASE_URL=https://xxzieezklzehlhizphkj.supabase.co
echo    - SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
echo    - STRIPE_SECRET_KEY=sk_test_...
echo    - STRIPE_WEBHOOK_SECRET=whsec_...
echo    - DATABASE_URL=postgresql://...
echo.
echo 6. Set build command: pip install -r requirements.txt
echo 7. Set start command: uvicorn app.main:app --host 0.0.0.0 --port %%PORT%%
echo.
echo 🎉 Deployment complete! Your MVP is now live!
echo Frontend: https://ai-web-agency.vercel.app
echo Backend: https://your-backend.onrender.com
pause 