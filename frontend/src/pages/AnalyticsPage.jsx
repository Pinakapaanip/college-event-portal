import { useEffect, useMemo, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import api from '../api/client';
import AnalyticsFilterBar from '../components/AnalyticsFilterBar';
import ChartCard from '../components/ChartCard';
import EventTimelineTable from '../components/EventTimelineTable';
import EventsOverTimeChart from '../components/EventsOverTimeChart';
import KpiCard from '../components/KpiCard';
import ParticipantsByDeptChart from '../components/ParticipantsByDeptChart';
import ChartViewport from '../components/ChartViewport';
import { useTheme } from '../context/ThemeContext';
import { createChartTheme } from '../utils/chartTheme';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AnalyticsPage() {
  const [data, setData] = useState({ events: [], participants: [], participation: [], results: [] });
  const [filters, setFilters] = useState({ startDate: '', endDate: '', department: '', category: '' });
  const { theme } = useTheme();
  const { cartesian, radial } = createChartTheme(theme);

  useEffect(() => {
    async function loadAnalytics() {
      const [eventsResponse, participantsResponse, participationResponse, resultsResponse] = await Promise.all([
        api.get('/events'),
        api.get('/participants'),
        api.get('/participation'),
        api.get('/results'),
      ]);

      const events = (eventsResponse.data?.data || []).map((event) => ({
        ...event,
        department_name: event.department_name || event.department || 'Unknown',
      }));

      const participantsRows = participantsResponse.data?.data || participantsResponse.data || [];
      const participationRows = participationResponse.data?.data || participationResponse.data || [];
      const resultsRows = Array.isArray(resultsResponse.data) ? resultsResponse.data : resultsResponse.data?.data || [];

      setData({ events, participants: participantsRows, participation: participationRows, results: resultsRows });
    }

    loadAnalytics().catch(() => setData({ events: [], participants: [], participation: [], results: [] }));
  }, []);

  const departmentNames = useMemo(() => [...new Set(data.events.map((event) => event.department_name).filter(Boolean))], [data.events]);
  const availableCategories = useMemo(() => [...new Set(data.events.map((event) => event.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [data.events]);

  const filteredEvents = useMemo(() => data.events.filter((event) => {
    if (filters.startDate && event.date < filters.startDate) return false;
    if (filters.endDate && event.date > filters.endDate) return false;
    if (filters.department && event.department_name !== filters.department) return false;
    if (filters.category && event.category !== filters.category) return false;
    return true;
  }), [data.events, filters]);

  const filteredEventIds = useMemo(() => new Set(filteredEvents.map((event) => event.id)), [filteredEvents]);

  const filteredParticipation = useMemo(() => (data.participation || []).filter((item) => filteredEventIds.has(item.eventId || item.event_id)), [data.participation, filteredEventIds]);
  const participantMap = useMemo(() => new Map((data.participants || []).map((participant) => [participant.id, participant])), [data.participants]);

  const filteredParticipants = useMemo(() => {
    return filteredParticipation.map((item) => {
      const participant = participantMap.get(item.participantId || item.participant_id);
      if (!participant) return null;
      return {
        ...participant,
        event_id: item.eventId || item.event_id,
        event_title: item.eventTitle || item.event_title,
        participant_type: participant.participant_type || participant.type || 'internal',
      };
    }).filter(Boolean);
  }, [filteredParticipation, participantMap]);

  const filteredResults = useMemo(() => (data.results || []).filter((item) => filteredEventIds.has(item.eventId || item.event_id)), [data.results, filteredEventIds]);

  const uniqueParticipantIds = useMemo(() => new Set(filteredParticipants.map((participant) => participant.id)), [filteredParticipants]);
  const totalEvents = filteredEvents.length;
  const totalParticipants = uniqueParticipantIds.size;
  const averageParticipants = totalEvents > 0 ? (filteredParticipants.length / totalEvents).toFixed(1) : '0.0';

  const departmentSeries = useMemo(() => {
    const counts = new Map(departmentNames.map((departmentName) => [departmentName, 0]));
    filteredEvents.forEach((event) => counts.set(event.department_name, (counts.get(event.department_name) || 0) + 1));
    return {
      labels: departmentNames,
      datasets: [{ label: 'Events', data: departmentNames.map((departmentName) => counts.get(departmentName) || 0), backgroundColor: '#132b6b' }],
    };
  }, [departmentNames, filteredEvents]);

  const categorySeries = useMemo(() => {
    const counts = new Map(availableCategories.map((category) => [category, 0]));
    filteredEvents.forEach((event) => counts.set(event.category, (counts.get(event.category) || 0) + 1));
    const palette = ['#0b1f4d', '#132b6b', '#d4af37', '#e67e22', '#9f7aea', '#2a9d8f'];
    return {
      labels: availableCategories,
      datasets: [{ data: availableCategories.map((category) => counts.get(category) || 0), backgroundColor: availableCategories.map((_, index) => palette[index % palette.length]) }],
    };
  }, [availableCategories, filteredEvents]);

  const participantMixSeries = useMemo(() => {
    const counts = { internal: 0, external: 0 };
    filteredParticipants.forEach((participant) => {
      const type = String(participant.participant_type || participant.type || 'internal').toLowerCase();
      if (type === 'external') counts.external += 1;
      else counts.internal += 1;
    });

    return {
      labels: ['Internal', 'External'],
      datasets: [{ data: [counts.internal, counts.external], backgroundColor: ['#0b1f4d', '#e67e22'] }],
    };
  }, [filteredParticipants]);

  const winners = useMemo(() => {
    return [...filteredResults]
      .sort((a, b) => Number(a.rank || 99) - Number(b.rank || 99))
      .slice(0, 10)
      .map((item, index) => ({
        id: item.id || index,
        name: item.student_name || item.winnerName || item.name || 'Winner',
        event_title: item.event_title || item.eventTitle || 'Event',
        rank: item.rank || index + 1,
        note: item.prize || (item.points ? `${item.points} pts` : ''),
      }));
  }, [filteredResults]);

  return (
    <div className="space-y-6">
      <AnalyticsFilterBar
        departments={departmentNames}
        categories={availableCategories}
        filters={filters}
        onChange={(field, value) => setFilters((current) => ({ ...current, [field]: value }))}
        onReset={() => setFilters({ startDate: '', endDate: '', department: '', category: '' })}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <KpiCard label="Total Events" value={totalEvents} tone="cyan" />
        <KpiCard label="Total Participants" value={totalParticipants} tone="emerald" />
        <KpiCard label="Avg Participants per Event" value={averageParticipants} tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Events by Department">
          <ChartViewport className="h-[320px]">
            <Bar data={departmentSeries} options={cartesian} />
          </ChartViewport>
        </ChartCard>
        <ChartCard title="Category Distribution">
          <ChartViewport className="h-[320px]">
            <Pie data={categorySeries} options={radial} />
          </ChartViewport>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Events Over Time" note="Monthly event volume derived from the current filters.">
          <EventsOverTimeChart events={filteredEvents} />
        </ChartCard>
        <ChartCard title="Participants by Department" note="Participant totals derived from the current filters.">
          <ParticipantsByDeptChart participants={filteredParticipants} departments={departmentNames} />
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Internal vs External Participants" note="Participant type split from the filtered event set.">
          <ChartViewport className="h-[300px]">
            <Pie data={participantMixSeries} options={radial} />
          </ChartViewport>
        </ChartCard>

        <ChartCard title="Winners Leaderboard" note="Recent winners captured from the filtered results set.">
          <div className="space-y-3 text-sm">
            {winners.map((item) => (
              <div key={`${item.event_title}-${item.name}-${item.rank}`} className="portal-table-row rounded-2xl px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="portal-subtext">{item.event_title}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[color:var(--portal-accent)]">Rank {item.rank}</p>
                    <p className="portal-subtext">{item.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Event Timeline" note="Events sorted by date, newest first.">
        <EventTimelineTable events={filteredEvents} />
      </ChartCard>
    </div>
  );
}
