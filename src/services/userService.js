import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
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
