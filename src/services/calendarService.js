import {
  doc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function saveEvent(userId, eventData) {
  const userRef = doc(db, "users", userId);
  const calendarRef = collection(userRef, "calendar");

  const docRef = await addDoc(calendarRef, eventData);
  return { id: docRef.id };
}

export async function getEvents(userId) {
  const userRef = doc(db, "users", userId);
  const calendarRef = collection(userRef, "calendar");
  const calendarSnapshot = await getDocs(calendarRef);

  const events = calendarSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return events;
}

export const removeEvent = async (userId, eventId) => {
  const eventRef = doc(db, "users", userId, "calendar", eventId);
  await deleteDoc(eventRef);
};
