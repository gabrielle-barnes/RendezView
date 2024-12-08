import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserData } from "../services/friendService"; // Import existing function
import { getEvents } from "../services/calendarService"; // Import `getEvents` function
import Calendar from "../components/Calendar";

function FriendProfilePage() {
  const { friendId } = useParams(); // Extract friendId from URL
  const [friendData, setFriendData] = useState(null); // State for friend's profile
  const [friendEvents, setFriendEvents] = useState([]); // State for friend's events

  useEffect(() => {
    // Fetch friend's profile data
    const fetchFriendData = async () => {
      try {
        const data = await fetchUserData(friendId); // Fetch profile using friendId
        setFriendData(data);
      } catch (error) {
        console.error("Error fetching friend's data:", error.message);
      }
    };

    // Fetch friend's events from Firestore
    const fetchFriendEvents = async () => {
      try {
        console.log("Fetching events for friendId:", friendId); // Debug log
        const events = await getEvents(friendId); // Fetch events using friendId
        console.log("Fetched friend's events:", events); // Debug log
        setFriendEvents(events); // Update state with fetched events
      } catch (error) {
        console.error("Error fetching friend's events:", error.message);
      }
    };

    // Trigger both profile and event fetching
    fetchFriendData();
    fetchFriendEvents();
  }, [friendId]);

  if (!friendData) {
    return <p>Loading friend's data...</p>; // Show a loading message while fetching
  }

  return (
    <div>
      <h1>{friendData.displayName}'s Calendar</h1> {/* Friend's display name */}
      <Calendar events={friendEvents} /> {/* Pass fetched events to Calendar */}
    </div>
  );
}

export default FriendProfilePage;
