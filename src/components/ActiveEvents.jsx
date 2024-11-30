import { useState, useEffect } from "react";
import { getEvents } from "../services/calendarService";
import { useAuthentication } from "../services/authService";
import "./ActiveEvents.css";

export default function ActiveEvents() {
    const [events, setEvents] = useState([]);
    const user = useAuthentication();

    useEffect(() => {
        if (user) {
            (async () => {
                const userEvents = await getEvents(user.uid);
                setEvents(userEvents);
            })();
        }
    }, [user]);

    return (
        <section className="active-events">
            <h2>Your Events</h2>
            {events.length === 0 && <p>No events to display</p>}
            <ul className="events-list">
                {events.map((event, index) => (
                    <li key={index} className="event-item">
                        <h3>{event.title}</h3>
                        <p><strong>Description:</strong> {event.description} </p>
                        <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
                        <p><strong>Date:</strong> {event.month + 1}/{event.day}/{event.year}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}