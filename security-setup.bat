@echo off
REM Security Hardening Script for AI²SARS (Windows)

echo.
echo ================================
echo Security Hardening Script
echo ================================
echo.

REM 1. Check Node.js version
echo 1. Checking Node.js version...
node -v
echo.

REM 2. Check npm version
echo 2. Checking npm version...
npm -v
echo.

REM 3. Install dependencies
echo 3. Installing dependencies...
call npm install
echo.

REM 4. Audit for vulnerabilities
echo 4. Running security audit...
call npm audit
echo.

REM 5. Check for outdated packages
echo 5. Checking for outdated packages...
call npm outdated
echo.

REM 6. Create .env files from examples
echo 6. Setting up environment files...
if not exist .env.local (
    copy .env.example .env.local
    echo Created .env.local from .env.example
    echo WARNING: Update .env.local with your secure values
) else (
    echo .env.local already exists
)
echo.

REM 7. Generate random secrets
echo 7. Generate these secure random values and add to .env.local:
echo.
echo Run these commands in PowerShell to generate secrets:
echo [System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
echo.

REM 8. Create necessary directories
echo 8. Creating necessary directories...
if not exist "logs" mkdir logs
if not exist "tmp\uploads" mkdir "tmp\uploads"
echo Created directories
echo.

REM 9. Security recommendations
echo ================================
echo Security Recommendations:
echo ================================
echo.
echo 1. Review SECURITY_CHECKLIST.md for complete implementation
echo 2. Update all API routes using SECURE_ROUTE_TEMPLATE.ts
echo 3. Set up SSL/TLS certificates
echo 4. Configure firewall rules
echo 5. Enable WAF (Web Application Firewall)
echo 6. Set up monitoring and alerting
echo 7. Regular security testing
echo 8. Keep dependencies updated
echo 9. Implement backup strategy
echo 10. Test disaster recovery procedures
echo.
echo Security hardening script completed!
echo.
pause
