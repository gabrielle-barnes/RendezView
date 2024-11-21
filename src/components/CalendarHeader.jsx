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

export default function CalendarHeader({
  year,
  month,
  onMonthChange,
  onClose,
}) {
  return (
    <div className="calendar-header">
      <button
        onClick={() => {
          onMonthChange(-1);
          onClose();
        }}
        aria-label="Previous Month"
        className="month-button"
      >
        &#8249; {/* This is the left arrow */}
      </button>
      <div className="month-display" aria-live="polite">
        {monthNames[month]} {year}
      </div>
      <button
        onClick={() => {
          onMonthChange(1);
          onClose();
        }}
        aria-label="Next Month"
        className="month-button"
        onChange={onClose}
      >
        &#8250; {/* This is the right arrow */}
      </button>
    </div>
  );
}
