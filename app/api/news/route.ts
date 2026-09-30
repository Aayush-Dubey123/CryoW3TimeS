import { NextRequest, NextResponse } from 'next/server';
import { getCachedNews, setCachedNews } from '@/lib/cache';
import { normalizeImageUrl } from '@/lib/imageUtils';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  source: {
    name: string;
    icon?: string;
  };
  publishedAt: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim() || 'cryptocurrency';

  // 1. Check Daily 24-Hour Snapshot Cache
  const { hit, snapshot, isStale } = getCachedNews(query);

  if (hit && snapshot) {
    const ageSeconds = Math.round((Date.now() - snapshot.timestamp) / 1000);
    console.log(`[NEWS] CACHE HIT: query="${query}" (age=${ageSeconds}s)`);
    return NextResponse.json(snapshot.data, {
      headers: {
        'X-Cache': 'HIT',
        'X-Cache-Age': `${ageSeconds}s`,
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  }

  if (isStale && snapshot) {
    console.log(`[NEWS] REFRESH: query="${query}" (24h cache expired)`);
  } else {
    console.log(`[NEWS] CACHE MISS: query="${query}"`);
  }

  const newsApiKey = process.env.NEWS_API_KEY?.trim();
  const newsDataKey = (process.env.NEXT_PUBLIC_NEWS_DATA_API_KEY || (newsApiKey?.startsWith('pub_') ? newsApiKey : ''))?.trim();
  const activeNewsDataKey = (newsApiKey?.startsWith('pub_') ? newsApiKey : '') || newsDataKey;
  const gnewsKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY?.trim();

  // 2. Primary Provider: NewsData.io
  if (activeNewsDataKey && activeNewsDataKey !== '') {
    try {
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${activeNewsDataKey}&q=${encodeURIComponent(query)}&language=en`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          const articles: Article[] = data.results.map((item: any) => ({
            title: item.title,
            description: item.description || '',
            url: item.link,
            urlToImage: normalizeImageUrl(item.image_url),
            source: { name: item.source_name || item.source_id || 'NewsData' },
            publishedAt: item.pubDate || new Date().toISOString(),
          }));

          const responseData = {
            status: 'ok',
            totalResults: data.totalResults || articles.length,
            articles,
          };

          console.log(`[NEWS] NEWSDATA SUCCESS: query="${query}" (articles=${articles.length})`);
          setCachedNews(query, responseData);

          return NextResponse.json(responseData, {
            headers: {
              'X-Cache': 'MISS (NewsData.io)',
              'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
            },
          });
        }
      }
    } catch (e) {
      console.warn(`[NEWS] NewsData.io request failed for query="${query}", trying fallback...`, e);
    }
  }

  // 3. Fallback 1: GNews.io
  if (gnewsKey && gnewsKey !== '') {
    try {
      console.log(`[NEWS] GNEWS FALLBACK: query="${query}"`);
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=12&apikey=${gnewsKey}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
          const articles: Article[] = data.articles.map((item: any) => ({
            title: item.title,
            description: item.description || '',
            url: item.url,
            urlToImage: normalizeImageUrl(item.image),
            source: { name: item.source?.name || 'GNews' },
            publishedAt: item.publishedAt || new Date().toISOString(),
          }));

          const responseData = {
            status: 'ok',
            totalResults: data.totalArticles || articles.length,
            articles,
          };

          console.log(`[NEWS] GNEWS SUCCESS: query="${query}" (articles=${articles.length})`);
          setCachedNews(query, responseData);

          return NextResponse.json(responseData, {
            headers: {
              'X-Cache': 'MISS (GNews)',
              'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
            },
          });
        }
      }
    } catch (e) {
      console.warn(`[NEWS] GNews fallback failed for query="${query}", trying RSS fallback...`, e);
    }
  }

  // 4. Fallback 2: Free Multi-RSS Aggregation
  try {
    console.log(`[NEWS] RSS FALLBACK: query="${query}"`);
    const feeds = [
      'https://www.newsbtc.com/feed/',
      'https://bitcoinmagazine.com/.rss/full/',
      'https://cryptopotato.com/feed/',
    ];

    const responses = await Promise.allSettled(
      feeds.map((feed) =>
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`, {
          next: { revalidate: 86400 },
        })
      )
    );

    const feedData = await Promise.all(
      responses
        .filter((res) => res.status === 'fulfilled')
        .map((res: any) => res.value.json())
    );

    const allRssArticles: Article[] = feedData.flatMap(
      (feed) =>
        feed.items?.map((item: any) => ({
          title: item.title || 'Crypto News',
          description: item.description?.replace(/<[^>]*>?/gm, '').slice(0, 200) || '',
          url: item.link || '#',
          urlToImage: normalizeImageUrl(item.thumbnail || item.enclosure?.link),
          source: {
            name: feed.feed?.title || 'Crypto RSS',
            icon: feed.feed?.favicon || undefined,
          },
          publishedAt: item.pubDate || new Date().toISOString(),
        })) || []
    );

    if (allRssArticles.length > 0) {
      const sortedArticles = allRssArticles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 15);

      const responseData = {
        status: 'ok',
        totalResults: sortedArticles.length,
        articles: sortedArticles,
      };

      console.log(`[NEWS] RSS SUCCESS: query="${query}" (articles=${sortedArticles.length})`);
      setCachedNews(query, responseData);

      return NextResponse.json(responseData, {
        headers: {
          'X-Cache': 'MISS (RSS)',
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
      });
    }
  } catch (e) {
    console.warn(`[NEWS] RSS fallback failed for query="${query}"`, e);
  }

  // 5. If all upstreams failed, serve stale cache if available
  if (snapshot) {
    console.warn(`[NEWS] ALL UPSTREAMS FAILED: query="${query}". Serving stale cached snapshot.`);
    return NextResponse.json(snapshot.data, {
      headers: {
        'X-Cache': 'STALE',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  }

  // 6. Safe empty response if everything failed
  return NextResponse.json(
    { status: 'ok', totalResults: 0, articles: [] },
    {
      headers: {
        'X-Cache': 'MISS (EMPTY)',
      },
    }
  );
}