import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container page narrow">
      <section className="empty-state">
        <h1>404 — сторінку не знайдено</h1>
        <p className="muted">Перевір URL або повернись на головну сторінку.</p>
        <Link href="/" className="pill">
          Повернутись на головну
        </Link>
      </section>
    </main>
  );
}
