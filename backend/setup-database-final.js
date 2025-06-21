const { Pool } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  console.log('🔧 Setting up StreamHib Database...');
  
  // Connect to PostgreSQL with your password
  const adminPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Cawet3Sewu',
    port: 5432,
  });

  try {
    console.log('🔄 Connecting to PostgreSQL...');
    await adminPool.query('SELECT 1');
    console.log('✅ Connected successfully!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('');
    console.log('🔧 Please check:');
    console.log('1. PostgreSQL is running: sudo systemctl status postgresql');
    console.log('2. Password is correct: Cawet3Sewu');
    console.log('3. Try: sudo -u postgres psql -c "ALTER USER postgres PASSWORD \'Cawet3Sewu\';"');
    return;
  }

  try {
    // Drop and recreate database for clean setup
    console.log('🗑️ Cleaning up old database...');
    await adminPool.query('DROP DATABASE IF EXISTS streamhib');
    await adminPool.query('DROP USER IF EXISTS streamhib_user');
    
    // Create database
    console.log('📊 Creating database...');
    await adminPool.query('CREATE DATABASE streamhib');
    console.log('✅ Database "streamhib" created');

    // Create user
    console.log('👤 Creating database user...');
    await adminPool.query("CREATE USER streamhib_user WITH PASSWORD 'streamhib123'");
    console.log('✅ User "streamhib_user" created');

    // Grant privileges
    console.log('🔑 Granting privileges...');
    await adminPool.query('GRANT ALL PRIVILEGES ON DATABASE streamhib TO streamhib_user');
    await adminPool.query('ALTER USER streamhib_user CREATEDB');
    console.log('✅ Privileges granted');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    return;
  } finally {
    await adminPool.end();
  }

  // Connect to streamhib database and create tables
  const streamhibPool = new Pool({
    user: 'streamhib_user',
    host: 'localhost',
    database: 'streamhib',
    password: 'streamhib123',
    port: 5432,
  });

  try {
    console.log('📋 Creating tables...');
    
    // Create Users table with all required columns
    await streamhibPool.query(`
      CREATE TABLE IF NOT EXISTS "Users" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "fullName" VARCHAR(255) NOT NULL,
        "phone" VARCHAR(255),
        "status" VARCHAR(50) DEFAULT 'pending_payment' CHECK ("status" IN ('pending_payment', 'active', 'suspended', 'expired')),
        "subscription" VARCHAR(255),
        "role" VARCHAR(50) DEFAULT 'user' CHECK ("role" IN ('user', 'admin')),
        "expiryDate" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create Orders table
    await streamhibPool.query(`
      CREATE TABLE IF NOT EXISTS "Orders" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "orderId" VARCHAR(255) UNIQUE NOT NULL,
        "userEmail" VARCHAR(255) NOT NULL,
        "userName" VARCHAR(255) NOT NULL,
        "userPhone" VARCHAR(255),
        "packageType" VARCHAR(255) NOT NULL,
        "packageName" VARCHAR(255) NOT NULL,
        "amount" INTEGER NOT NULL,
        "status" VARCHAR(50) DEFAULT 'pending' CHECK ("status" IN ('pending', 'paid', 'failed')),
        "transactionStatus" VARCHAR(255),
        "fraudStatus" VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create Servers table
    await streamhibPool.query(`
      CREATE TABLE IF NOT EXISTS "Servers" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL,
        "hetznerServerId" VARCHAR(255),
        "serverName" VARCHAR(255) NOT NULL,
        "ipAddress" VARCHAR(255),
        "serverType" VARCHAR(50) DEFAULT 'cx11',
        "status" VARCHAR(50) DEFAULT 'provisioning' CHECK ("status" IN ('provisioning', 'installing', 'ready', 'error', 'suspended')),
        "sshUsername" VARCHAR(255) DEFAULT 'root',
        "sshPassword" VARCHAR(255),
        "dashboardUrl" VARCHAR(255),
        "dashboardUsername" VARCHAR(255),
        "dashboardPassword" VARCHAR(255),
        "packageType" VARCHAR(255) NOT NULL,
        "expiryDate" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE
      )
    `);

    // Create LiveStreams table
    await streamhibPool.query(`
      CREATE TABLE IF NOT EXISTS "LiveStreams" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "serverId" UUID NOT NULL,
        "userId" UUID NOT NULL,
        "streamTitle" VARCHAR(255) NOT NULL,
        "platform" VARCHAR(50) NOT NULL CHECK ("platform" IN ('youtube', 'facebook', 'both')),
        "streamKey" VARCHAR(255) NOT NULL,
        "streamUrl" VARCHAR(255),
        "videoFile" VARCHAR(255),
        "status" VARCHAR(50) DEFAULT 'stopped' CHECK ("status" IN ('stopped', 'starting', 'live', 'error')),
        "quality" VARCHAR(50) DEFAULT '720p',
        "bitrate" INTEGER DEFAULT 2500,
        "fps" INTEGER DEFAULT 30,
        "isScheduled" BOOLEAN DEFAULT FALSE,
        "scheduleStart" TIMESTAMP WITH TIME ZONE,
        "scheduleEnd" TIMESTAMP WITH TIME ZONE,
        "totalViewers" INTEGER DEFAULT 0,
        "liveDuration" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE
      )
    `);

    console.log('✅ All tables created successfully!');

    // Create admin user
    console.log('👤 Creating admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await streamhibPool.query(`
      INSERT INTO "Users" (
        "email", "password", "fullName", "role", "status"
      ) VALUES (
        'admin@streamhib.com', $1, 'Admin StreamHib', 'admin', 'active'
      ) ON CONFLICT ("email") DO NOTHING
    `, [hashedPassword]);

    // Create test user
    const testUserPassword = await bcrypt.hash('test123', 12);
    await streamhibPool.query(`
      INSERT INTO "Users" (
        "email", "password", "fullName", "role", "status", "subscription"
      ) VALUES (
        'test@streamhib.com', $1, 'Test User', 'user', 'active', 'pro'
      ) ON CONFLICT ("email") DO NOTHING
    `, [testUserPassword]);

    console.log('✅ Admin and test users created!');
    console.log('');
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📋 Database Details:');
    console.log('   Database: streamhib');
    console.log('   User: streamhib_user');
    console.log('   Password: streamhib123');
    console.log('');
    console.log('👤 Login Credentials:');
    console.log('   Admin: admin@streamhib.com / admin123');
    console.log('   Test User: test@streamhib.com / test123');
    console.log('');
    console.log('🔗 Database URL:');
    console.log('   postgresql://streamhib_user:streamhib123@localhost:5432/streamhib');

  } catch (error) {
    console.error('❌ Error setting up tables:', error);
  } finally {
    await streamhibPool.end();
  }
}

setupDatabase();