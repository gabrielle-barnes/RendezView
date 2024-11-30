import { doc, collection, getDocs, setDoc, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function saveEvent(userId, eventData) {
  const userRef = doc(db, "users", userId);
  const calendarRef = collection(userRef, "calendar");

  await addDoc(calendarRef, eventData);
}
