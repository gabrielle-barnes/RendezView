import { useState, useEffect } from "react";
import { getEvents, removeEvent } from "../services/calendarService";
import "./ActiveEvents.css";

export default function ActiveEvents({ onEventChange, userId }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (userId) {
        console.log("Fetching events for userId:", userId); // Debugging log
        const userEvents = await getEvents(userId); // Fetch events for the specified userId
        const sortedEvents = userEvents.sort((a, b) => {
          const dateA = new Date(a.year, a.month, a.day);
          const dateB = new Date(b.year, b.month, b.day);
          return dateA - dateB;
        });
        setEvents(sortedEvents);
        if (onEventChange) onEventChange(sortedEvents); // Notify parent component
      }
    };

    fetchEvents();
  }, [userId, onEventChange]);

  const handleRemoveEvent = async (eventId) => {
    if (userId) {
      try {
        await removeEvent(userId, eventId);
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
        console.log(`Event ${eventId} removed successfully.`);
      } catch (error) {
        console.error("Error removing event:", error.message);
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
  );
}
