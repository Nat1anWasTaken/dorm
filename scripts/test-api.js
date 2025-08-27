#!/usr/bin/env node

/**
 * Simple script to test the notices API endpoint
 */

async function testNoticesAPI() {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing Notices API...\n');
  
  const testCases = [
    {
      name: 'Basic fetch (no parameters)',
      url: `${baseURL}/api/notices`
    },
    {
      name: 'Fetch with category filter',
      url: `${baseURL}/api/notices?category=events`
    },
    {
      name: 'Fetch with search term',
      url: `${baseURL}/api/notices?search=social`
    },
    {
      name: 'Fetch with limit',
      url: `${baseURL}/api/notices?limit=5`
    },
    {
      name: 'Fetch pinned notices only',
      url: `${baseURL}/api/notices?pinned=true`
    },
    {
      name: 'Complex query',
      url: `${baseURL}/api/notices?category=events&search=night&limit=10&pinned=true`
    },
    {
      name: 'Empty parameters (potential issue)',
      url: `${baseURL}/api/notices?category=&search=&limit=&offset=&pinned=`
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    console.log(`URL: ${testCase.url}`);
    
    try {
      const response = await fetch(testCase.url);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Success: ${data.notices?.length || 0} notices returned`);
      } else {
        console.log(`❌ Error ${response.status}:`, data.error);
        if (data.details) {
          console.log('   Details:', JSON.stringify(data.details, null, 2));
        }
      }
    } catch (error) {
      console.log(`❌ Network Error:`, error.message);
    }
    
    console.log(''); // Empty line for readability
  }
}

// Check if server is running
fetch('http://localhost:3000/api/notices')
  .then(() => {
    console.log('✅ Server is running, starting tests...\n');
    testNoticesAPI();
  })
  .catch(() => {
    console.log('❌ Server is not running. Please start the development server with:');
    console.log('   pnpm dev');
    console.log('   Then run this script again.');
  });