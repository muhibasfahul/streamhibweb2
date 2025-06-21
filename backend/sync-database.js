const { sequelize, User, Order, Server, LiveStream } = require('./models');
require('dotenv').config();

async function syncDatabase() {
  try {
    console.log('🔄 Syncing database models...');
    
    // Sync all models (this will create tables if they don't exist)
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database sync completed!');
    console.log('📊 Tables created/updated:');
    console.log('   - Users');
    console.log('   - Orders'); 
    console.log('   - Servers');
    console.log('   - LiveStreams');
    
    // Check if admin user exists
    const adminUser = await User.findOne({ where: { email: 'admin@streamhib.com' } });
    
    if (!adminUser) {
      console.log('👤 Creating admin user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await User.create({
        email: 'admin@streamhib.com',
        password: hashedPassword,
        fullName: 'Admin StreamHib',
        role: 'admin',
        status: 'active'
      });
      
      console.log('✅ Admin user created!');
      console.log('📧 Email: admin@streamhib.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('👤 Admin user already exists');
    }
    
    console.log('');
    console.log('🚀 Database is ready! You can now:');
    console.log('   1. Start the backend: npm run dev');
    console.log('   2. Access admin dashboard: /admin');
    console.log('   3. Test member area: /member');
    
  } catch (error) {
    console.error('❌ Database sync failed:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();