import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Add avatar_url column if it doesn't exist
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
    `);

    // Add payment card columns if they don't exist
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS card_number VARCHAR(20);
    `);

    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS card_holder VARCHAR(255);
    `);

    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS card_expiry VARCHAR(5);
    `);

    // Fix card_number column size if it's too small
    await pool.query(`
      ALTER TABLE users ALTER COLUMN card_number TYPE VARCHAR(20);
    `);

    return NextResponse.json(
      { message: 'Migration completed successfully - added avatar_url and payment card columns' },
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
