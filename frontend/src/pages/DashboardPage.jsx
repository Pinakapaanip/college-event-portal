import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Users2, Building2, CalendarClock } from 'lucide-react';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import api from '../api/client';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import CampusHighlightsCarousel from '../components/CampusHighlightsCarousel';
import ChartViewport from '../components/ChartViewport';
import { useTheme } from '../context/ThemeContext';
import { createChartTheme } from '../utils/chartTheme';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function DashboardPage() {
  const [summary, setSummary] = useState({});
  const [charts, setCharts] = useState({});
  const { theme } = useTheme();
  const { cartesian, radial } = useMemo(() => createChartTheme(theme), [theme]);

  useEffect(() => {
    async function loadDashboard() {
      const [summaryRes, departmentRes, trendRes, categoryRes, mixRes, topRes, winnersRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/events-by-department'),
        api.get('/dashboard/monthly-trend'),
        api.get('/dashboard/category-breakdown'),
        api.get('/dashboard/participant-mix'),
        api.get('/dashboard/top-departments'),
        api.get('/dashboard/winners-leaderboard'),
      ]);

      setSummary(summaryRes.data);
      setCharts({
        department: departmentRes.data,
        trend: trendRes.data,
        category: categoryRes.data,
        mix: mixRes.data,
        top: topRes.data,
        winners: winnersRes.data,
      });
    }

    loadDashboard();
  }, []);

  const departmentChart = {
    labels: charts.department?.map((item) => item.department_name) || [],
    datasets: [{ label: 'Events', data: charts.department?.map((item) => item.total) || [], backgroundColor: '#132b6b' }],
  };

  const trendChart = {
    labels: charts.trend?.map((item) => item.month) || [],
    datasets: [{ label: 'Monthly Events', data: charts.trend?.map((item) => item.total) || [], borderColor: '#d4af37', backgroundColor: 'rgba(212,175,55,0.18)', tension: 0.35 }],
  };

  const categoryChart = {
    labels: charts.category?.map((item) => item.category) || [],
    datasets: [{ label: 'Category Count', data: charts.category?.map((item) => item.total) || [], backgroundColor: ['#0b1f4d', '#132b6b', '#d4af37', '#e67e22', '#9f7aea'] }],
  };

  const participantChart = {
    labels: charts.mix?.map((item) => item.participant_type) || [],
    datasets: [{ data: charts.mix?.map((item) => item.total) || [], backgroundColor: ['#0b1f4d', '#e67e22'] }],
  };

  return (
    <div className="space-y-6">
      <CampusHighlightsCarousel />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Events" value={summary.totalEvents ?? 0} icon={CalendarDays} tone="cyan" />
        <StatCard label="Total Participants" value={summary.totalParticipants ?? 0} icon={Users2} tone="emerald" />
        <StatCard label="Total Departments" value={summary.totalDepartments ?? 0} icon={Building2} tone="amber" />
        <StatCard label="Upcoming Events" value={summary.upcomingEvents ?? 0} icon={CalendarClock} tone="rose" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Events by Department" note="Distribution of events across departments.">
          <ChartViewport className="h-[320px]">
            <Bar data={departmentChart} options={cartesian} />
          </ChartViewport>
        </ChartCard>
        <ChartCard title="Monthly Event Trend" note="Event creation over time.">
          <ChartViewport className="h-[320px]">
            <Line data={trendChart} options={cartesian} />
          </ChartViewport>
        </ChartCard>
        <ChartCard title="Category Breakdown" note="Event categories currently in use.">
          <ChartViewport className="h-[300px]">
            <Doughnut data={categoryChart} options={radial} />
          </ChartViewport>
        </ChartCard>
        <ChartCard title="Internal vs External Participants" note="Participant type split.">
          <ChartViewport className="h-[300px]">
            <Pie data={participantChart} options={radial} />
          </ChartViewport>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Top Active Departments" note="Departments with the most participant activity.">
          <ul className="space-y-3 text-sm">
            {charts.top?.map((item, index) => (
              <li key={item.department} className="portal-table-row flex items-center justify-between rounded-2xl px-4 py-3">
                <span>{index + 1}. {item.department}</span>
                <span className="portal-chip px-3 py-1">{item.total}</span>
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard title="Winners Leaderboard" note="Recent winners captured from results data.">
          <div className="space-y-3 text-sm">
            {charts.winners?.map((item, index) => (
              <div key={`${item.student_name}-${index}`} className="portal-table-row rounded-2xl px-4 py-3">
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
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
