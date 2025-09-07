# ---------------------------------------------------------
# PowerShell Script for Managing Environment Variables
# ---------------------------------------------------------

# 1. Set Environment Variable
$env:NODE_ENV="development"

# 2. Get Environment Variable
$env:NODE_ENV

# 3. Remove Environment Variable
Remove-Item Env:NODE_ENV

# 4. Update Packages
npx npm-check-updates -u
npm install

# 5. Kill the process on port 3000
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /PID %a /F

# 6. Database Seeding Commands
# Run all seeds
npm run seed

# Run individual seeds
npm run seed:dropdown
npm run seed:permissions
npm run seed:system-users

# Run development server
npm run start:dev
