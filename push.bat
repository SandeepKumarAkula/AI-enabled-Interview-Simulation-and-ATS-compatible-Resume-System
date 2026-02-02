@echo off
cd /d "C:\Users\AKULA SANDEEP KUMAR\Downloads\AI²SARS"
echo.
echo Current directory: %cd%
echo.
echo === Git Status ===
git status
echo.
echo === Adding files ===
git add .
echo.
echo === Committing ===
git commit -m "docs: add comprehensive README and fix help page syntax"
echo.
echo === Pushing to GitHub ===
git push origin main
echo.
echo === Done ===
pause
