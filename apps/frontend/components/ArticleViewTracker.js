'use client';

import { useEffect } from 'react';
import { siteConfig } from '../lib/site-config';

export default function ArticleViewTracker({ articleId }) {
  useEffect(() => {
    if (!articleId) {
      return undefined;
    }

    const controller = new AbortController();
    fetch(`${siteConfig.apiBaseUrl}/api/articles/${articleId}/view`, {
      method: 'POST',
      signal: controller.signal
    }).catch(() => undefined);

    return () => controller.abort();
  }, [articleId]);

  return null;
}
