function getUrlCandidates(rawValue) {
  return String(rawValue || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeUrl(rawValue, fallback, { preferCustomDomain = false } = {}) {
  const fallbackValue = new URL(fallback).toString().replace(/\/$/, '');
  const candidates = getUrlCandidates(rawValue);
  const validUrls = candidates
    .map((item) => {
      try {
        return new URL(item).toString().replace(/\/$/, '');
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  if (!validUrls.length) {
    return fallbackValue;
  }

  if (preferCustomDomain) {
    const preferred = validUrls.find((item) => {
      const hostname = new URL(item).hostname;
      return !hostname.endsWith('.up.railway.app') && hostname !== 'localhost' && hostname !== '127.0.0.1';
    });

    if (preferred) {
      return preferred;
    }
  }

  return validUrls[0];
}

export function getSiteBaseUrl() {
  return normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000', {
    preferCustomDomain: true
  });
}

export function getApiBaseUrl() {
  const explicit = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  return normalizeUrl(explicit, 'http://localhost:4000');
}

export function toAbsoluteUrl(pathname = '/') {
  if (!pathname) {
    return getSiteBaseUrl();
  }

  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  const siteBase = getSiteBaseUrl();
  return `${siteBase}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

export function toAbsoluteImageUrl(imageUrl) {
  if (!imageUrl) {
    return toAbsoluteUrl('/placeholder-cover.svg');
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  return toAbsoluteUrl(imageUrl);
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'StackVarta',
  baseUrl: getSiteBaseUrl(),
  apiBaseUrl: getApiBaseUrl(),
  description:
    'Новини та статті про frontend, backend, DevOps, AI, кібербезпеку й корисні інструменти.'
};
