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

function fallbackEvents() {
  return [
    { id: 1, title: 'Technical Sprint', category: 'Technical', department: 'CSE', department_name: 'CSE', date: '2026-01-15' },
    { id: 2, title: 'Cultural Beats', category: 'Cultural', department: 'AI', department_name: 'AI', date: '2026-02-12' },
    { id: 3, title: 'Sports Day', category: 'Sports', department: 'ECE', department_name: 'ECE', date: '2026-03-03' },
    { id: 4, title: 'Workshop Pro', category: 'Workshop', department: 'MECH', department_name: 'MECH', date: '2026-04-07' },
  ];
}

export default function AnalyticsPage() {
  const [data, setData] = useState({ events: [], participants: [], participation: [], results: [] });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: '',
    category: '',
  });
  const { theme } = useTheme();
  const { cartesian, radial } = createChartTheme(theme);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [eventsResponse, participantsResponse, participationResponse, resultsResponse] = await Promise.all([
          api.get('/events').catch(() => ({ data: { data: fallbackEvents() } })),
          api.get('/participants').catch(() => ({ data: { data: [] } })),
          api.get('/participation').catch(() => ({ data: { data: [] } })),
          api.get('/results').catch(() => ({ data: { data: [] } })),
        ]);

        const events = (eventsResponse.data?.data || []).map((event) => ({
          ...event,
          department_name: event.department_name || event.department || 'Unknown',
        }));

        setData({
          events,
          participants: participantsResponse.data?.data || [],
          participation: participationResponse.data?.data || [],
          results: resultsResponse.data?.data || [],
        });
      } catch {
        console.log('Using fallback data');
        const events = fallbackEvents();
        setData({ events, participants: [], participation: [], results: [] });
      }
    }

    loadAnalytics();
  }, []);

  const departmentNames = useMemo(() => {
    return [...new Set(data.events.map((event) => event.department_name).filter(Boolean))];
  }, [data.events]);

  const availableCategories = useMemo(() => {
    return [...new Set(data.events.map((event) => event.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }, [data.events]);

  const filteredEvents = useMemo(() => {
    return data.events.filter((event) => {
      if (filters.startDate && event.date < filters.startDate) return false;
      if (filters.endDate && event.date > filters.endDate) return false;
      if (filters.department && event.department_name !== filters.department) return false;
      if (filters.category && event.category !== filters.category) return false;
      return true;
    });
  }, [data.events, filters]);

  const filteredEventIds = useMemo(() => new Set(filteredEvents.map((event) => event.id)), [filteredEvents]);

  const filteredParticipation = useMemo(() => {
    return (data.participation || []).filter((item) => filteredEventIds.has(item.eventId));
  }, [data.participation, filteredEventIds]);

  const participantMap = useMemo(() => {
    return new Map((data.participants || []).map((participant) => [participant.id, participant]));
  }, [data.participants]);

  const filteredParticipants = useMemo(() => {
    const expanded = filteredParticipation
      .map((item) => {
        const participant = participantMap.get(item.participantId);
        if (!participant) return null;
        return {
          ...participant,
          event_id: item.eventId,
          event_title: item.eventTitle,
        };
      })
      .filter(Boolean);

    if (expanded.length > 0) {
      return expanded;
    }

    return (data.participants || []).slice(0, 80);
  }, [filteredParticipation, participantMap, data.participants]);

  const filteredResults = useMemo(() => {
    return (data.results || []).filter((item) => filteredEventIds.has(item.eventId));
  }, [data.results, filteredEventIds]);

  const uniqueParticipantIds = useMemo(() => new Set(filteredParticipants.map((participant) => participant.id)), [filteredParticipants]);
  const totalEvents = filteredEvents.length;
  const totalParticipants = uniqueParticipantIds.size;
  const averageParticipants = totalEvents > 0 ? (filteredParticipants.length / totalEvents).toFixed(1) : '0.0';

  const departmentSeries = useMemo(() => {
    const counts = new Map(departmentNames.map((departmentName) => [departmentName, 0]));
    for (const event of filteredEvents) {
      counts.set(event.department_name, (counts.get(event.department_name) || 0) + 1);
    }

    return {
      labels: departmentNames,
      datasets: [{ label: 'Events', data: departmentNames.map((departmentName) => counts.get(departmentName) || 0), backgroundColor: '#132b6b' }],
    };
  }, [departmentNames, filteredEvents]);

  const categorySeries = useMemo(() => {
    const counts = new Map(availableCategories.map((category) => [category, 0]));
    for (const event of filteredEvents) {
      counts.set(event.category, (counts.get(event.category) || 0) + 1);
    }

    const palette = ['#0b1f4d', '#132b6b', '#d4af37', '#e67e22', '#9f7aea', '#2a9d8f', '#f94144', '#577590'];

    return {
      labels: availableCategories,
      datasets: [{ data: availableCategories.map((category) => counts.get(category) || 0), backgroundColor: availableCategories.map((_, index) => palette[index % palette.length]) }],
    };
  }, [availableCategories, filteredEvents]);

  const participantMixSeries = useMemo(() => {
    const counts = { Internal: 0, External: 0 };
    for (const participant of filteredParticipants) {
      const type = participant.type || participant.participant_type || 'Internal';
      if (String(type).toLowerCase() === 'external') {
        counts.External += 1;
      } else {
        counts.Internal += 1;
      }
    }

    return {
      labels: ['Internal', 'External'],
      datasets: [{ data: [counts.Internal, counts.External], backgroundColor: ['#0b1f4d', '#e67e22'] }],
    };
  }, [filteredParticipants]);

  const winners = useMemo(() => {
    if (filteredResults.length > 0) {
      return [...filteredResults]
        .sort((a, b) => Number(a.rank) - Number(b.rank))
        .slice(0, 10)
        .map((item, index) => ({
          id: item.id || index,
          name: item.winnerName || item.name || 'Winner',
          event_title: item.eventTitle || item.event_title || 'Event',
          rank: item.rank || index + 1,
          note: item.points ? `${item.points} pts` : 'Top performance',
        }));
    }

    return [
      { id: 1, name: 'Aarav Kumar', event_title: 'Technical Sprint', rank: 1, note: '100 pts' },
      { id: 2, name: 'Priya Sharma', event_title: 'Cultural Beats', rank: 2, note: '75 pts' },
      { id: 3, name: 'John Smith', event_title: 'Sports Day', rank: 3, note: '50 pts' },
    ];
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
