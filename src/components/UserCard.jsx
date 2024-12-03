import { useState, useEffect } from "react";
import {
  sendFriendRequest,
  acceptFriendRequest,
  denyFriendRequest,
  getRelationshipStatus,
} from "../services/friendService";
import "./UserCard.css";

export default function UserCard({ user, currentUser }) {
  const [relationshipStatus, setRelationshipStatus] = useState("none");

  useEffect(() => {
    const fetchRelationshipStatus = async () => {
      if (user?.id && currentUser?.uid) {
        const status = await getRelationshipStatus(currentUser.uid, user.id);
        setRelationshipStatus(status);
      }
    };
    fetchRelationshipStatus();
  }, [user, currentUser]);

  const handleRequest = async () => {
    if (relationshipStatus === "none") {
      await sendFriendRequest(currentUser.uid, user.id);
      setRelationshipStatus("requested");
    }
  };

  const handleAccept = async () => {
    await acceptFriendRequest(currentUser.uid, user.id);
    setRelationshipStatus("friends");
  };

  const handleDeny = async () => {
    await denyFriendRequest(currentUser.uid, user.id);
    setRelationshipStatus("none");
  };

  const isRecipient =
    relationshipStatus === "requested" && user.id === currentUser.uid;

  return (
    <div className="user-card">
      <img
        src={user.profilePhoto || "https://via.placeholder.com/50"}
        alt={`${user.displayName}'s profile`}
        className="user-card-image"
      />
      <p className="user-card-name">{user.displayName || "Unknown User"}</p>

      {/* Dynamic Button Rendering */}
      {relationshipStatus === "none" && (
        <button className="request-button" onClick={handleRequest}>
          Request
        </button>
      )}
      {relationshipStatus === "requested" && isRecipient && (
        <>
          <button className="accept-button" onClick={handleAccept}>
            Accept
          </button>
          <button className="deny-button" onClick={handleDeny}>
            Deny
          </button>
        </>
      )}
      {relationshipStatus === "requested" && !isRecipient && (
        <button className="requested-button" disabled>
          Requested
        </button>
      )}
      {relationshipStatus === "friends" && (
        <button className="friends-button" disabled>
          Friends
        </button>
      )}
    </div>
  );
}
