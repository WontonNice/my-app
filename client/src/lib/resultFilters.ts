export type ResultSort = 'date-desc' | 'date-asc' | 'score-desc' | 'score-asc' | 'name';
export function resultDate(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date) : '';
}
export function filterResults<T extends { title: string; completedAt: string; percentage: number }>(results: T[], filters: { name: string; from: string; to: string; sort: ResultSort }) {
  return results.filter(result => {
    const date = resultDate(result.completedAt);
    return result.title.toLowerCase().includes(filters.name.trim().toLowerCase()) && (!filters.from || date >= filters.from) && (!filters.to || Boolean(date) && date <= filters.to);
  }).sort((a, b) => {
    const byDate = (Date.parse(b.completedAt) || 0) - (Date.parse(a.completedAt) || 0);
    if (filters.sort === 'date-asc') return -byDate;
    if (filters.sort === 'score-asc') return a.percentage - b.percentage || byDate;
    if (filters.sort === 'score-desc') return b.percentage - a.percentage || byDate;
    if (filters.sort === 'name') return a.title.localeCompare(b.title, undefined, { numeric: true }) || byDate;
    return byDate;
  });
}
