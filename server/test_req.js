const fetch = require('node-fetch'); // or native fetch if Node > 18
async function test() {
  const res = await fetch('http://localhost:5000/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: `test-${Date.now()}@test.com`, password: 'password123' })
  });
  const data = await res.json();
  console.log(res.status);
  console.log(data);
}
test();
