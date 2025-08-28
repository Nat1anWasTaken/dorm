#!/usr/bin/env node

/**
 * Check if Firebase environment variables are properly set
 */

console.log("🔧 Checking Firebase Environment Variables...\n");

const requiredVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

let allSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? "✅ Set" : "❌ Missing";
  const display = value ? `${value.substring(0, 10)}...` : "Not found";

  console.log(`${varName}: ${status} ${value ? `(${display})` : ""}`);

  if (!value) {
    allSet = false;
  }
});

console.log("\n" + "=".repeat(50));

if (allSet) {
  console.log("✅ All Firebase environment variables are set!");
  console.log(
    "If you're still having issues, check your Firebase project settings."
  );
} else {
  console.log("❌ Some Firebase environment variables are missing!");
  console.log("\nMake sure you have a .env.local file with:");
  requiredVars.forEach(varName => {
    console.log(
      `${varName}=your_${varName
        .toLowerCase()
        .replace(/next_public_firebase_/, "")
        .replace(/_/g, "_")}`
    );
  });
  console.log(
    "\nYou can get these values from your Firebase project settings:"
  );
  console.log(
    "https://console.firebase.google.com/project/YOUR_PROJECT/settings/general"
  );
}

console.log("");
