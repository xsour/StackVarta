export function parseDisplayDate(value) {
  if (!value) return null;

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function formatDate(value, locale = 'uk-UA') {
  const parsedDate = parseDisplayDate(value);
  if (!parsedDate) return '';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(parsedDate);
}

export function formatMonthYear(value, locale = 'uk-UA') {
  const parsedDate = parseDisplayDate(value);
  if (!parsedDate) return '';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long'
  }).format(parsedDate);
}
