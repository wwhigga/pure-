import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Drop old orders table and create new one
    await pool.query(`DROP TABLE IF EXISTS orders CASCADE;`);
    
    await pool.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_type VARCHAR(100) NOT NULL,
        service_name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(20) NOT NULL,
        comment TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return NextResponse.json(
      { message: 'Orders table migrated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error },
      { status: 500 }
    );
  }
}
