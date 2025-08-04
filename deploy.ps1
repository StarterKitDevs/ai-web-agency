Write-Host "🚀 Deploying Enhanced Frontend to Production..." -ForegroundColor Green
Write-Host ""

try {
    Write-Host "📦 Adding all changes..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m "🎉 Enhanced frontend with Bolt starter kit - Modern UI and better UX"
    
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
    git push origin master
    
    Write-Host ""
    Write-Host "✅ Deployment triggered successfully!" -ForegroundColor Green
    Write-Host "📱 Check your GitHub repository for deployment status" -ForegroundColor Cyan
    Write-Host "🌐 Your site will be live in a few minutes" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔗 GitHub Actions: https://github.com/StarterKitDevs/ai-web-agency/actions" -ForegroundColor Blue
    Write-Host "🔗 Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Blue
    Write-Host ""
    
} catch {
    Write-Host "❌ Error during deployment: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check your git configuration and try again." -ForegroundColor Yellow
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 