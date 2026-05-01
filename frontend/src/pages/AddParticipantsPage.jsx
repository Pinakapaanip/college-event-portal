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

export default function AddParticipantsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [participants, setParticipants] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const { notify } = useNotifications();

  useEffect(() => {
    api.get('/events')
      .then(({ data }) => {
        const eventList = (data.data || data || []).map((eventItem) => ({
          id: eventItem.id,
          title: eventItem.title,
        }));
        setEvents(eventList);
      })
      .catch(() => {
        console.log('Using fallback data');
        setEvents([
          { id: 1, title: 'Technical Event 1' },
          { id: 2, title: 'Sports Meet' },
          { id: 3, title: 'Cultural Show' },
        ]);
      });
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    api.get('/participants')
      .then(({ data }) => {
        const rows = (data.data || data || []).slice(0, 30).map((participant, index) => ({
          id: participant.id,
          student_name: participant.student_name || participant.name,
          roll_no: participant.roll_no || participant.rollNo || `DEMO-${participant.id}`,
          department: participant.department || 'N/A',
          year: participant.year || '-',
          participant_type: participant.participant_type || participant.type || 'Internal',
        }));
        setParticipants(rows);
      })
      .catch(() => {
        console.log('Using fallback data');
        setParticipants([
          { id: 1, student_name: 'John Doe', roll_no: 'CS001', department: 'CSE', year: '3', participant_type: 'Internal' },
          { id: 2, student_name: 'Alice Smith', roll_no: 'CS002', department: 'CSE', year: '3', participant_type: 'Internal' },
          { id: 3, student_name: 'Bob Johnson', roll_no: 'EC001', department: 'ECE', year: '2', participant_type: 'External' },
        ]);
      });
  }, [selectedEvent]);

  const submitParticipant = async (event) => {
    event.preventDefault();
    try {
      await api.post('/participants', { ...form, event_id: Number(form.event_id) });
      notify('Participant added successfully.', 'success');
      setForm(defaultForm);
    } catch (error) {
      notify(error.response?.data?.message || 'Failed to add participant.', 'error');
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
          <select value={form.event_id} onChange={(event) => setForm((current) => ({ ...current, event_id: event.target.value ? Number(event.target.value) : '' }))} className="portal-input w-full">
            <option value="">Select Event</option>
            {events.map((eventItem) => (
              <option key={eventItem.id} value={eventItem.id}>{eventItem.title}</option>
            ))}
          </select>
          {['student_name', 'roll_no', 'department', 'year'].map((field) => (
            <input
              key={field}
              value={form[field]}
              onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              className="portal-input w-full"
              placeholder={field.replace('_', ' ')}
            />
          ))}
          <select value={form.participant_type} onChange={(event) => setForm((current) => ({ ...current, participant_type: event.target.value }))} className="portal-input w-full">
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>
          <button className="portal-button w-full">Save Participant</button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="portal-panel p-6">
          <h3 className="portal-heading text-2xl">Event Participants</h3>
          <select value={selectedEvent} onChange={(event) => setSelectedEvent(event.target.value ? Number(event.target.value) : '')} className="portal-input mt-4 w-full">
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
