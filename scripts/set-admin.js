#!/usr/bin/env node

/**
 * Script to set admin custom claims for Firebase users
 * 
 * Usage:
 * 1. Set your Firebase service account key path in FIREBASE_SERVICE_ACCOUNT_KEY environment variable
 * 2. Run: node scripts/set-admin.js <email>
 * 
 * Example: node scripts/set-admin.js nathan@nat1an.xyz
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (!serviceAccount) {
    console.error('Error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required');
    console.error('Please set it to the path of your Firebase service account JSON file');
    process.exit(1);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const serviceAccountKey = require(serviceAccount);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
      projectId: serviceAccountKey.project_id
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error.message);
    process.exit(1);
  }
}

async function setAdminClaim(email) {
  try {
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true,
      roles: ['admin']
    });
    
    console.log(`✅ Successfully set admin claims for user: ${email}`);
    console.log(`   User ID: ${userRecord.uid}`);
    console.log('   Claims: { admin: true, roles: ["admin"] }');
    
    // Verify the claims were set
    const updatedUser = await admin.auth().getUser(userRecord.uid);
    console.log('   Verified custom claims:', updatedUser.customClaims);
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ Error: User with email ${email} not found`);
      console.error('   Make sure the user has created an account first');
    } else {
      console.error('❌ Error setting admin claims:', error.message);
    }
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/set-admin.js <email>');
  console.error('Example: node scripts/set-admin.js nathan@nat1an.xyz');
  process.exit(1);
}

if (!email.includes('@')) {
  console.error('Error: Please provide a valid email address');
  process.exit(1);
}

console.log(`Setting admin claims for: ${email}`);
setAdminClaim(email).then(() => {
  process.exit(0);
});