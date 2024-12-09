import React from "react"
import { useAuthentication } from "../services/authService"
import { removeEvent } from "../services/calendarService"
import "./ActiveEvents.css"

export default function ActiveEvents({ events, onEventChange, readOnly }) {
  const normalizeEvent = (event) => ({
    ...event,
    title: String(event.title || "").trim(),
    description: String(event.description || "").trim(),
    startTime: String(event.startTime || "").trim(),
    endTime: String(event.endTime || "").trim(),
    day: Number(event.day),
    month: Number(event.month),
    year: Number(event.year),
  })

  const user = useAuthentication()
  const handleRemoveEvent = async (eventToRemove) => {
    try {
      const userId = user.uid
      const normalizedEvent = normalizeEvent(eventToRemove)
      await removeEvent(userId, normalizedEvent)

      const updatedEvents = events.filter(
        (event) =>
          !(
            event.day === eventToRemove.day &&
            event.month === eventToRemove.month &&
            event.year === eventToRemove.year &&
            event.title === eventToRemove.title &&
            event.description === eventToRemove.description &&
            event.startTime === eventToRemove.startTime &&
            event.endTime === eventToRemove.endTime
          )
      )
      onEventChange(updatedEvents)
    } catch (error) {
      console.error("Error removing event:", error)
    }
  }

  const sortedEvents = [...events].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    if (a.month !== b.month) return a.month - b.month
    return a.day - b.day
  })

  const groupedEvents = sortedEvents.reduce((groups, event) => {
    const date = `${event.month + 1}/${event.day}/${event.year}`
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(event)
    return groups
  }, {})

  if (events.length === 0) {
    return (
      <div className="active-events-section">
        <h2>Your Upcoming Events</h2>
        <p className="no-events-message">
          No events to display. Plan your day!
        </p>
      </div>
    )
  }

  return (
    <div className="active-events-section">
      <h2>Your Upcoming Events</h2>
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <div key={date} className="date-group">
          <h3 className="date-title">{date}</h3>
          <ul className="events-list">
            {dateEvents.map((event, index) => (
              <li key={`${date}-${index}`} className="event-item">
                <div className="event-header">
                  <h4 className="event-title">{event.title}</h4>
                  <p className="event-time">
                    Time: {event.startTime} - {event.endTime}
                  </p>
                </div>
                <p className="event-description">
                  Description: {event.description}
                </p>
                {!readOnly && (
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveEvent(event)}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
