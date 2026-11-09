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

    const { serviceType, serviceName, price, address, phone, date, time, comment } = await request.json();

    // Validation
    if (!serviceType || !serviceName || !price || !address || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      );
    }

    // Check if user has payment method
    const userResult = await pool.query(
      'SELECT card_number FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!userResult.rows[0].card_number) {
      return NextResponse.json(
        { error: 'Необходимо добавить платежные данные перед оформлением заказа' },
        { status: 400 }
      );
    }

    // Create order
    const result = await pool.query(
      `INSERT INTO orders (user_id, service_type, service_name, price, address, phone, date, time, comment, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING id, created_at`,
      [decoded.userId, serviceType, serviceName, price, address, phone, date, time, comment || null, 'pending']
    );

    return NextResponse.json(
      { 
        message: 'Заказ успешно создан',
        order: result.rows[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании заказа' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    // Get user orders
    const result = await pool.query(
      `SELECT id, service_type, service_name, price, address, phone, date, time, comment, status, created_at 
       FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [decoded.userId]
    );

    return NextResponse.json({ orders: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении заказов' },
      { status: 500 }
    );
  }
}
