const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'tests/integration');
const files = fs.readdirSync(dir);
files.forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/password123/g, 'Password123!');
    fs.writeFileSync(filePath, content);
  }
});
console.log('done');
