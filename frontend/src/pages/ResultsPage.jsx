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

const fallbackEvents = [
  { id: 1, title: 'OJAS 2K26' },
  { id: 2, title: 'Tech Fest' },
];

const fallbackParticipants = [
  { id: 1, student_name: 'Pinakapani P', name: 'Pinakapani P', roll_no: 'DEMO001' },
  { id: 2, student_name: 'Aaliya Roy Gupta', name: 'Aaliya Roy Gupta', roll_no: 'DEMO002' },
];

const fallbackDepartments = [
  { id: 1, department_name: 'CSE' },
  { id: 2, department_name: 'AI' },
];

const selectClassName = 'w-full p-3 rounded-lg bg-[#020617] text-white border border-gray-600 focus:outline-none';

const fetchWithRetry = async (url, options, retries = 2) => {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
};

function apiUrl(path) {
  return `${import.meta.env.VITE_API_URL}${path}`;
}

export default function ResultsPage() {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [results, setResults] = useState([]);
  const [eventId, setEventId] = useState('');
  const [form, setForm] = useState(defaultForm);
  const { notify } = useNotifications();

  const loadResults = async (selectedEventId = '') => {
    const query = selectedEventId ? { params: { eventId: selectedEventId } } : undefined;
    const { data } = await api.get('/results', query);
    setResults(Array.isArray(data) ? data : data?.data || []);
  };

  const loadParticipants = async (selectedEventId) => {
    if (!selectedEventId) {
      setParticipants(fallbackParticipants);
      return;
    }
    const { data } = await api.get(`/participants/event/${selectedEventId}`);
    setParticipants(Array.isArray(data) ? data : data?.data || []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsResponse, participantsResponse, departmentsResponse] = await Promise.all([
          api.get('/events'),
          api.get('/participants'),
          api.get('/departments'),
        ]);
        const loadedEvents = eventsResponse.data?.data || eventsResponse.data || [];
        const loadedParticipants = participantsResponse.data?.data || participantsResponse.data || [];
        const loadedDepartments = departmentsResponse.data?.data || departmentsResponse.data || [];

        setEvents(loadedEvents);
        setParticipants(loadedParticipants);
        setDepartments(loadedDepartments);
        console.log('EVENTS', loadedEvents);
        console.log('PARTICIPANTS', loadedParticipants);
        console.log('DEPARTMENTS', loadedDepartments);
      } catch {
        setEvents(fallbackEvents);
        setParticipants(fallbackParticipants);
        setDepartments(fallbackDepartments);
        console.log('EVENTS', fallbackEvents);
        console.log('PARTICIPANTS', fallbackParticipants);
        console.log('DEPARTMENTS', fallbackDepartments);
      }
    };

    loadData();
    loadResults().catch(() => setResults([]));
  }, []);

  useEffect(() => {
    if (!eventId) return;
    loadParticipants(eventId).catch(() => setParticipants(fallbackParticipants));
    loadResults(eventId).catch(() => setResults([]));
  }, [eventId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      event_id: Number(form.event_id),
      participant_id: Number(form.participant_id),
      rank: Number(form.rank),
      prize: form.prize.trim(),
    };

    console.log('API URL:', import.meta.env.VITE_API_URL);
    console.log('SENDING:', payload);

    try {
      const response = await fetchWithRetry(apiUrl('/api/results'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      console.log('RESPONSE:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to add result');
      }

      notify('Result added successfully.', 'success');
      setForm((previous) => ({ ...defaultForm, event_id: previous.event_id }));
      await loadResults(form.event_id || eventId);
    } catch (error) {
      console.error(error);
      notify(`Failed to add result: ${error.message}`, 'error');
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
          <select
            value={form.event_id}
            onChange={(event) => {
              const value = event.target.value;
              setForm((current) => ({ ...current, event_id: value, participant_id: '' }));
              setEventId(value);
            }}
            className={selectClassName}
          >
            <option value="">Select Event</option>
            {events.map((eventItem) => <option key={eventItem.id} value={eventItem.id}>{eventItem.title}</option>)}
          </select>
          <select value={form.participant_id} onChange={(event) => setForm((current) => ({ ...current, participant_id: event.target.value }))} className={selectClassName}>
            <option value="">Select Participant</option>
            {participants.map((participant) => <option key={participant.id} value={participant.id}>{participant.student_name || participant.name}</option>)}
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
