import db from '../config/db.js';

async function setupAdminPanel() {
  try {
    console.log('🚀 Setting up admin panel...');
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Admins table ready');

    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password VARCHAR(255);
    `);
    console.log('✅ Users table updated');

    console.log('\n🎉 Admin panel setup complete!');
    console.log('You can now signup at POST /api/auth/signup');
    
  } catch (error) {
    console.error('❌ Setup error:', error);
  } finally {
    process.exit();
  }
}

setupAdminPanel();