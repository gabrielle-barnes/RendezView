import { useState, useEffect, useCallback } from "react";
import { getEvents, removeEvent } from "../services/calendarService";
import { useAuthentication } from "../services/authService";
import "./ActiveEvents.css";

export default function ActiveEvents({ onEventChange, events: parentEvents }) {
  const [events, setEvents] = useState([]);
  const user = useAuthentication();

  useEffect(() => {
    const fetchEvents = async () => {
      if (user) {
        try {
          const userEvents = await getEvents(user.uid);
          const eventsWithIds = userEvents.map((event) => ({
            ...event,
            id:
              event.id ||
              `${event.day}-${event.month}-${event.year}-${event.startTime}`.replace(
                /\s/g,
                ""
              ),
          }));

          const sortedEvents = eventsWithIds.sort((a, b) => {
            const dateA = new Date(a.year, a.month, a.day);
            const dateB = new Date(b.year, b.month, b.day);
            return dateA - dateB;
          });

          setEvents(sortedEvents);
          if (onEventChange) onEventChange(sortedEvents);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      }
    };

    fetchEvents();
  }, [user]);

  useEffect(() => {
    if (parentEvents) {
      setEvents(parentEvents);
    }
  }, [parentEvents]);

  const handleRemoveEvent = async (eventToRemove) => {
    if (user) {
      try {
        await removeEvent(user.uid, eventToRemove);
        const updatedEvents = events.filter(
          (event) =>
            !(
              event.day === eventToRemove.day &&
              event.month === eventToRemove.month &&
              event.year === eventToRemove.year &&
              event.startTime === eventToRemove.startTime &&
              event.title === eventToRemove.title
            )
        );
        setEvents(updatedEvents);
        if (onEventChange) onEventChange(updatedEvents);
      } catch (error) {
        console.error("Error removing event:", error);
      }
    }
  };

  const groupedEvents = events.reduce((groups, event) => {
    const date = `${event.month + 1}/${event.day}/${event.year}`;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  return (
    <section className="active-events-section">
      <h2 className="active-events-title">Your Upcoming Events</h2>
      {Object.keys(groupedEvents).length === 0 ? (
        <p className="no-events-message">
          No events to display. Plan your day!
        </p>
      ) : (
        Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <div key={date} className="date-group">
            <h3 className="date-title">{date}</h3>
            <ul className="events-list">
              {dateEvents.map((event) => (
                <li key={event.id} className="event-item">
                  <section className="event-header">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-time">
                      <strong>Time:</strong> {event.startTime} - {event.endTime}
                    </p>
                  </section>
                  {event.description && (
                    <p className="event-description">
                      <strong>Description:</strong> {event.description}
                    </p>
                  )}
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveEvent(event)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
