import React from 'react';

interface MonthFilterProps {
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

const MonthFilter: React.FC<MonthFilterProps> = ({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const selectStyle: React.CSSProperties = {
    padding: '12px',
    paddingRight: '32px',
    borderRadius: 'var(--card-radius)',
    border: '1px solid #ddd',
    fontSize: 'var(--font-base)',
    minHeight: '44px',
    cursor: 'pointer',
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
        조회 기간
      </label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          style={{ ...selectStyle, width: '120px' }}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          style={{ ...selectStyle, width: '100px' }}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}월
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MonthFilter;
