import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('q');
  const featured = searchParams.get('featured');

  let products = store.getProducts();

  if (category && category !== 'All') {
    products = products.filter(p => {
      const cat = store.getCategories().find(c => c.id === p.category_id);
      return cat?.name.toLowerCase() === category.toLowerCase() || cat?.slug === category.toLowerCase();
    });
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.slug.includes(q));
  }

  if (featured === 'true') {
    products = products.filter(p => p.is_featured);
  }

  return NextResponse.json({
    success: true,
    count: products.length,
    data: products
  });
}
