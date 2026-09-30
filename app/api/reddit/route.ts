import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_FALLBACK_IMAGE, normalizeImageUrl } from '@/lib/imageUtils';

/**
 * Reddit Community Feed — Direct RSS/Atom parsing (no API key required)
 *
 * Reddit's JSON API returns 403 for anonymous requests.
 * Reddit's public RSS/Atom feeds return 200 with a proper User-Agent.
 *
 * Feed format: Atom XML with media:thumbnail extensions
 * Parsed with lightweight regex — no XML library needed.
 */

const REDDIT_USER_AGENT =
  'CryoW3Times:news-aggregator:v1.0 (by /u/cryow3times_bot)';

const SUBREDDIT_FEEDS: { sub: string; url: string }[] = [
  { sub: 'CryptoCurrency', url: 'https://www.reddit.com/r/CryptoCurrency/hot/.rss?limit=10' },
  { sub: 'Bitcoin',        url: 'https://www.reddit.com/r/Bitcoin/hot/.rss?limit=6' },
  { sub: 'ethereum',       url: 'https://www.reddit.com/r/ethereum/hot/.rss?limit=6' },
];

// Subreddits relevant to specific search terms
const QUERY_SUBREDDITS: Record<string, string[]> = {
  bitcoin: ['Bitcoin'],
  btc:     ['Bitcoin'],
  ethereum: ['ethereum'],
  eth:     ['ethereum'],
  default: ['CryptoCurrency', 'Bitcoin', 'ethereum'],
};

interface RedditArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  source: { name: string };
  publishedAt: string;
}

// ─── XML helpers ─────────────────────────────────────────────────────────────

function extractText(xml: string, tag: string): string | null {
  const re = new RegExp(
    `<${tag}(?:[^>]*)>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,
    'i'
  );
  return xml.match(re)?.[1]?.trim() ?? null;
}

function extractAttr(xml: string, tag: string, attr: string): string | null {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]+)"`, 'i');
  return xml.match(re)?.[1] ?? null;
}

function parseAtomEntries(xml: string, subreddit: string): RedditArticle[] {
  const rawEntries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];

  return rawEntries.flatMap((entry) => {
    const title = extractText(entry, 'title');
    const link =
      extractAttr(entry, 'link', 'href') ??
      extractText(entry, 'link') ??
      null;
    const published =
      extractText(entry, 'updated') ??
      extractText(entry, 'published') ??
      new Date().toISOString();

    // Skip stickied/removed posts (typically link to /about/rules etc.)
    if (!title || !link || link.includes('/about/')) return [];

    // Extract image from media tags or HTML content
    const rawContent = extractText(entry, 'content') ?? '';
    let rawImg =
      extractAttr(entry, 'media:thumbnail', 'url') ??
      extractAttr(entry, 'media:content', 'url');

    if (!rawImg && rawContent) {
      const imgMatch =
        rawContent.match(/&lt;img[^&]+src=&quot;([^&"]+)&quot;/i) ||
        rawContent.match(/<img[^>]+src="([^"]+)"/i);
      if (imgMatch?.[1]) {
        rawImg = imgMatch[1];
      }
    }

    const imgUrl = normalizeImageUrl(rawImg);

    // Strip HTML from description/content
    const description = rawContent
      .replace(/<[^>]*>?/gm, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 200);

    return [
      {
        title,
        description,
        url: link,
        urlToImage: imgUrl,
        source: { name: `r/${subreddit}` },
        publishedAt: published,
      },
    ];
  });
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('query') ?? 'cryptocurrency').toLowerCase();

  // Select relevant subreddits for the query
  const activeSubs =
    QUERY_SUBREDDITS[Object.keys(QUERY_SUBREDDITS).find((k) => query.includes(k)) ?? 'default'];

  const feeds = SUBREDDIT_FEEDS.filter(({ sub }) =>
    activeSubs.includes(sub)
  );

  const allArticles: RedditArticle[] = [];

  await Promise.allSettled(
    feeds.map(async ({ sub, url }) => {
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': REDDIT_USER_AGENT,
            Accept: 'application/rss+xml, application/xml, text/xml, */*',
          },
          next: { revalidate: 3600 }, // cache 1 hour in Next.js data cache
        });

        if (!res.ok) {
          console.warn(`[REDDIT-RSS] r/${sub} returned ${res.status}`);
          return;
        }

        const xml = await res.text();
        const articles = parseAtomEntries(xml, sub);
        allArticles.push(...articles);
        console.log(`[REDDIT-RSS] r/${sub}: parsed ${articles.length} posts`);
      } catch (err) {
        console.error(`[REDDIT-RSS] r/${sub} error:`, err);
      }
    })
  );

  // Sort by newest first
  const sorted = allArticles
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 18);

  if (sorted.length === 0) {
    console.warn('[REDDIT-RSS] All feeds returned empty — serving empty response');
  }

  return NextResponse.json({
    status: 'ok',
    articles: sorted,
    totalResults: sorted.length,
  });
}
