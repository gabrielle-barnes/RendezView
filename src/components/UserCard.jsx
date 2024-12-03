import { useState, useEffect } from "react";
import "./UserCard.css";
import { getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function UserCard({ user, currentUser }) {
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (!user?.id || !currentUser?.uid) return;

      try {
        const userRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsRequested(userData.friendRequests?.includes(currentUser.uid));
        }
      } catch (error) {
        console.error("Error fetching friendRequests:", error.message);
      }
    };

    fetchFriendRequests();
  }, [user, currentUser]);

  const handleRequest = async () => {
    if (isRequested) return;

    try {
      const userRef = doc(db, "users", user.id);

      await updateDoc(userRef, {
        friendRequests: arrayUnion(currentUser.uid),
      });

      setIsRequested(true);
    } catch (error) {
      console.error("Error sending friend request:", error.message);
    }
  };

  return (
    <div className="user-card">
      <img
        src={user.profilePhoto || "https://via.placeholder.com/50"}
        alt={`${user.displayName}'s profile`}
        className="user-card-image"
      />
      <p className="user-card-name">{user.displayName || "Unknown User"}</p>
      <button
        className={`request-button ${isRequested ? "requested" : ""}`}
        onClick={handleRequest}
        disabled={isRequested}
      >
        {isRequested ? "Requested" : "Request"}
      </button>
    </div>
  );
}
