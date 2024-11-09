const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarHeader({ year, month, onMonthChange }) {
  return (
    <div className="calendar-header">
      <button
        onClick={() => onMonthChange(-1)}
        aria-label="Previous Month"
        className="month-button"
      >
        &#8249;
      </button>
      <div className="month-display" aria-live="polite">
        {monthNames[month]} {year}
      </div>
      <button
        onClick={() => onMonthChange(1)}
        aria-label="Next Month"
        className="month-button"
      >
        &#8250;
      </button>
    </div>
  );
}
