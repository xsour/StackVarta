import { Suspense } from 'react';
import SearchView from '../../components/SearchView';

export const metadata = {
  title: 'Пошук',
  description: 'Пошук статей за заголовком, описом, текстом та тегами.',
  robots: {
    index: false,
    follow: true
  }
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container page"><p className="muted">Завантаження...</p></div>}>
      <SearchView />
    </Suspense>
  );
}
