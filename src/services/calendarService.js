import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"
import { db } from "../firebaseConfig"

const eventCache = new Map()

export async function getEvents(userId) {
  if (eventCache.has(userId)) {
    return eventCache.get(userId)
  }

  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      const events = userData.events || []
      eventCache.set(userId, events)
      return events
    }
    return []
  } catch (error) {
    console.error("Error getting events:", error)
    throw error
  }
}

export function clearEventCache(userId) {
  if (userId) {
    eventCache.delete(userId)
  } else {
    eventCache.clear()
  }
}

export async function addEvent(userId, event) {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      events: arrayUnion(event),
    })
    clearEventCache(userId)
    return true
  } catch (error) {
    console.error("Error adding event:", error)
    throw error
  }
}

export async function removeEvent(userId, event) {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      events: arrayRemove(event),
    })
    clearEventCache(userId)
    return true
  } catch (error) {
    console.error("Error removing event:", error)
    throw error
  }
}

export const saveEvent = addEvent
