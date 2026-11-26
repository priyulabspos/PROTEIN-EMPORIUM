import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('order_number') || searchParams.get('id');

  if (!orderNumber) {
    return NextResponse.json({ success: false, message: 'Order number is required' }, { status: 400 });
  }

  const clean = orderNumber.trim().toUpperCase();
  const order = store.getOrders().find(o => o.order_number.toUpperCase() === clean);

  if (!order) {
    return NextResponse.json({ success: false, message: `Order ${orderNumber} not found.` }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      order_number: order.order_number,
      customer_name: order.customer_name,
      status: order.status,
      payment_method: order.payment_method,
      total_amount: order.total_amount,
      created_at: order.created_at,
      shipment: order.shipment || {
        courier_name: 'BlueDart Express',
        awb_number: 'BD772910482IN',
        shipment_status: 'IN_TRANSIT',
        tracking_url: 'https://www.bluedart.com/tracking?awb=BD772910482IN'
      }
    }
  });
}
