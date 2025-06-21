const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('🔄 Running database migration...');
    
    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '001-add-role-and-expiry.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute migration
    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('📧 Admin user created: admin@streamhib.com');
    console.log('🔑 Admin password: admin123');
    console.log('');
    console.log('🚀 You can now access:');
    console.log('   - Admin Dashboard: http://your-domain.com/admin');
    console.log('   - Member Area: http://your-domain.com/member');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();