import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function FriendRequestComponent() {
  const [userId, setUserId] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendId, setFriendId] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        getFriendRequests(user.uid);
        getFriends(user.uid);
      } else {
        setUserId(null);
        setFriendRequests([]);
        setFriends([]);
      }
    });

    return () => unsubscribe();
  }, []);

  async function getFriendRequests(uid) {
    try {
      const userDoc = doc(db, 'users', uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        setFriendRequests(userSnap.data().friendRequests || []);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  }

  async function sendFriendRequest() {
    try {
      const friendDoc = doc(db, 'users', friendId);
      await updateDoc(friendDoc, { friendRequests: arrayUnion(userId) });
      setFriendId(''); // Reset input after sending
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  }

  async function acceptFriendRequest(requestId) {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, {
        friendRequests: arrayRemove(requestId),
        friends: arrayUnion(requestId),
      });

      const friendDoc = doc(db, 'users', requestId);
      await updateDoc(friendDoc, { friends: arrayUnion(userId) });

      setFriendRequests((prev) => prev.filter((id) => id !== requestId));
      setFriends((prev) => [...prev, requestId]);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  }

  async function rejectFriendRequest(requestId) {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, { friendRequests: arrayRemove(requestId) });
      setFriendRequests((prev) => prev.filter((id) => id !== requestId));
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  }

  async function getFriends(uid) {
    try {
      const userDoc = doc(db, 'users', uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        setFriends(userSnap.data().friends || []);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }
}

export default FriendRequestComponent;
