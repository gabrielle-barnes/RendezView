import { doc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function saveEvent(userId, eventData) {
  const userRef = doc(db, "users", userId);
  const calendarRef = collection(userRef, "calendar");

  await addDoc(calendarRef, eventData);
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
