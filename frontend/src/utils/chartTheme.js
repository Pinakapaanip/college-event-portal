export function createChartTheme(theme = 'dark') {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f8f9fa' : '#0b1f4d';
  const gridColor = isDark ? 'rgba(212, 175, 55, 0.14)' : 'rgba(19, 43, 107, 0.10)';
  const tooltipBackground = isDark ? '#0b1f4d' : '#f8f9fa';

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: tooltipBackground,
        titleColor: isDark ? '#f8f9fa' : '#0b1f4d',
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
      },
    },
  };

  return {
    cartesian: {
      ...baseOptions,
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
      },
    },
    radial: {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            usePointStyle: true,
            boxWidth: 10,
          },
        },
      },
    },
  };
}