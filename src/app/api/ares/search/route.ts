import { NextRequest, NextResponse } from 'next/server';
import { searchCompaniesByName, searchCompaniesByIco } from '@/lib/ares';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const ico = searchParams.get('ico');

  if (!query && !ico) {
    return NextResponse.json({ error: 'Query or IČO parameter is required' }, { status: 400 });
  }

  try {
    let results;
    
    if (ico) {
      const result = await searchCompaniesByIco(ico);
      results = result ? [result] : [];
    } else if (query) {
      results = await searchCompaniesByName(query);
    }

    return NextResponse.json({ companies: results });
  } catch (error) {
    console.error('Error in ARES search:', error);
    return NextResponse.json({ error: 'Failed to search companies' }, { status: 500 });
  }
}
