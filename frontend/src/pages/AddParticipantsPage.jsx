import { useEffect, useState } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import { useNotifications } from '../context/NotificationContext';

const defaultForm = {
  event_id: '',
  student_name: '',
  roll_no: '',
  department: '',
  year: '',
  participant_type: 'internal',
};

const fallbackEvents = [
  { id: 1, title: 'OJAS 2K26' },
  { id: 2, title: 'Tech Fest' },
];

const fallbackParticipants = [
  { id: 1, student_name: 'Pinakapani P', roll_no: 'DEMO001', department: 'CSE', year: 'III', participant_type: 'internal' },
  { id: 2, student_name: 'Aaliya Roy Gupta', roll_no: 'DEMO002', department: 'AI', year: 'II', participant_type: 'internal' },
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

export default function AddParticipantsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [participants, setParticipants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const { notify } = useNotifications();

  const loadParticipantsByEvent = async (eventId) => {
    if (!eventId) {
      setParticipants([]);
      return;
    }

    try {
      const { data } = await api.get(`/participants/event/${eventId}`);
      const rows = Array.isArray(data) ? data : data?.data || [];
      setParticipants(rows);
    } catch {
      setParticipants(fallbackParticipants);
    }
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
  }, []);

  useEffect(() => {
    loadParticipantsByEvent(selectedEvent);
  }, [selectedEvent]);

  const submitParticipant = async (event) => {
    event.preventDefault();
    const payload = {
      event_id: Number(form.event_id),
      student_name: form.student_name.trim(),
      roll_no: form.roll_no.trim(),
      department: form.department,
      year: form.year.trim(),
      participant_type: form.participant_type.toLowerCase(),
    };

    console.log('API URL:', import.meta.env.VITE_API_URL);
    console.log('SENDING:', payload);

    try {
      const response = await fetchWithRetry(apiUrl('/api/participants'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      console.log('RESPONSE:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to add participant');
      }

      notify('Participant added successfully.', 'success');
      const currentEventId = form.event_id || selectedEvent;
      setForm((previous) => ({ ...defaultForm, event_id: previous.event_id }));
      if (currentEventId) {
        setSelectedEvent(Number(currentEventId));
        await loadParticipantsByEvent(Number(currentEventId));
      }
    } catch (error) {
      console.error(error);
      notify(`Failed to add participant: ${error.message}`, 'error');
    }
  };

  const columns = [
    { key: 'student_name', label: 'Student Name' },
    { key: 'roll_no', label: 'Roll No' },
    { key: 'department', label: 'Department' },
    { key: 'year', label: 'Year' },
    { key: 'participant_type', label: 'Type' },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="portal-panel p-6">
        <h3 className="portal-heading text-2xl">Add Participant</h3>
        <form onSubmit={submitParticipant} className="mt-6 space-y-4">
          <select
            value={form.event_id}
            onChange={(event) => {
              const value = event.target.value ? Number(event.target.value) : '';
              setForm((current) => ({ ...current, event_id: value }));
              setSelectedEvent(value);
            }}
            className={selectClassName}
          >
            <option value="">Select Event</option>
            {events.map((eventItem) => (
              <option key={eventItem.id} value={eventItem.id}>{eventItem.title}</option>
            ))}
          </select>
          {['student_name', 'roll_no', 'year'].map((field) => (
            <input
              key={field}
              value={form[field]}
              onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              className="portal-input w-full"
              placeholder={field.replace('_', ' ')}
            />
          ))}
          <select value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} className={selectClassName}>
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.department_name}>
                {department.department_name}
              </option>
            ))}
          </select>
          <select value={form.participant_type} onChange={(event) => setForm((current) => ({ ...current, participant_type: event.target.value }))} className={selectClassName}>
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>
          <button className="portal-button w-full">Save Participant</button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="portal-panel p-6">
          <h3 className="portal-heading text-2xl">Event Participants</h3>
          <select value={selectedEvent} onChange={(event) => setSelectedEvent(event.target.value)} className={`${selectClassName} mt-4`}>
            <option value="">Choose an event to view participants</option>
            {events.map((eventItem) => (
              <option key={eventItem.id} value={eventItem.id}>{eventItem.title}</option>
            ))}
          </select>
        </div>
        <DataTable columns={columns} rows={participants} emptyMessage="No participants loaded yet." />
      </div>
    </div>
  );
}
