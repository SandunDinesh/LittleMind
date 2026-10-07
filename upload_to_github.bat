@echo off
REM Upload this folder to GitHub and REPLACE everything that is in the repo now.
cd /d "%~dp0"
set REPO=https://github.com/SandunDinesh/LittleMind.git

git --version >nul 2>&1 || (echo Git is not installed: https://git-scm.com/download/win & pause & exit /b 1)

echo.
echo This will REPLACE all files in %REPO% (branch main) with this folder.
set /p OK=Type YES to continue: 
if /I not "%OK%"=="YES" (echo Cancelled. & pause & exit /b 0)

if not exist .git git init
git checkout -B main
git remote remove origin >nul 2>&1
git remote add origin %REPO%

REM keep ONE safety copy of the original repo (only made the first time)
git ls-remote --exit-code --heads origin old-version >nul 2>&1
if errorlevel 1 (
  git fetch origin main && git push origin FETCH_HEAD:refs/heads/old-version
)

git add -A
git commit -m "LittleMind: Backend (FastAPI + RF/SVM model), Frontend (Next.js), Render deployment"
git push -u origin main --force

echo.
echo Done. Check https://github.com/SandunDinesh/LittleMind
pause
