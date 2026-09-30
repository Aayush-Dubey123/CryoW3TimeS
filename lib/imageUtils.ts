export const DEFAULT_FALLBACK_IMAGE = '/news-fallback.jpg';

/**
 * Normalizes article image URLs for production safety.
 * - Replaces missing, empty, invalid, or legacy flaticon URLs with local fallback.
 * - Converts http:// URLs to https:// to avoid mixed-content issues on SSL deployments.
 * - Decodes XML HTML entities (&amp;).
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return DEFAULT_FALLBACK_IMAGE;
  }

  let cleaned = url.trim();

  // Decode XML/HTML entities common in RSS/Atom feeds
  cleaned = cleaned.replace(/&amp;/g, '&');

  // Check for known invalid/placeholder keywords
  const lower = cleaned.toLowerCase();
  const invalidKeywords = [
    'self',
    'default',
    'nsfw',
    'spoiler',
    'none',
    'null',
    'undefined',
    'flaticon.com',
    '[object object]',
  ];

  if (invalidKeywords.some((kw) => lower.includes(kw))) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  // Handle local relative paths
  if (cleaned.startsWith('/')) {
    return cleaned;
  }

  // Normalize http:// to https:// for production security
  if (cleaned.startsWith('http://')) {
    cleaned = cleaned.replace(/^http:\/\//i, 'https://');
  }

  // Ensure valid URL structure
  if (!cleaned.startsWith('https://')) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  return cleaned;
}
