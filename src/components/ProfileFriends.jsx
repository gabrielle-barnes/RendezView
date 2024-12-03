import { useState, useEffect } from "react";
import {
  fetchUserData,
  acceptFriendRequest,
  denyFriendRequest,
  removeFriend,
} from "../services/friendService";
import { useAuthentication } from "../services/authService";
import "./ProfileFriends.css";

export default function ProfileFriends() {
  const user = useAuthentication();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      if (user) {
        try {
          const userData = await fetchUserData(user.uid);

          const friendDetails = await Promise.all(
            (userData.friends || []).map(async (friendId) => {
              const friendData = await fetchUserData(friendId);
              return { id: friendId, ...friendData };
            })
          );

          const requestDetails = await Promise.all(
            (userData.friendRequests || []).map(async (requestId) => {
              const requestData = await fetchUserData(requestId);
              return { id: requestId, ...requestData };
            })
          );

          setFriends(friendDetails);
          setFriendRequests(requestDetails);
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchFriendsAndRequests();
  }, [user]);

  const handleAccept = async (requesterId) => {
    if (user) {
      try {
        await acceptFriendRequest(user.uid, requesterId);
        setFriendRequests((prev) =>
          prev.filter((request) => request.id !== requesterId)
        );
        const acceptedFriend = friendRequests.find(
          (request) => request.id === requesterId
        );
        setFriends((prev) => [...prev, acceptedFriend]);
      } catch (error) {
        console.error("Error accepting friend request:", error.message);
      }
    }
  };

  const handleDeny = async (requesterId) => {
    if (user) {
      try {
        await denyFriendRequest(user.uid, requesterId);
        setFriendRequests((prev) =>
          prev.filter((request) => request.id !== requesterId)
        );
      } catch (error) {
        console.error("Error denying friend request:", error.message);
      }
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (user) {
      try {
        await removeFriend(user.uid, friendId);
        setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
      } catch (error) {
        console.error("Error removing friend:", error.message);
      }
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = friendRequests.filter((request) =>
    request.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="profile-friends">
      <input
        type="text"
        placeholder="Search Friends or Requests..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      <h3>Friends</h3>
      <ul className="friends-list">
        {filteredFriends.map((friend) => (
          <li key={friend.id} className="friend-item">
            <img
              src={friend.profilePhoto || "https://via.placeholder.com/50"}
              alt={`${friend.displayName}'s profile`}
              className="friend-image"
            />
            <span className="friend-name">{friend.displayName}</span>
            <button
              className="remove-button"
              onClick={() => handleRemoveFriend(friend.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h3>Friend Requests</h3>
      <ul className="friend-requests-list">
        {filteredRequests.map((request) => (
          <li key={request.id} className="request-item">
            <img
              src={request.profilePhoto || "https://via.placeholder.com/50"}
              alt={`${request.displayName}'s profile`}
              className="friend-image"
            />
            <span className="friend-name">{request.displayName}</span>
            <button
              className="accept-button"
              onClick={() => handleAccept(request.id)}
            >
              Accept
            </button>
            <button
              className="deny-button"
              onClick={() => handleDeny(request.id)}
            >
              Deny
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
