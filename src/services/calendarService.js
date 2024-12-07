import {
  doc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Save an event to Firestore
export async function saveEvent(userId, eventData) {
  const userRef = doc(db, "users", userId);
  const calendarRef = collection(userRef, "calendar");

  const docRef = await addDoc(calendarRef, eventData);
  return { id: docRef.id };
}

// Get all events for a user
export async function getEvents(userId) {
  const userRef = doc(db, "users", userId);
  const calendarRef = collection(userRef, "calendar");
  const calendarSnapshot = await getDocs(calendarRef);

  const events = calendarSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return events;
}

// Remove an event by ID
export const removeEvent = async (userId, eventId) => {
  const eventRef = doc(db, "users", userId, "calendar", eventId);
  await deleteDoc(eventRef);
};
