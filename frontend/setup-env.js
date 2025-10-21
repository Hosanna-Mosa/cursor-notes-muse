const fs = require('fs');
const path = require('path');

const envContent = `VITE_API_URL=http://localhost:5000/api
VITE_APP_TITLE=Notes App
VITE_APP_DESCRIPTION=Create and manage your markdown notes`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file created successfully!');
  console.log('📁 Location:', envPath);
  console.log('🔧 API URL set to: http://localhost:5000/api');
} catch (error) {
  console.error('❌ Error creating environment file:', error.message);
}
