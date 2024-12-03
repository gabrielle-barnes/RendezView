import React, { useState, useEffect } from "react";
import {
  initializeGoogleApi,
  fetchEvents,
  createEvent,
} from "../services/googleCalService";
import "./Calendar.css";
import CalendarHeader from "./CalendarHeader";
import CalendarPopup from "./CalendarPopup";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

export default function Calendar() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventText, setEventText] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [events, setEvents] = useState([]); // Store fetched events

  // Initialize Google API on component mount
  useEffect(() => {
    initializeGoogleApi();
    refreshEvents();
  }, [year, month]);

  // Fetch events from Google Calendar
  const refreshEvents = async () => {
    const fetchedEvents = await fetchEvents();
    setEvents(fetchedEvents);
  };

  // Add a new event
  const handleAddEvent = async () => {
    if (!eventTitle || !eventStartTime || !eventEndTime) {
      alert("Please fill out all event details.");
      return;
    }

    const eventDetails = {
      summary: eventTitle,
      description: eventText,
      start: {
        dateTime: `${year}-${String(month + 1).padStart(2, "0")}-${String(
          selectedDay
        ).padStart(2, "0")}T${eventStartTime}:00`,
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: `${year}-${String(month + 1).padStart(2, "0")}-${String(
          selectedDay
        ).padStart(2, "0")}T${eventEndTime}:00`,
        timeZone: "America/Los_Angeles",
      },
    };

    const newEvent = await createEvent(eventDetails);
    if (newEvent) {
      alert(`Event "${eventTitle}" created successfully.`);
      refreshEvents();
      closePopup();
    } else {
      alert("Failed to create event.");
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEventTitle("");
    setEventText("");
    setEventStartTime("");
    setEventEndTime("");
  };

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

  const openPopup = (day) => {
    setSelectedDay(day);
    setIsPopupOpen(true);
  };

  const isDayWithEvent = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return events.some((event) => event.start.dateTime.startsWith(dateStr));
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  return (
    <section className="calendar-section" aria-label="Calendar">
      <section className="calendar">
        <CalendarHeader
          year={year}
          month={month}
          onMonthChange={handleMonthChange}
          onClose={closePopup}
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
            <div
              key={i}
              className={`day ${isDayWithEvent(i + 1) ? "highlight" : ""}`}
              role="gridcell"
              aria-label={`Day ${i + 1}`}
              onClick={() => openPopup(i + 1)}
            >
              <span className="day-number">{i + 1}</span>
              {isDayWithEvent(i + 1) && <div className="event-marker"></div>}
            </div>
          ))}
        </div>
      </section>

      <CalendarPopup
        isOpen={isPopupOpen}
        selectedDay={selectedDay}
        eventTitle={eventTitle}
        eventText={eventText}
        eventStartTime={eventStartTime}
        eventEndTime={eventEndTime}
        onEventTitle={(e) => setEventTitle(e.target.value)}
        onEventText={(e) => setEventText(e.target.value)}
        onEventStartTime={(e) => setEventStartTime(e.target.value)}
        onEventEndTime={(e) => setEventEndTime(e.target.value)}
        onAddEvent={handleAddEvent}
        onClose={closePopup}
      />
    </section>
  );
}
