import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: 'Scratch code is required' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const result = store.verifyScratchCode(code, ip);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
