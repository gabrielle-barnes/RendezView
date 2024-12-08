import React, { useState } from "react"
import "./Calendar.css"
import CalendarHeader from "./CalendarHeader"
import CalendarPopup from "./CalendarPopup"
import ActiveEvents from "./ActiveEvents"

export default function Calendar() {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [eventTitle, setEventTitle] = useState("")
  const [eventText, setEventText] = useState("")
  const [eventStartTime, setEventStartTime] = useState("")
  const [eventEndTime, setEventEndTime] = useState("")
  const [events, setEvents] = useState([])

  const handleEventTitleChange = (e) => setEventTitle(e.target.value)
  const handleEventTextChange = (e) => setEventText(e.target.value)
  const handleEventStartTimeChange = (e) => setEventStartTime(e.target.value)
  const handleEventEndTimeChange = (e) => setEventEndTime(e.target.value)

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const closePopup = () => {
    setIsPopupOpen(false)
    setEventTitle("")
    setEventText("")
    setEventStartTime("")
    setEventEndTime("")
  }
  
  const handleMonthChange = (increment) => {
    setMonth((prev) => {
      let newMonth = prev + increment
      if (newMonth > 11) {
        newMonth = 0
        setYear((prevYear) => prevYear + 1)
      } else if (newMonth < 0) {
        newMonth = 11
        setYear((prevYear) => prevYear - 1)
      }
      return newMonth
    })
  }

  const addEventToState = (newEvent) => {
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, newEvent]
      updatedEvents.sort((a, b) => {
        const dateA = new Date(a.year, a.month, a.day)
        const dateB = new Date(b.year, b.month, b.day)
        return dateA - dateB
      })
      return updatedEvents
    })
  }

  const addEventToState = (newEvent) => {
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, newEvent];
      updatedEvents.sort((a, b) => {
        const dateA = new Date(a.year, a.month, a.day);
        const dateB = new Date(b.year, b.month, b.day);
        return dateA - dateB;
      });
      return updatedEvents;
    });
  };

  const openPopup = (day) => {
    setSelectedDay(day)
    setIsPopupOpen(true)
  }

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
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
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
              className="day"
              role="gridcell"
              aria-label={i + 1}
              onClick={() => openPopup(i + 1)}
            ></div>
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
        onEventTitle={handleEventTitleChange}
        onEventText={handleEventTextChange}
        onEventStartTime={handleEventStartTimeChange}
        onEventEndTime={handleEventEndTimeChange}
        onClose={closePopup}
        onEventSaved={addEventToState}
      />
      <ActiveEvents onEventChange={(events) => setEvents(events)} />
    </section>
  )
}