import { useState } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';

export default function SearchEventsPage() {
  const [filters, setFilters] = useState({ q: '', departmentId: '', category: '', from: '', to: '' });
  const [results, setResults] = useState([]);

  const searchEvents = async (event) => {
    event.preventDefault();
    const { data } = await api.get('/events', { params: { ...filters, limit: 20 } });
    setResults(data.data);
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'department_name', label: 'Department' },
    { key: 'date', label: 'Date' },
    { key: 'venue', label: 'Venue' },
  ];

  return (
    <div className="space-y-5">
      <div className="portal-panel p-6">
        <h3 className="portal-heading text-2xl">Search Events</h3>
        <form onSubmit={searchEvents} className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {[
            ['q', 'Search keyword'],
            ['departmentId', 'Department ID'],
            ['category', 'Category'],
          ].map(([key, placeholder]) => (
            <input key={key} value={filters[key]} onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))} className="portal-input" placeholder={placeholder} />
          ))}
          <input value={filters.from} onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))} type="date" className="portal-input" />
          <input value={filters.to} onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))} type="date" className="portal-input" />
          <button className="portal-button md:col-span-2 xl:col-span-5">Search</button>
        </form>
      </div>

      <DataTable columns={columns} rows={results} emptyMessage="Search for events to display results." />
    </div>
  );
}
