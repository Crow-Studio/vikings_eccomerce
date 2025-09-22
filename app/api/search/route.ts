import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database';
import { product, category, images } from '@/database/schema';
import {  or, ilike, eq } from 'drizzle-orm';
const searchCache = new Map<string, { results: any[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; 
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [], total: 0, page, limit });
    }
    const searchKey = `${query.toLowerCase()}-${page}-${limit}`;
    const cached = searchCache.get(searchKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        results: cached.results,
        total: cached.results.length,
        page,
        limit,
        cached: true
      });
    }
    const searchTerm = `%${query.toLowerCase()}%`;
    const offset = (page - 1) * limit;
    const searchResults = await db
      .select({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category_name: category.name,
        category_id: product.category_id,
        image_url: images.url,
        has_variants: product.has_variants,
        created_at: product.created_at
      })
      .from(product)
      .leftJoin(category, eq(product.category_id, category.id))
      .leftJoin(images, eq(product.id, images.product_id))
      .where(
        or(
          ilike(product.name, searchTerm),
          ilike(product.description, searchTerm),
          ilike(category.name, searchTerm)
        )
      )
      .groupBy(product.id, category.name, images.url)
      .orderBy(product.created_at)
      .limit(limit)
      .offset(offset);
    const results = searchResults.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      category_name: item.category_name || 'Uncategorized',
      category_id: item.category_id,
      image_url: item.image_url,
      has_variants: item.has_variants
    }));
    searchCache.set(searchKey, {
      results,
      timestamp: Date.now()
    });
    return NextResponse.json({
      results,
      total: results.length,
      page,
      limit,
      cached: false
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', results: [], total: 0 },
      { status: 500 }
    );
  }
}
