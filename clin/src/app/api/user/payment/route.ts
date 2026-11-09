import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Недействительный токен' },
        { status: 401 }
      );
    }

    const { cardNumber, cardHolder, cardExpiry } = await request.json();

    // Validation
    if (!cardNumber || !cardHolder || !cardExpiry) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Mask card number (save only last 4 digits)
    const maskedNumber = '**** **** **** ' + cardNumber.slice(-4);

    // Update user payment info
    await pool.query(
      'UPDATE users SET card_number = $1, card_holder = $2, card_expiry = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      [maskedNumber, cardHolder.toUpperCase(), cardExpiry, decoded.userId]
    );

    return NextResponse.json(
      { message: 'Платежные данные сохранены', cardNumber: maskedNumber },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment save error:', error);
    return NextResponse.json(
      { error: 'Ошибка при сохранении платежных данных' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Недействительный токен' },
        { status: 401 }
      );
    }

    // Remove payment info
    await pool.query(
      'UPDATE users SET card_number = NULL, card_holder = NULL, card_expiry = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [decoded.userId]
    );

    return NextResponse.json(
      { message: 'Платежные данные удалены' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment delete error:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении платежных данных' },
      { status: 500 }
    );
  }
}
