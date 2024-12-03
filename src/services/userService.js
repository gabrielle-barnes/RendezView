import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  setDoc,
  collection,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const fetchAllUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const sendFriendRequest = async (targetUserId, currentUserId) => {
  try {
    if (!targetUserId || !currentUserId) {
      throw new Error("Invalid user IDs");
    }

    const userRef = doc(db, "users", targetUserId);

    await updateDoc(userRef, {
      friendRequests: arrayUnion(currentUserId),
    });

    console.log("Friend request sent successfully!");
  } catch (error) {
    console.error("Error sending friend request:", error.message);
    throw error;
  }
};

export const fetchUserBio = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().bio || "";
    }
    return "";
  } catch (error) {
    console.error("Error fetching user bio:", error.message);
    throw error;
  }
};

export const saveUserBio = async (userId, bio) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { bio }, { merge: true });
  } catch (error) {
    console.error("Error saving user bio:", error.message);
    throw error;
  }
};
