import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import api from '../api/client';
import ChartCard from '../components/ChartCard';
import DataTable from '../components/DataTable';
import { useTheme } from '../context/ThemeContext';
import { createChartTheme } from '../utils/chartTheme';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AnalyticsPage() {
  const [charts, setCharts] = useState({});
  const { theme } = useTheme();
  const { cartesian, radial } = createChartTheme(theme);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/events-by-department'),
      api.get('/dashboard/category-breakdown'),
      api.get('/dashboard/top-departments'),
      api.get('/dashboard/winners-leaderboard'),
    ]).then(([dept, cat, top, winners]) => {
      setCharts({ dept: dept.data, cat: cat.data, top: top.data, winners: winners.data });
    });
  }, []);

  const deptData = {
    labels: charts.dept?.map((item) => item.department_name) || [],
    datasets: [{ label: 'Events', data: charts.dept?.map((item) => item.total) || [], backgroundColor: '#132b6b' }],
  };

  const catData = {
    labels: charts.cat?.map((item) => item.category) || [],
    datasets: [{ data: charts.cat?.map((item) => item.total) || [], backgroundColor: ['#0b1f4d', '#132b6b', '#d4af37', '#e67e22', '#9f7aea'] }],
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Events by Department">
          <div className="h-80">
            <Bar data={deptData} options={cartesian} />
          </div>
        </ChartCard>
        <ChartCard title="Category Distribution">
          <div className="h-80">
            <Pie data={catData} options={radial} />
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Top Active Departments">
          <div className="space-y-3">
            {charts.top?.map((item, index) => (
              <div key={item.department} className="portal-table-row flex items-center justify-between rounded-2xl px-4 py-3">
                <span>{index + 1}. {item.department}</span>
                <span>{item.total}</span>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Winners Snapshot">
          <DataTable
            columns={[
              { key: 'student_name', label: 'Student' },
              { key: 'event_title', label: 'Event' },
              { key: 'rank', label: 'Rank' },
            ]}
            rows={charts.winners || []}
            emptyMessage="No leaderboard data yet."
          />
        </ChartCard>
      </div>
    </div>
  );
}
