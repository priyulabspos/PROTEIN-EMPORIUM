import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, cartAmount } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: 'Coupon code is required' }, { status: 400 });
    }

    const result = store.validateCoupon(code, Number(cartAmount) || 0);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
  }
}
