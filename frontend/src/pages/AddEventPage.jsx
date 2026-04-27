import { useState } from 'react';
import { useEffect } from 'react';
import api from '../api/client';
import { useNotifications } from '../context/NotificationContext';

const defaultForm = {
  title: '',
  category: '',
  department_id: '',
  date: '',
  venue: '',
  organizer: '',
  description: '',
};

export default function AddEventPage() {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const { notify } = useNotifications();

  useEffect(() => {
    api.get('/departments').then(({ data }) => setDepartments(data));
  }, []);

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post('/events', form);
      notify('Event created successfully.', 'success');
      setForm(defaultForm);
    } catch (error) {
      notify(error.response?.data?.message || 'Failed to create event.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="portal-panel mx-auto max-w-4xl p-6">
      <h3 className="portal-heading text-2xl">Add Event</h3>
      <p className="portal-subtext mt-2 text-sm">Create a new college event record for dashboard tracking and reporting.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          ['title', 'Event title'],
          ['category', 'Category'],
          ['date', 'Date'],
          ['venue', 'Venue'],
          ['organizer', 'Organizer'],
        ].map(([field, label]) => (
          <div key={field}>
            <label className="portal-label mb-2 block text-sm">{label}</label>
            <input
              value={form[field]}
              onChange={updateField(field)}
              type={field === 'date' ? 'date' : 'text'}
              className="portal-input"
              placeholder={label}
            />
          </div>
        ))}
        <div>
          <label className="portal-label mb-2 block text-sm">Department</label>
          <select
            value={form.department_id}
            onChange={updateField('department_id')}
            className="portal-input"
          >
            <option value="">Select department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.department_name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="portal-label mb-2 block text-sm">Description</label>
          <textarea
            value={form.description}
            onChange={updateField('description')}
            rows={5}
            className="portal-input"
            placeholder="Event description"
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button disabled={saving} className="portal-button disabled:opacity-60">
            {saving ? 'Saving...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
