const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testEndpoints() {
  console.log('🧪 Testing DeepTeam Results Viewer API endpoints...\n');

  try {
    // Test root endpoint
    console.log('1. Testing root endpoint (/)...');
    const rootResponse = await fetch(`${BASE_URL}/`);
    if (rootResponse.ok) {
      const rootData = await rootResponse.json();
      console.log('✅ Root endpoint working:', rootData.message);
    } else {
      console.log('❌ Root endpoint failed:', rootResponse.status, rootResponse.statusText);
    }

    // Test health endpoint
    console.log('\n2. Testing health endpoint (/api/health)...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health endpoint working:', healthData.status);
    } else {
      console.log('❌ Health endpoint failed:', healthResponse.status, healthResponse.statusText);
    }

    // Test results endpoint
    console.log('\n3. Testing results endpoint (/api/results)...');
    const resultsResponse = await fetch(`${BASE_URL}/api/results`);
    if (resultsResponse.ok) {
      const resultsData = await resultsResponse.json();
      console.log(`✅ Results endpoint working: Found ${resultsData.length} files`);
      resultsData.forEach(file => {
        console.log(`   - ${file.filename} (${file.size} bytes)`);
      });
    } else {
      console.log('❌ Results endpoint failed:', resultsResponse.status, resultsResponse.statusText);
      try {
        const errorData = await resultsResponse.json();
        console.log('   Error details:', errorData);
      } catch (e) {
        console.log('   Could not parse error response');
      }
    }

    // Test a specific results file
    console.log('\n4. Testing results file serving...');
    const testFileResponse = await fetch(`${BASE_URL}/results/20250828_202955.json`);
    if (testFileResponse.ok) {
      console.log('✅ Results file serving working');
    } else {
      console.log('❌ Results file serving failed:', testFileResponse.status, testFileResponse.statusText);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/`);
    if (response.ok) {
      console.log('🚀 Server is running! Starting tests...\n');
      await testEndpoints();
    } else {
      console.log('⚠️  Server responded but with error:', response.status);
    }
  } catch (error) {
    console.error('❌ Cannot connect to server. Make sure it\'s running on port 3001.');
    console.log('\nTo start the server:');
    console.log('  npm run server');
    console.log('  or');
    console.log('  node server.js');
  }
}

checkServer();
