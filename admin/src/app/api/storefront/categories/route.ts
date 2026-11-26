import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const categories = store.getCategories();
  const brands = store.getBrands();
  const collections = store.getCollections();

  return NextResponse.json({
    success: true,
    categories,
    brands,
    collections
  });
}
