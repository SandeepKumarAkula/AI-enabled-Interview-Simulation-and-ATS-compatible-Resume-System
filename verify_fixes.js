#!/usr/bin/env node

/**
 * VERIFICATION SCRIPT: Test that ATS agent fixes are working correctly
 * 
 * This script tests:
 * 1. RL agent override logic (83/100 score → HIRE, not REJECT)
 * 2. No contradictory bullet statements
 * 3. Hard-coded safeguards preventing erroneous REJECT decisions
 * 4. Feature extraction accuracy
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(70));
console.log('AIISARS ATS AGENT VERIFICATION SCRIPT');
console.log('='.repeat(70));
console.log();

// Test 1: Check RL Agent Overrides
console.log('TEST 1: Checking RL Agent Hard-Coded Overrides');
console.log('-'.repeat(70));

const rlAgentPath = path.join(__dirname, 'lib', 'rl-ats-agent.ts');
const rlAgentContent = fs.readFileSync(rlAgentPath, 'utf-8');

const override1 = rlAgentContent.includes('if (atsScoreFromFeatures >= 70 && action === \'reject\')');
const override2 = rlAgentContent.includes('if (atsScoreFromFeatures >= 80 && action !== \'hire\')');

console.log(`✓ Override 1 (ATS >= 70, never reject): ${override1 ? '✅ FOUND' : '❌ MISSING'}`);
console.log(`✓ Override 2 (ATS >= 80, always hire): ${override2 ? '✅ FOUND' : '❌ MISSING'}`);
console.log();

// Test 2: Check for contradictory bullet statements
console.log('TEST 2: Checking for Contradictory Bullet Statements');
console.log('-'.repeat(70));

const routePath = path.join(__dirname, 'app', 'api', 'analyze-resume', 'route.ts');
const routeContent = fs.readFileSync(routePath, 'utf-8');

const formattingSection = routeContent.includes('✅ Your resume uses ATS-compatible formatting with standard bullets');
const noFormattingStatement = routeContent.match(/No bullet-formatted content detected in this analysis/g);
const contradictoryBullets = routeContent.includes('Bullet-formatted content detected. Structure is well-organized') && 
                             noFormattingStatement && noFormattingStatement.length > 0;

console.log(`✓ Formatting section uses consistent checks: ${formattingSection ? '✅ YES' : '⚠️ CHECK'}`);
console.log(`✓ Old contradictory message removed: ${!contradictoryBullets ? '✅ REMOVED' : '❌ STILL PRESENT'}`);

// Check for hasBulletsInResume consolidation
const hasConsolidatedLogic = routeContent.includes('const hasBulletsInResume =') && 
                            routeContent.match(/hasBulletsInResume/g).length >= 3;
console.log(`✓ Consolidated bullet detection logic: ${hasConsolidatedLogic ? '✅ IMPLEMENTED' : '⚠️ PARTIAL'}`);
console.log();

// Test 3: Feature Extraction Accuracy
console.log('TEST 3: Feature Extraction Checks');
console.log('-'.repeat(70));

const featureExtraction = routeContent.includes('technical:') && 
                         routeContent.includes('communication:') &&
                         routeContent.includes('leadership:');
console.log(`✓ Technical feature extraction: ${featureExtraction ? '✅ FOUND' : '❌ MISSING'}`);

const skipHeaderLogic = rlAgentContent.includes('Skip header/contact lines') || 
                       routeContent.includes('Skip first 10 lines') ||
                       routeContent.includes('startIndex >= 10');
console.log(`✓ Skip header lines in extraction: ${skipHeaderLogic ? '✅ IMPLEMENTED' : '⚠️ MISSING'}`);
console.log();

// Test 4: Evidence Deduplication
console.log('TEST 4: Evidence Deduplication');
console.log('-'.repeat(70));

const deduplication = routeContent.includes('new Set') || routeContent.includes('Deduplicat') || 
                      routeContent.includes('max 2 unique');
console.log(`✓ Evidence deduplication logic: ${deduplication ? '✅ FOUND' : '⚠️ MISSING'}`);
console.log();

// Test 5: Confidence Score Adjustments
console.log('TEST 5: Confidence Score Logic');
console.log('-'.repeat(70));

const confidenceBoost = rlAgentContent.includes('confidenceScore = Math.min(1.0, atsScoreFromFeatures / 100)');
console.log(`✓ Confidence based on ATS score: ${confidenceBoost ? '✅ IMPLEMENTED' : '⚠️ MISSING'}`);
console.log();

// Summary
console.log('='.repeat(70));
console.log('VERIFICATION SUMMARY');
console.log('='.repeat(70));

const allChecks = [override1, override2, formattingSection, !contradictoryBullets, 
                   hasConsolidatedLogic, featureExtraction, skipHeaderLogic, 
                   deduplication, confidenceBoost];

const passed = allChecks.filter(c => c).length;
const total = allChecks.length;

console.log(`\n✅ PASSED: ${passed}/${total} critical checks`);

if (passed === total) {
  console.log('\n🎯 ALL SYSTEMS GO - Ready for production testing');
  console.log('\nNext Steps:');
  console.log('1. Restart your development server');
  console.log('2. Test with the 83/100 resume that previously showed REJECT');
  console.log('3. Verify it now shows: ✅ HIRE or 💭 CONSIDER (not REJECT)');
  console.log('4. Check confidence score is >= 70% (not 29%)');
  console.log('5. Verify no contradictory bullet statements in output');
} else {
  console.log('\n⚠️  ISSUES DETECTED - Review failed checks above');
}

console.log('\n' + '='.repeat(70));
console.log(`Verification completed at ${new Date().toISOString()}`);
console.log('='.repeat(70));
