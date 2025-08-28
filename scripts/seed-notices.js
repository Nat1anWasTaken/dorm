#!/usr/bin/env node

/**
 * Script to seed Firestore with sample notices
 *
 * Usage:
 * 1. Make sure your Firebase project is configured
 * 2. Run: node scripts/seed-notices.js
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { initializeApp } = require("firebase/app");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getFirestore, collection, addDoc } = require("firebase/firestore");

// Firebase configuration (use environment variables in production)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Sample notices data
const sampleNotices = [
  {
    title: "Dormitory Social Night",
    description: "Join us for a night of fun and games!",
    content:
      "We're excited to announce our monthly dormitory social night! This is a great opportunity to meet your fellow residents and have some fun.\\n\\n**Event Details:**\\n- Date: Saturday, January 20th\\n- Time: 7:00 PM - 10:00 PM\\n- Location: Common Room\\n\\n**Activities Include:**\\n- Board games and card games\\n- Video game tournaments\\n- Snacks and refreshments\\n- Music and dancing\\n\\nEveryone is welcome to attend! Please bring your student ID for entry. If you have any dietary restrictions or special accommodations needed, please contact the front desk.\\n\\nLet's make this a night to remember!",
    category: "events",
    image: "/placeholder-social.jpg",
    isPinned: true,
    createdAt: "2024-01-20",
  },
  {
    title: "Maintenance Schedule",
    description: "Check the schedule for upcoming maintenance.",
    content:
      "**Important Maintenance Notice**\\n\\nPlease be advised of the following scheduled maintenance activities:\\n\\n**Water System Maintenance**\\n- Date: January 19th, 2024\\n- Time: 9:00 AM - 2:00 PM\\n- Affected Areas: Floors 2-5\\n- Impact: Water will be temporarily unavailable\\n\\n**Elevator Maintenance**\\n- Date: January 21st, 2024\\n- Time: 8:00 AM - 12:00 PM\\n- Affected: Main elevator\\n- Note: Emergency elevator will remain operational\\n\\n**HVAC System Check**\\n- Date: January 22nd, 2024\\n- Time: 10:00 AM - 4:00 PM\\n- Affected: All floors\\n- Impact: Temporary temperature fluctuations possible\\n\\nWe apologize for any inconvenience. Please plan accordingly and contact maintenance at ext. 1234 for urgent issues.",
    category: "maintenance",
    image: "/placeholder-maintenance.jpg",
    isPinned: true,
    createdAt: "2024-01-19",
  },
  {
    title: "New Study Room Rules",
    description: "Please review the new rules for the study room.",
    content:
      "**Updated Study Room Guidelines**\\n\\nEffective immediately, please observe the following rules for all study rooms:\\n\\n**Booking System:**\\n- Maximum reservation: 4 hours per day\\n- Book through the online portal or front desk\\n- Cancel unused reservations to allow others to use the space\\n\\n**Quiet Hours:**\\n- Silent study: 6:00 AM - 10:00 PM\\n- Group discussions allowed in designated rooms only\\n- Phone calls must be taken outside\\n\\n**Cleanliness:**\\n- Clean up after yourself\\n- No food or drinks except water\\n- Report any damage or maintenance issues\\n\\n**Respect Others:**\\n- Keep noise levels appropriate\\n- Don't save seats for extended periods\\n- Be mindful of shared resources\\n\\nThank you for helping maintain a productive study environment for everyone!",
    category: "announcements",
    image: "/placeholder-study.jpg",
    createdAt: "2024-01-18",
  },
  {
    title: "Upcoming Guest Speaker",
    description: "Don't miss our guest speaker this week.",
    content:
      "**Special Guest Speaker Event**\\n\\nWe're thrilled to announce that **Dr. Sarah Chen**, renowned author and career development expert, will be speaking at our dormitory this Thursday!\\n\\n**Speaker Details:**\\n- Topic: 'Navigating Your Career Path in the Digital Age'\\n- Date: Thursday, January 17th, 2024\\n- Time: 7:30 PM - 9:00 PM\\n- Location: Main Auditorium\\n\\n**About Dr. Chen:**\\nDr. Sarah Chen is a bestselling author of 'Future Skills' and has helped thousands of students and professionals transition into successful careers. She holds a PhD in Organizational Psychology and has been featured in major publications.\\n\\n**What You'll Learn:**\\n- Essential skills for the modern workplace\\n- How to build a strong professional network\\n- Strategies for career pivoting and growth\\n- Q&A session with personalized advice\\n\\n**Registration:**\\nFree for all residents! Register at the front desk or online. Light refreshments will be provided.\\n\\nDon't miss this incredible opportunity to learn from an industry expert!",
    category: "events",
    image: "/placeholder-speaker.jpg",
    createdAt: "2024-01-17",
  },
];

async function seedNotices() {
  try {
    console.log("Initializing Firebase...");
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log("Seeding notices to Firestore...");

    for (const notice of sampleNotices) {
      console.log(`Adding notice: ${notice.title}`);

      const docRef = await addDoc(collection(db, "notices"), {
        ...notice,
        // Convert escaped newlines to actual newlines for proper content formatting
        content: notice.content.replace(/\\n/g, "\\n"),
      });

      console.log(`✅ Added notice with ID: ${docRef.id}`);
    }

    console.log("\\n🎉 Successfully seeded all sample notices!");
    console.log(`Total notices added: ${sampleNotices.length}`);
  } catch (error) {
    console.error("❌ Error seeding notices:", error);
    process.exit(1);
  }
}

// Check if required environment variables are set
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingEnvVars.forEach(varName => console.error(`  - ${varName}`));
  console.error("\\nPlease set these in your .env.local file");
  process.exit(1);
}

console.log("🌱 Starting notice seeding process...");
seedNotices();
