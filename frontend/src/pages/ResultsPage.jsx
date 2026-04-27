import { useEffect, useState } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import { useNotifications } from '../context/NotificationContext';

const defaultForm = {
  event_id: '',
  participant_id: '',
  rank: '',
  prize: '',
};

export default function ResultsPage() {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [results, setResults] = useState([]);
  const [eventId, setEventId] = useState('');
  const [form, setForm] = useState(defaultForm);
  const { notify } = useNotifications();

  useEffect(() => {
    api.get('/events', { params: { limit: 100 } }).then(({ data }) => setEvents(data.data));
    api.get('/results').then(({ data }) => setResults(data));
  }, []);

  useEffect(() => {
    if (!eventId) return;
    api.get(`/participants/event/${eventId}`).then(({ data }) => setParticipants(data));
    api.get('/results', { params: { eventId } }).then(({ data }) => setResults(data));
  }, [eventId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/results', { ...form, event_id: Number(form.event_id), participant_id: Number(form.participant_id), rank: Number(form.rank) });
      notify('Result added successfully.', 'success');
      setForm(defaultForm);
      const { data } = await api.get('/results', { params: { eventId: form.event_id || eventId } });
      setResults(data);
    } catch (error) {
      notify(error.response?.data?.message || 'Failed to add result.', 'error');
    }
  };

  const columns = [
    { key: 'event_title', label: 'Event' },
    { key: 'student_name', label: 'Winner' },
    { key: 'roll_no', label: 'Roll No' },
    { key: 'rank', label: 'Rank' },
    { key: 'prize', label: 'Prize' },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="portal-panel p-6">
        <h3 className="portal-heading text-2xl">Add Result</h3>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <select value={form.event_id} onChange={(event) => { setForm((current) => ({ ...current, event_id: event.target.value })); setEventId(event.target.value); }} className="portal-input w-full">
            <option value="">Select Event</option>
            {events.map((eventItem) => <option key={eventItem.id} value={eventItem.id}>{eventItem.title}</option>)}
          </select>
          <select value={form.participant_id} onChange={(event) => setForm((current) => ({ ...current, participant_id: event.target.value }))} className="portal-input w-full">
            <option value="">Select Participant</option>
            {participants.map((participant) => <option key={participant.id} value={participant.id}>{participant.student_name} - {participant.roll_no}</option>)}
          </select>
          <input value={form.rank} onChange={(event) => setForm((current) => ({ ...current, rank: event.target.value }))} type="number" min="1" className="portal-input w-full" placeholder="Rank" />
          <input value={form.prize} onChange={(event) => setForm((current) => ({ ...current, prize: event.target.value }))} className="portal-input w-full" placeholder="Prize" />
          <button className="portal-button w-full">Save Result</button>
        </form>
      </div>

      <DataTable columns={columns} rows={results} emptyMessage="No results available yet." />
    </div>
  );
}
