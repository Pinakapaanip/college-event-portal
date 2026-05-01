import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import { useNotifications } from '../context/NotificationContext';

const emptyEvent = {
  id: '',
  title: '',
  category: '',
  department_id: '',
  date: '',
  venue: '',
  organizer: '',
  description: '',
};

export default function ViewEventsPage() {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [query, setQuery] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [category, setCategory] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departments, setDepartments] = useState([]);
  const [editingEvent, setEditingEvent] = useState(emptyEvent);
  const [saving, setSaving] = useState(false);
  const { notify } = useNotifications();

  const fetchEvents = async (page = 1) => {
    try {
      const { data } = await api.get('/api/events', {
        params: { page, q: query, departmentId, category, from, to, limit: 8 },
      });
      const eventList = data.data || data || [];
      // Map field names for compatibility
      const mapped = eventList.map((e) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        department_name: e.department,
        date: e.date,
        venue: e.venue,
        organizer: e.organizer,
        department_id: e.department,
      }));
      setEvents(mapped);
      setPagination({ page: 1, totalPages: 1 });
    } catch (error) {
      console.log('Events fetch error, using fallback', error);
      setEvents([
        { id: 1, title: 'Technical Event 1', category: 'Technical', department_name: 'CSE', date: '2026-01-15', venue: 'Hall A', organizer: 'CSE Club', department_id: 'CSE' },
        { id: 2, title: 'Sports Meet', category: 'Sports', department_name: 'AI', date: '2026-02-10', venue: 'Ground', organizer: 'Sports Club', department_id: 'AI' },
      ]);
      setPagination({ page: 1, totalPages: 1 });
    }
  };

  useEffect(() => {
    api.get('/api/departments')
      .then(({ data }) => setDepartments(data?.data || data || []))
      .catch(() => setDepartments([]));
    fetchEvents();
  }, []);

  const columns = useMemo(
    () => [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'department_name', label: 'Department' },
      { key: 'date', label: 'Date' },
      { key: 'venue', label: 'Venue' },
      { key: 'organizer', label: 'Organizer' },
    ],
    []
  );

  const exportCsv = async () => {
    const response = await api.get('/events/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'events.csv';
    link.click();
    window.URL.revokeObjectURL(url);
    notify('CSV export downloaded.', 'success');
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchEvents(1);
  };

  const startEdit = (eventRow) => {
    setEditingEvent({
      id: eventRow.id,
      title: eventRow.title,
      category: eventRow.category,
      department_id: eventRow.department_id,
      date: eventRow.date,
      venue: eventRow.venue,
      organizer: eventRow.organizer,
      description: eventRow.description || '',
    });
  };

  const submitEdit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.put(`/events/${editingEvent.id}`, editingEvent);
      notify('Event updated successfully.', 'success');
      setEditingEvent(emptyEvent);
      await fetchEvents(pagination.page);
    } catch (error) {
      notify(error.response?.data?.message || 'Failed to update event.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (eventId) => {
    const confirmed = window.confirm('Delete this event? This will also remove linked participants and results.');
    if (!confirmed) return;
    try {
      await api.delete(`/events/${eventId}`);
      notify('Event deleted successfully.', 'success');
      await fetchEvents(pagination.page);
    } catch (error) {
      notify(error.response?.data?.message || 'Failed to delete event.', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="portal-panel p-5">
        <form onSubmit={handleSearch} className="grid gap-3 lg:grid-cols-5">
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="portal-input" placeholder="Search title, venue, organizer" />
          <input value={departmentId} onChange={(event) => setDepartmentId(event.target.value)} className="portal-input" placeholder="Department ID" />
          <input value={category} onChange={(event) => setCategory(event.target.value)} className="portal-input" placeholder="Category" />
          <input value={from} onChange={(event) => setFrom(event.target.value)} type="date" className="portal-input" />
          <input value={to} onChange={(event) => setTo(event.target.value)} type="date" className="portal-input" />
          <div className="flex gap-3 lg:col-span-5">
            <button type="submit" className="portal-button">Apply Filters</button>
            <button type="button" onClick={exportCsv} className="portal-button-secondary">Export CSV</button>
          </div>
        </form>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DataTable
          columns={[
            ...columns,
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="flex gap-2">
                  <button onClick={() => startEdit(row)} className="portal-button-secondary px-3 py-2 text-xs">
                    Edit
                  </button>
                  <button onClick={() => deleteEvent(row.id)} className="portal-button-danger px-3 py-2 text-xs">
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          rows={events}
          emptyMessage="No events found for the selected filters."
        />

        {editingEvent.id ? (
          <div className="portal-panel p-6">
            <h3 className="portal-heading text-2xl">Edit Event</h3>
            <form onSubmit={submitEdit} className="mt-5 space-y-4">
              <input value={editingEvent.title} onChange={(event) => setEditingEvent((current) => ({ ...current, title: event.target.value }))} className="portal-input w-full" placeholder="Title" />
              <input value={editingEvent.category} onChange={(event) => setEditingEvent((current) => ({ ...current, category: event.target.value }))} className="portal-input w-full" placeholder="Category" />
              <select value={editingEvent.department_id} onChange={(event) => setEditingEvent((current) => ({ ...current, department_id: event.target.value }))} className="portal-input w-full">
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.department_name}
                  </option>
                ))}
              </select>
              <input value={editingEvent.date} onChange={(event) => setEditingEvent((current) => ({ ...current, date: event.target.value }))} type="date" className="portal-input w-full" />
              <input value={editingEvent.venue} onChange={(event) => setEditingEvent((current) => ({ ...current, venue: event.target.value }))} className="portal-input w-full" placeholder="Venue" />
              <input value={editingEvent.organizer} onChange={(event) => setEditingEvent((current) => ({ ...current, organizer: event.target.value }))} className="portal-input w-full" placeholder="Organizer" />
              <textarea value={editingEvent.description} onChange={(event) => setEditingEvent((current) => ({ ...current, description: event.target.value }))} rows={4} className="portal-input w-full" placeholder="Description" />
              <div className="flex gap-3">
                <button disabled={saving} className="portal-button disabled:opacity-60">{saving ? 'Updating...' : 'Update Event'}</button>
                <button type="button" onClick={() => setEditingEvent(emptyEvent)} className="portal-button-secondary">
                  Clear
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="portal-panel p-6 text-white/75">
            Select an event from the table to edit it here.
          </div>
        )}
      </div>
      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchEvents} />
    </div>
  );
}
