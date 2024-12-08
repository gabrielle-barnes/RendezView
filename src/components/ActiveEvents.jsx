import { useState, useEffect } from "react"
import { getEvents, removeEvent } from "../services/calendarService"
import { useAuthentication } from "../services/authService"
import "./ActiveEvents.css"

export default function ActiveEvents({ onEventChange }) {
  const [events, setEvents] = useState([])
  const user = useAuthentication()

  useEffect(() => {
    const fetchEvents = async () => {
      if (user) {
        const userEvents = await getEvents(user.uid)
        const sortedEvents = userEvents.sort((a, b) => {
          const dateA = new Date(a.year, a.month, a.day)
          const dateB = new Date(b.year, b.month, b.day)
          return dateA - dateB
        })
        setEvents(sortedEvents)
        if (onEventChange) onEventChange(sortedEvents)
      }
    }

    fetchEvents()
  }, [user, onEventChange])

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

  const handleRemoveEvent = async (eventId) => {
    if (user) {
      try {
        await removeEvent(user.uid, eventId)
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        )
        console.log(`Event ${eventId} removed successfully.`)
      } catch (error) {
        console.error("Error removing event:", error.message)
      }
    }
  }

  const groupedEvents = events.reduce((groups, event) => {
    const date = `${event.month + 1}/${event.day}/${event.year}`
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(event)
    return groups
  }, {})

  return (
    <section className="active-events-section">
      <h2 className="active-events-title">Your Upcoming Events</h2>
      {Object.keys(groupedEvents).length === 0 && (
        <p className="no-events-message">
          No events to display. Plan your day!
        </p>
      )}
      {Object.entries(groupedEvents).map(([date, events]) => (
        <div key={date} className="date-group">
          <h3 className="date-title">{date}</h3>
          <ul className="events-list">
            {events.map((event) => (
              <li key={event.id} className="event-item">
                <section className="event-header">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-time">
                    <strong>Time:</strong> {event.startTime} - {event.endTime}
                  </p>
                </section>
                <p className="event-description">
                  <strong>Description:</strong> {event.description}
                </p>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveEvent(event.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )

}
