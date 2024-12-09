import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  getDocs,
} from "firebase/firestore"
import { db } from "../firebaseConfig"

export const fetchUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      return userSnap.data()
    }
    return {}
  } catch (error) {
    console.error("Error fetching user data:", error.message)
    throw error
  }
}

export const fetchUserEvents = async (userId, friendIds = []) => {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()

      const eventsRef = collection(userRef, "calendar")
      const eventsSnapshot = await getDocs(eventsRef)

      const events = []
      eventsSnapshot.forEach((doc) => {
        const eventData = doc.data()

        if (
          userId === eventData.userId ||
          friendIds.includes(eventData.userId)
        ) {
          events.push({ id: doc.id, ...eventData })
        }
      })

      return events
    } else {
      console.warn(`User with ID ${userId} not found`)
      return []
    }
  } catch (error) {
    console.error("Error fetching user events:", error.message)
    throw error
  }
}
export const sendFriendRequest = async (currentUserId, targetUserId) => {
  try {
    if (!targetUserId || !currentUserId) {
      throw new Error("Invalid user IDs")
    }

    const userRef = doc(db, "users", targetUserId)

    await updateDoc(userRef, {
      friendRequests: arrayUnion(currentUserId),
    })
  } catch (error) {
    console.error("Error sending friend request:", error.message)
    throw error
  }
}

export const acceptFriendRequest = async (userId, requesterId) => {
  try {
    const userRef = doc(db, "users", userId)
    const requesterRef = doc(db, "users", requesterId)

    await updateDoc(userRef, {
      friendRequests: arrayRemove(requesterId),
      friends: arrayUnion(requesterId),
    })

    await updateDoc(requesterRef, {
      friends: arrayUnion(userId),
    })
  } catch (error) {
    console.error("Error accepting friend request:", error.message)
    throw error
  }
}

export const denyFriendRequest = async (userId, requesterId) => {
  try {
    const userRef = doc(db, "users", userId)

    await updateDoc(userRef, {
      friendRequests: arrayRemove(requesterId),
    })
  } catch (error) {
    console.error("Error denying friend request:", error.message)
    throw error
  }
}

export const removeFriend = async (userId, friendId) => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      friends: arrayRemove(friendId),
    })

    const friendRef = doc(db, "users", friendId)
    await updateDoc(friendRef, {
      friends: arrayRemove(userId),
    })
  } catch (error) {
    console.error("Error removing friend:", error.message)
    throw error
  }
}

export const getRelationshipStatus = async (userId, otherUserId) => {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()
      if (userData.friends?.includes(otherUserId)) return "friends"
      if (userData.friendRequests?.includes(otherUserId)) return "requested"
      return "none"
    }
    return "none"
  } catch (error) {
    console.error("Error checking relationship status:", error.message)
    throw error
  }
}

export const fetchAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, "users"))
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching all users:", error.message)
    throw error
  }
}

export const fetchUserBio = async (userId) => {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
      return userDoc.data().bio || ""
    }
    return ""
  } catch (error) {
    console.error("Error fetching user bio:", error.message)
    throw error
  }
}

export const saveUserBio = async (userId, bio) => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, { bio })
  } catch (error) {
    console.error("Error saving user bio:", error.message)
    throw error
  }
}
