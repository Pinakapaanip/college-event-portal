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

const EVENT_CATEGORIES = ['Seminar', 'Competition', 'Festival', 'Exhibition', 'Sports'];

function normalizeCategory(value) {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === 'compition' || normalized === 'competition') return 'Competition';
  if (normalized === 'seminar') return 'Seminar';
  if (normalized === 'festival') return 'Festival';
  if (normalized === 'exhibition') return 'Exhibition';
  if (normalized === 'sports') return 'Sports';
  return String(value ?? '').trim();
}

function normalizeEvent(event) {
  return {
    ...event,
    category: normalizeCategory(event.category),
  };
}

function scaleValues(values) {
  const numericValues = values.map((value) => Number(value) || 0);
  const highestValue = Math.max(...numericValues, 0);
  const factor = highestValue > 0 && highestValue <= 2 ? 50 : 1;

  return {
    factor,
    values: numericValues.map((value) => value * factor),
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState({ events: [], participants: [], results: [], departments: [] });
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
      const [eventsResponse, departmentsResponse, resultsResponse] = await Promise.all([
        api.get('/events', { params: { limit: 100, sort: 'date', order: 'asc' } }),
        api.get('/departments'),
        api.get('/results'),
      ]);

      const eventRows = (eventsResponse.data.data || []).map(normalizeEvent);
      const participantResponses = await Promise.all(eventRows.map((event) => api.get(`/participants/event/${event.id}`)));
      const participants = participantResponses.flatMap((response) => response.data || []);

      setData({
        events: eventRows,
        participants,
        results: resultsResponse.data || [],
        departments: departmentsResponse.data || [],
      });
    }

    loadAnalytics();
  }, []);

  const departmentNames = useMemo(() => data.departments.map((department) => department.department_name), [data.departments]);

  const filteredEvents = useMemo(() => {
    return data.events.filter((event) => {
      if (filters.startDate && event.date < filters.startDate) return false;
      if (filters.endDate && event.date > filters.endDate) return false;
      if (filters.department && event.department_name !== filters.department) return false;
      if (filters.category && normalizeCategory(event.category) !== filters.category) return false;
      return true;
    });
  }, [data.events, filters]);

  const filteredEventIds = useMemo(() => new Set(filteredEvents.map((event) => event.id)), [filteredEvents]);

  const filteredParticipants = useMemo(
    () => data.participants.filter((participant) => filteredEventIds.has(participant.event_id)),
    [data.participants, filteredEventIds]
  );

  const filteredResults = useMemo(
    () => data.results.filter((result) => filteredEventIds.has(result.event_id)),
    [data.results, filteredEventIds]
  );

  const filteredWinners = useMemo(() => {
    const participantLookup = new Map(filteredParticipants.map((participant) => [participant.id, participant]));

    return filteredResults
      .map((result) => {
        const participant = participantLookup.get(result.participant_id);
        const event = filteredEvents.find((item) => item.id === result.event_id);

        return {
          id: result.id,
          student_name: participant?.student_name || result.student_name || '',
          event_title: event?.title || result.event_title || '',
          rank: result.rank,
          prize: result.prize,
        };
      })
      .sort((left, right) => left.rank - right.rank)
      .slice(0, 10);
  }, [filteredEvents, filteredParticipants, filteredResults]);

  const departmentSeries = useMemo(() => {
    const counts = new Map(departmentNames.map((departmentName) => [departmentName, 0]));
    for (const event of filteredEvents) {
      counts.set(event.department_name, (counts.get(event.department_name) || 0) + 1);
    }

    const values = departmentNames.map((departmentName) => counts.get(departmentName) || 0);
    const scaled = scaleValues(values);

    return {
      labels: departmentNames,
      datasets: [{ label: 'Events', data: scaled.values, backgroundColor: '#132b6b' }],
      factor: scaled.factor,
    };
  }, [departmentNames, filteredEvents]);

  const categorySeries = useMemo(() => {
    const counts = new Map(EVENT_CATEGORIES.map((category) => [category, 0]));
    for (const event of filteredEvents) {
      const category = normalizeCategory(event.category);
      counts.set(category, (counts.get(category) || 0) + 1);
    }

    return {
      labels: EVENT_CATEGORIES,
      datasets: [{ data: EVENT_CATEGORIES.map((category) => counts.get(category) || 0), backgroundColor: ['#0b1f4d', '#132b6b', '#d4af37', '#e67e22', '#9f7aea'] }],
    };
  }, [filteredEvents]);

  const participantMixSeries = useMemo(() => {
    const counts = { internal: 0, external: 0 };
    for (const participant of filteredParticipants) {
      counts[participant.participant_type] = (counts[participant.participant_type] || 0) + 1;
    }

    return {
      labels: ['internal', 'external'],
      datasets: [{ data: [counts.internal, counts.external], backgroundColor: ['#0b1f4d', '#e67e22'] }],
    };
  }, [filteredParticipants]);

  const totalEvents = filteredEvents.length;
  const totalParticipants = filteredParticipants.length;
  const averageParticipants = totalEvents > 0 ? (totalParticipants / totalEvents).toFixed(1) : '0.0';

  const scaledCartesian = useMemo(
    () => ({
      ...cartesian,
      plugins: {
        ...cartesian.plugins,
        tooltip: {
          ...cartesian.plugins.tooltip,
          callbacks: {
            ...cartesian.plugins.tooltip?.callbacks,
            label: (context) => {
              const factor = context.dataset?.meta?.factor || 1;
              const value = Number(context.parsed.y ?? context.parsed) / factor;
              return `${context.dataset.label || 'Value'}: ${value}`;
            },
          },
        },
      },
      scales: {
        ...cartesian.scales,
        x: {
          ...cartesian.scales.x,
          title: {
            display: true,
            text: 'Department',
          },
        },
        y: {
          ...cartesian.scales.y,
          title: {
            display: true,
            text: 'Event Count',
          },
          ticks: {
            ...cartesian.scales.y?.ticks,
            callback: (value, index, ticks) => {
              const factor = departmentSeries.factor || 1;
              return Number(value) / factor;
            },
          },
        },
      },
    }),
    [cartesian, departmentSeries.factor]
  );

  const departmentChart = useMemo(
    () => ({
      ...departmentSeries,
      datasets: departmentSeries.datasets.map((dataset) => ({ ...dataset, meta: { factor: departmentSeries.factor } })),
    }),
    [departmentSeries]
  );

  return (
    <div className="space-y-6">
      <AnalyticsFilterBar
        departments={departmentNames}
        categories={EVENT_CATEGORIES}
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
            <Bar data={departmentChart} options={scaledCartesian} />
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
            {filteredWinners.length === 0 ? (
              <p className="portal-subtext">No leaderboard data yet.</p>
            ) : (
              filteredWinners.map((item) => (
                <div key={`${item.event_title}-${item.student_name}-${item.rank}`} className="portal-table-row rounded-2xl px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{item.student_name}</p>
                      <p className="portal-subtext">{item.event_title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[color:var(--portal-accent)]">Rank {item.rank}</p>
                      <p className="portal-subtext">{item.prize}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Event Timeline" note="Events sorted by date, newest first.">
        <EventTimelineTable events={filteredEvents} />
      </ChartCard>
    </div>
  );
}
