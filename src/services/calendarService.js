import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function saveEvent(userId, eventData) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentEvents = userData.events || [];

      // Add the new event with a unique ID
      const newEvent = {
        ...eventData,
        id: Date.now().toString(), // Generate a unique ID
      };

      await updateDoc(userRef, {
        events: [...currentEvents, newEvent],
      });

      return { id: newEvent.id };
    }
  } catch (error) {
    console.error("Error saving event:", error);
    throw error;
  }
}

export async function getEvents(userId) {
  try {
    console.log("Fetching events for user:", userId);
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const events = userData.events || [];
      console.log(`Retrieved ${events.length} events for user ${userId}`);
      return events;
    }

    return [];
  } catch (error) {
    console.error("Error getting events:", error);
    throw error;
  }
}

export const removeEvent = async (userId, eventToRemove) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedEvents = userData.events.filter(
        (event) =>
          !(
            event.day === eventToRemove.day &&
            event.month === eventToRemove.month &&
            event.year === eventToRemove.year &&
            event.startTime === eventToRemove.startTime &&
            event.title === eventToRemove.title
          )
      );

      await updateDoc(userRef, {
        events: updatedEvents,
      });

      console.log("Event removed successfully");
    }
  } catch (error) {
    console.error("Error removing event:", error);
    throw error;
  }
};

export const updateEvent = async (userId, oldEvent, newEventData) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentEvents = userData.events || [];

      // Find and update the event
      const updatedEvents = currentEvents.map((event) => {
        if (
          event.day === oldEvent.day &&
          event.month === oldEvent.month &&
          event.year === oldEvent.year &&
          event.startTime === oldEvent.startTime &&
          event.title === oldEvent.title
        ) {
          return {
            ...event,
            ...newEventData,
          };
        }
        return event;
      });

      await updateDoc(userRef, {
        events: updatedEvents,
      });

      console.log("Event updated successfully");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// Helper function to check for event conflicts
export const checkEventConflict = (events, newEvent) => {
  const newEventDate = new Date(newEvent.year, newEvent.month, newEvent.day);
  const newEventStart = convertTimeToMinutes(newEvent.startTime);
  const newEventEnd = convertTimeToMinutes(newEvent.endTime);

  return events.some((existingEvent) => {
    // Check if it's the same day
    if (
      existingEvent.year === newEvent.year &&
      existingEvent.month === newEvent.month &&
      existingEvent.day === newEvent.day
    ) {
      const existingStart = convertTimeToMinutes(existingEvent.startTime);
      const existingEnd = convertTimeToMinutes(existingEvent.endTime);

      // Check for time overlap
      return newEventStart < existingEnd && newEventEnd > existingStart;
    }
    return false;
  });
};

// Helper function to convert time string to minutes
const convertTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};
