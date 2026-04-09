'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import ArticleCard from './ArticleCard';
import { searchArticles as searchFallbackArticles } from '../lib/mock-data';
import { siteConfig } from '../lib/site-config';

export default function SearchView({ initialQuery = '' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = useMemo(() => String(searchParams.get('q') || initialQuery || '').trim(), [initialQuery, searchParams]);

  const [inputValue, setInputValue] = useState(currentQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    let active = true;

    async function loadResults() {
      if (!currentQuery) {
        setResults([]);
        setError('');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `${siteConfig.apiBaseUrl}/api/search?q=${encodeURIComponent(currentQuery)}&perPage=20`,
          {
            cache: 'no-store'
          }
        );
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(payload?.error?.message || 'Не вдалося виконати пошук');
        }

        if (active) {
          setResults(payload.data || []);
        }
      } catch {
        if (active) {
          setResults(searchFallbackArticles(currentQuery));
          setError('Показано локальні результати пошуку, бо API тимчасово недоступне.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadResults();

    return () => {
      active = false;
    };
  }, [currentQuery]);

  function handleSubmit(event) {
    event.preventDefault();
    const query = inputValue.trim();
    if (!query) {
      router.push('/search');
      return;
    }
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <main className="container page">
      <section className="search-box panel">
        <p className="eyebrow">Пошук</p>
        <h1>Пошук по блогу</h1>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="search"
            name="q"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Наприклад: Railway, SSR, PostgreSQL"
            className="input"
          />
          <button type="submit" className="button">
            Знайти
          </button>
        </form>
      </section>

      {currentQuery ? (
        <section className="panel section-spacer">
          <h2>Результати для: {currentQuery}</h2>
          {error ? <p className="message message-warning">{error}</p> : null}
          {loading ? <p className="muted">Шукаємо матеріали…</p> : null}
          {!loading && results.length ? (
            <div className="article-grid">
              {results.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : null}
          {!loading && !results.length ? (
            <div className="empty-state">
              <p>Нічого не знайдено. Спробуй інший запит.</p>
            </div>
          ) : null}
        </section>
      ) : (
        <section className="empty-state section-spacer">
          <p>Введи ключове слово, щоб знайти матеріали по темі.</p>
        </section>
      )}
    </main>
  );
}
