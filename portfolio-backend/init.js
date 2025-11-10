#!/usr/bin/env node

/**
 * Backend Initialization Script
 * Helps verify environment configuration before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Portfolio Backend - Configuration Checker\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('   Copy .env.example to .env and fill in your values:');
  console.log('   cp .env.example .env\n');
  process.exit(1);
}

console.log('✅ .env file found');

// Load environment variables
require('dotenv').config();

// Required variables
const requiredVars = [
  'ALLOWED_ORIGINS',
  'SUBSTACK_RSS_URL',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
  'GOOGLE_SHEETS_ID',
];

const warnings = [];
let hasErrors = false;

console.log('\n📋 Checking required environment variables:\n');

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`   ❌ ${varName} - NOT SET`);
    hasErrors = true;
  } else {
    // Mask sensitive values
    const displayValue = varName.includes('KEY') 
      ? '***HIDDEN***' 
      : value.length > 50 
        ? value.substring(0, 50) + '...' 
        : value;
    console.log(`   ✅ ${varName} - ${displayValue}`);
  }
});

// Optional variables
console.log('\n📋 Optional environment variables:\n');

const optionalVars = {
  PORT: process.env.PORT || '8080 (default)',
  NODE_ENV: process.env.NODE_ENV || 'development (default)',
  CACHE_TTL: process.env.CACHE_TTL || '1800 (default)',
  GOOGLE_SHEETS_RANGE: process.env.GOOGLE_SHEETS_RANGE || 'Responses!A:E (default)',
};

Object.entries(optionalVars).forEach(([key, value]) => {
  console.log(`   ℹ️  ${key} - ${value}`);
});

// Check package.json dependencies
console.log('\n📦 Checking dependencies:\n');

const packageJson = require('./package.json');
const requiredDeps = [
  'express',
  'cors',
  'dotenv',
  'rss-parser',
  'googleapis',
  'node-cache',
  'helmet',
  'express-rate-limit',
  'zod',
];

requiredDeps.forEach((dep) => {
  if (packageJson.dependencies[dep]) {
    console.log(`   ✅ ${dep}`);
  } else {
    console.log(`   ❌ ${dep} - MISSING`);
    hasErrors = true;
  }
});

// Final summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('\n❌ Configuration has errors. Please fix them before deployment.\n');
  console.log('Quick fixes:');
  console.log('  1. Run: npm install');
  console.log('  2. Fill in missing values in .env file');
  console.log('  3. Run this script again: node init.js\n');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('\n⚠️  Configuration is valid but has warnings:\n');
  warnings.forEach((warning) => console.log(`   - ${warning}`));
  console.log('\n✅ You can proceed with deployment.\n');
} else {
  console.log('\n✅ All checks passed! Your backend is ready.\n');
  console.log('Next steps:');
  console.log('  1. Test locally: npm run dev');
  console.log('  2. Visit: http://localhost:' + (process.env.PORT || '8080') + '/health');
  console.log('  3. Deploy to Railway/Render');
  console.log('  4. Update frontend NEXT_PUBLIC_API_URL\n');
}
