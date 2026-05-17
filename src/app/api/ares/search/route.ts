import { NextRequest, NextResponse } from 'next/server';
import { searchCompaniesByName, searchCompaniesByIco } from '@/lib/ares';

/**
 * @swagger
 * /api/ares/search:
 *   get:
 *     summary: Vyhledat společnost v ARES
 *     description: Vyhledá českou společnost podle názvu nebo IČO pomocí ARES API
 *     tags:
 *       - ARES
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Vyhledávací dotaz (název společnosti)
 *       - in: query
 *         name: ico
 *         required: false
 *         schema:
 *           type: string
 *         description: IČO společnosti
 *     responses:
 *       200:
 *         description: Seznam nalezených společností
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *       400:
 *         description: Chybějící parametr query nebo ico
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Chyba při vyhledávání v ARES
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
