import { useMemo } from 'react';
import DataTable from './DataTable';

export default function EventTimelineTable({ events }) {
  const rows = useMemo(
    () =>
      [...events]
        .sort((left, right) => String(right.date).localeCompare(String(left.date)))
        .map((event) => ({
          id: event.id,
          title: event.title,
          department_name: event.department_name,
          category: event.category,
          date: new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).format(new Date(event.date)),
        })),
    [events]
  );

  return (
    <DataTable
      columns={[
        { key: 'title', label: 'Event Name' },
        { key: 'department_name', label: 'Department' },
        { key: 'category', label: 'Category' },
        { key: 'date', label: 'Date' },
      ]}
      rows={rows}
      emptyMessage="No events match the selected filters."
    />
  );
}