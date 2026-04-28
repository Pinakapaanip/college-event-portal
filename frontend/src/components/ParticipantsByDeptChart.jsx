import { memo, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../context/ThemeContext';
import ChartViewport from './ChartViewport';
import { createChartTheme } from '../utils/chartTheme';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function scaleSeries(values) {
  const numericValues = values.map((value) => Number(value) || 0);
  const highestValue = Math.max(...numericValues, 0);
  const factor = highestValue > 0 && highestValue <= 2 ? 50 : 1;

  return {
    factor,
    values: numericValues.map((value) => value * factor),
  };
}

function ParticipantsByDeptChart({ participants, departments = [] }) {
  const { theme } = useTheme();
  const { cartesian } = createChartTheme(theme);

  const { data, factor } = useMemo(() => {
    const counts = new Map(departments.map((department) => [department, 0]));

    for (const participant of participants) {
      const key = participant.department || 'Unknown';
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const labels = departments.length ? departments : [...counts.keys()];
    const values = labels.map((department) => counts.get(department) || 0);
    const scaled = scaleSeries(values);

    return {
      factor: scaled.factor,
      data: {
        labels,
        datasets: [
          {
            label: 'Participants',
            data: scaled.values,
            backgroundColor: '#132b6b',
            meta: { factor: scaled.factor },
          },
        ],
      },
    };
  }, [departments, participants]);

  const options = useMemo(
    () => ({
      ...cartesian,
      plugins: {
        ...cartesian.plugins,
        tooltip: {
          ...cartesian.plugins.tooltip,
          callbacks: {
            ...cartesian.plugins.tooltip?.callbacks,
            label: (context) => {
              const displayFactor = context.dataset?.meta?.factor || factor || 1;
              const rawValue = Number(context.parsed.y ?? 0) / displayFactor;
              return `${context.dataset.label || 'Participants'}: ${rawValue}`;
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
            text: 'Total Participants',
          },
          ticks: {
            ...cartesian.scales.y?.ticks,
            callback: (value) => Number(value) / factor,
          },
        },
      },
    }),
    [cartesian, factor]
  );

  return (
    <ChartViewport className="h-[320px]">
      <Bar data={data} options={options} />
    </ChartViewport>
  );
}

export default memo(ParticipantsByDeptChart);