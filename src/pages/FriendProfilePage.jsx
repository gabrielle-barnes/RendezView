import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { fetchUserData } from "../services/friendService";
import { useAuthentication } from "../services/authService";
import Calendar from "../components/Calendar";
import "../components/ActiveEvents.css";

function FriendProfilePage() {
  const { friendId } = useParams();
  const [friendData, setFriendData] = useState(null);
  const [friendEvents, setFriendEvents] = useState([]);
  const [error, setError] = useState(null);
  const currentUser = useAuthentication();

  useEffect(() => {
    const loadFriendData = async () => {
      if (!friendId || !currentUser) return;

      if (friendId === currentUser.uid) {
        setError("redirect");
        return;
      }

      try {
        console.log("Fetching friend data for:", friendId);
        const data = await fetchUserData(friendId);

        if (!data.friends?.includes(currentUser.uid)) {
          setError("You must be friends with this user to view their calendar");
          return;
        }

        console.log("Friend data received:", data);
        const events = data.events || [];
        console.log("Friend events:", events);

        const eventsWithIds = events.map((event) => ({
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

        setFriendData(data);
        setFriendEvents(sortedEvents);
        setError(null);
      } catch (error) {
        console.error("Error loading friend's data:", error);
        setError("Unable to load calendar data. Please try again later.");
      }
    };

    loadFriendData();
  }, [friendId, currentUser]);

  if (error === "redirect") {
    return <Navigate to="/profile" replace />;
  }

  if (error && error !== "redirect") {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!friendData) {
    return <div>Loading friend's profile...</div>;
  }

  return (
    <section className="active-events-section">
      <h2 className="active-events-title">
        {friendData.displayName}'s Calendar
      </h2>
      {friendEvents.length > 0 ? (
        <>
          {Object.entries(groupEventsByDate(friendEvents)).map(
            ([date, dateEvents]) => (
              <div key={date} className="date-group">
                <h3 className="date-title">{date}</h3>
                <ul className="events-list">
                  {dateEvents.map((event) => (
                    <li key={event.id} className="event-item">
                      <section className="event-header">
                        <h3 className="event-title">{event.title}</h3>
                        <p className="event-time">
                          <strong>Time:</strong> {event.startTime} -{" "}
                          {event.endTime}
                        </p>
                      </section>
                      {event.description && (
                        <p className="event-description">
                          <strong>Description:</strong> {event.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
          <Calendar events={friendEvents} />
        </>
      ) : (
        <p className="no-events-message">No events to display</p>
      )}
    </section>
  );
}

function groupEventsByDate(events) {
  return events.reduce((groups, event) => {
    const date = `${event.month + 1}/${event.day}/${event.year}`;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});
}

export default FriendProfilePage;
