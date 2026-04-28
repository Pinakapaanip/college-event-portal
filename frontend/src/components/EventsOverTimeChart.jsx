import { memo, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../context/ThemeContext';
import ChartViewport from './ChartViewport';
import { createChartTheme } from '../utils/chartTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function scaleSeries(values) {
  const numericValues = values.map((value) => Number(value) || 0);
  const highestValue = Math.max(...numericValues, 0);
  const factor = highestValue > 0 && highestValue <= 2 ? 50 : 1;

  return {
    factor,
    values: numericValues.map((value) => value * factor),
  };
}

function EventsOverTimeChart({ events }) {
  const { theme } = useTheme();
  const { cartesian } = createChartTheme(theme);

  const { data, factor } = useMemo(() => {
    const monthlyCounts = new Map();

    for (const event of events) {
      const month = String(event.date).slice(0, 7);
      monthlyCounts.set(month, (monthlyCounts.get(month) || 0) + 1);
    }

    const labels = [...monthlyCounts.keys()].sort((left, right) => left.localeCompare(right));
    const values = labels.map((month) => monthlyCounts.get(month) || 0);
    const scaled = scaleSeries(values);

    return {
      factor: scaled.factor,
      data: {
        labels,
        datasets: [
          {
            label: 'Events',
            data: scaled.values,
            borderColor: '#d4af37',
            backgroundColor: 'rgba(212,175,55,0.18)',
            tension: 0.35,
            fill: true,
            meta: { factor: scaled.factor },
          },
        ],
      },
    };
  }, [events]);

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
              return `${context.dataset.label || 'Events'}: ${rawValue}`;
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
            text: 'Month',
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
            callback: (value) => Number(value) / factor,
          },
        },
      },
    }),
    [cartesian, factor]
  );

  return (
    <ChartViewport className="h-[320px]">
      <Line data={data} options={options} />
    </ChartViewport>
  );
}

export default memo(EventsOverTimeChart);