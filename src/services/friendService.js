import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const fetchUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return {};
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
};

export const sendFriendRequest = async (userId, recipientId) => {
  try {
    const recipientRef = doc(db, "users", recipientId);
    await updateDoc(recipientRef, {
      friendRequests: arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error sending friend request:", error.message);
    throw error;
  }
};

export const acceptFriendRequest = async (userId, requesterId) => {
  try {
    const userRef = doc(db, "users", userId);
    const requesterRef = doc(db, "users", requesterId);

    await updateDoc(userRef, {
      friendRequests: arrayRemove(requesterId),
      friends: arrayUnion(requesterId),
    });

    await updateDoc(requesterRef, {
      friends: arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error accepting friend request:", error.message);
    throw error;
  }
};

export const denyFriendRequest = async (userId, requesterId) => {
  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      friendRequests: arrayRemove(requesterId),
    });
  } catch (error) {
    console.error("Error denying friend request:", error.message);
    throw error;
  }
};

export const removeFriend = async (userId, friendId) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      friends: arrayRemove(friendId),
    });

    const friendRef = doc(db, "users", friendId);
    await updateDoc(friendRef, {
      friends: arrayRemove(userId),
    });
  } catch (error) {
    console.error("Error removing friend:", error.message);
    throw error;
  }
};

export const getRelationshipStatus = async (userId, otherUserId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData.friends?.includes(otherUserId)) return "friends";
      if (userData.friendRequests?.includes(otherUserId)) return "requested";
      return "none";
    }
    return "none";
  } catch (error) {
    console.error("Error checking relationship status:", error.message);
    throw error;
  }
};
