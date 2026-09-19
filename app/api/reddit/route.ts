import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'cryptocurrency';
  const after = searchParams.get('after');

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 CryoW3times/1.0',
    Accept: 'application/json',
  };

  try {
    // Primary attempt: Search endpoint
    let redditUrl = `https://www.reddit.com/r/CryptoCurrency/search.json?q=${encodeURIComponent(
      query
    )}&sort=top&limit=9${after ? `&after=${after}` : ''}`;

    let response = await fetch(redditUrl, { headers, next: { revalidate: 120 } });

    // Fallback attempt if search fails or returns 403/429: Hot listings endpoint
    if (!response.ok) {
      console.warn(`Reddit search returned status ${response.status}, attempting fallback to hot listing...`);
      redditUrl = `https://www.reddit.com/r/CryptoCurrency/hot.json?limit=9${after ? `&after=${after}` : ''}`;
      response = await fetch(redditUrl, { headers, next: { revalidate: 120 } });
    }

    if (!response.ok) {
      console.warn(`Reddit API fallback returned status ${response.status}`);
      return NextResponse.json({
        data: { children: [], after: null, before: null },
        message: `Reddit API status ${response.status}`,
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Reddit API proxy error:', error);
    return NextResponse.json({
      data: { children: [], after: null, before: null },
      message: 'Failed to fetch Reddit data',
    });
  }
}
