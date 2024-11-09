import React, { useState } from "react";
import "./Calendar.css";
import CalendarHeader from "./CalendarHeader";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

export default function Calendar() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const handleMonthChange = (increment) => {
    setMonth((prev) => {
      let newMonth = prev + increment;
      if (newMonth > 11) {
        newMonth = 0;
        setYear((prevYear) => prevYear + 1);
      } else if (newMonth < 0) {
        newMonth = 11;
        setYear((prevYear) => prevYear - 1);
      }
      return newMonth;
    });
  };

  return (
    <div className="calendar" aria-label="Calendar">
      <CalendarHeader
        year={year}
        month={month}
        onMonthChange={handleMonthChange}
      />
      <div className="calendar-days" aria-hidden="true">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-name">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid" role="grid">
        {[...Array(firstDay)].map((_, i) => (
          <div
            key={`empty-${i}`}
            className="day empty"
            aria-hidden="true"
          ></div>
        ))}
        {[...Array(daysInMonth)].map((_, i) => (
          <div key={i} className="day" role="gridcell" aria-label={i + 1}></div>
        ))}
      </div>
    </div>
  );
}
