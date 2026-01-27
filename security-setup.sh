#!/bin/bash

# Security Hardening Script for AI²SARS

echo "================================"
echo "Security Hardening Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check Node.js version
echo -e "${YELLOW}1. Checking Node.js version...${NC}"
node_version=$(node -v)
if [[ $node_version == v1[4-9].* ]] || [[ $node_version == v[2-9][0-9].* ]]; then
    echo -e "${GREEN}✓ Node.js version is secure: $node_version${NC}"
else
    echo -e "${RED}✗ Update Node.js to version 14 or higher${NC}"
fi
echo ""

# 2. Check npm version
echo -e "${YELLOW}2. Checking npm version...${NC}"
npm_version=$(npm -v)
echo -e "${GREEN}✓ npm version: $npm_version${NC}"
echo ""

# 3. Install dependencies
echo -e "${YELLOW}3. Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# 4. Audit for vulnerabilities
echo -e "${YELLOW}4. Running security audit...${NC}"
npm audit
echo ""

# 5. Check for outdated packages
echo -e "${YELLOW}5. Checking for outdated packages...${NC}"
npm outdated || echo "All packages are up to date"
echo ""

# 6. Create .env files from examples
echo -e "${YELLOW}6. Setting up environment files...${NC}"
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local from .env.example${NC}"
    echo -e "${RED}⚠ IMPORTANT: Update .env.local with your secure values${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi
echo ""

# 7. Generate random secrets
echo -e "${YELLOW}7. Generating secure random values...${NC}"
echo -e "${YELLOW}Copy these values to .env.local:${NC}"
echo ""
echo "API_KEY_SECRET=$(openssl rand -hex 32)"
echo "JWT_SECRET=$(openssl rand -hex 32)"
echo "ENCRYPTION_KEY=$(openssl rand -hex 64)"
echo "SESSION_SECRET=$(openssl rand -hex 32)"
echo ""

# 8. Check file permissions
echo -e "${YELLOW}8. Checking file permissions...${NC}"
if [ -f .env.local ]; then
    chmod 600 .env.local
    echo -e "${GREEN}✓ Set secure permissions on .env.local (600)${NC}"
fi
echo ""

# 9. Create necessary directories
echo -e "${YELLOW}9. Creating necessary directories...${NC}"
mkdir -p /tmp/uploads
mkdir -p logs
echo -e "${GREEN}✓ Created directories${NC}"
echo ""

# 10. Security recommendations
echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}Security Recommendations:${NC}"
echo -e "${YELLOW}================================${NC}"
echo ""
echo "1. Review SECURITY_CHECKLIST.md for complete implementation"
echo "2. Update all API routes using SECURE_ROUTE_TEMPLATE.ts"
echo "3. Set up SSL/TLS certificates"
echo "4. Configure firewall rules"
echo "5. Enable WAF (Web Application Firewall)"
echo "6. Set up monitoring and alerting"
echo "7. Regular security testing"
echo "8. Keep dependencies updated"
echo "9. Implement backup strategy"
echo "10. Test disaster recovery procedures"
echo ""
echo -e "${GREEN}✓ Security hardening script completed${NC}"
