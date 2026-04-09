import { NextResponse } from 'next/server';

function getPreferredSiteUrl() {
  const rawValue = process.env.NEXT_PUBLIC_SITE_URL || '';
  const candidate = String(rawValue)
    .split(',')
    .map((item) => item.trim())
    .find(Boolean);

  if (!candidate) {
    return null;
  }

  try {
    return new URL(candidate);
  } catch {
    return null;
  }
}

function isLocalHost(hostname = '') {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function isStaticAsset(pathname = '') {
  return /\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map)$/i.test(pathname);
}

export function middleware(request) {
  const url = request.nextUrl.clone();
  const { hostname, pathname } = url;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || isStaticAsset(pathname) || isLocalHost(hostname)) {
    return NextResponse.next();
  }

  const preferredUrl = getPreferredSiteUrl();
  const forwardedProto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
  let shouldRedirect = false;

  if (forwardedProto === 'http') {
    url.protocol = 'https:';
    shouldRedirect = true;
  }

  if (preferredUrl && !isLocalHost(preferredUrl.hostname) && url.host !== preferredUrl.host) {
    url.protocol = preferredUrl.protocol;
    url.host = preferredUrl.host;
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*'
};
