import React from 'react';

interface DataPoint {
  month: number;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  title: string;
  color: string;
  year: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, title, color, year }) => {
  const width = 500;
  const height = 200;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min and max values
  const values = data.map(d => d.value);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);
  const valueRange = maxValue - minValue || 1;

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 100000000) {
      return (amount / 100000000).toFixed(1) + '억';
    } else if (amount >= 10000) {
      return (amount / 10000).toFixed(0) + '만';
    }
    return amount.toLocaleString();
  };

  // Calculate points for the line
  const points = data.map((point, index) => {
    const x = padding.left + (index / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
    return { x, y, value: point.value, month: point.month };
  });

  // Create path string
  const pathString = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Month labels
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{title}</h3>
        <span style={{ fontSize: '12px', color: '#666' }}>{year}년</span>
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{
            width: '100%',
            height: 'auto',
          }}
          preserveAspectRatio="xMinYMid meet"
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => {
            const y = padding.top + (chartHeight / 4) * i;
            const value = maxValue - (valueRange / 4) * i;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                />
                <text
                  x={padding.left - 8}
                  y={y + 5}
                  textAnchor="end"
                  fontSize="12"
                  fill="#666"
                >
                  {formatCurrency(value)}
                </text>
              </g>
            );
          })}

          {/* X-axis */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* Y-axis */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* Line path */}
          <path
            d={pathString}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill={color}
                stroke="#fff"
                strokeWidth="2"
              />
              {/* Month labels */}
              <text
                x={point.x}
                y={height - padding.bottom + 25}
                textAnchor="middle"
                fontSize="12"
                fill="#666"
              >
                {months[point.month - 1]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default LineChart;
