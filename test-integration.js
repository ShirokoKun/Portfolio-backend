// Integration test for backend and frontend
const http = require('http');

console.log('\n🧪 Testing Portfolio Integration...\n');

// Test 1: Backend Health Check
function testBackendHealth() {
  return new Promise((resolve, reject) => {
    console.log('1️⃣  Testing Backend Health...');
    http.get('http://localhost:8080/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          console.log('   ✅ Backend is healthy');
          console.log(`   ⏱️  Uptime: ${Math.floor(result.uptime)}s`);
          resolve();
        } else {
          reject(new Error(`Health check failed: ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

// Test 2: Backend Blog Posts
function testBackendBlog() {
  return new Promise((resolve, reject) => {
    console.log('\n2️⃣  Testing Backend Blog Posts...');
    http.get('http://localhost:8080/api/blog/posts', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          console.log(`   ✅ Fetched ${result.count} posts`);
          console.log(`   📦 Cached: ${result.cached}`);
          if (result.posts.length > 0) {
            console.log(`   📝 Latest: "${result.posts[0].title}"`);
            console.log(`   📅 Published: ${result.posts[0].pubDate}`);
          }
          resolve();
        } else {
          reject(new Error(`Blog fetch failed: ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

// Test 3: Frontend Health Check
function testFrontendHealth() {
  return new Promise((resolve, reject) => {
    console.log('\n3️⃣  Testing Frontend...');
    http.get('http://localhost:3000/', (res) => {
      if (res.statusCode === 200) {
        console.log('   ✅ Frontend is running');
        console.log(`   🌐 URL: http://localhost:3000`);
        resolve();
      } else {
        reject(new Error(`Frontend check failed: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

// Run all tests
async function runTests() {
  try {
    await testBackendHealth();
    await testBackendBlog();
    await testFrontendHealth();
    
    console.log('\n✨ All tests passed! Your portfolio is live!\n');
    console.log('🔗 Open: http://localhost:3000');
    console.log('📡 Backend: http://localhost:8080');
    console.log('\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n');
    process.exit(1);
  }
}

runTests();
