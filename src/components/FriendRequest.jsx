import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

function FriendRequestComponent() {
  const auth = getAuth();
  const db = getFirestore();
  const [userId, setUserId] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendId, setFriendId] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
        listenForFriendRequests(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const listenForFriendRequests = (uid) => {
    const userDocRef = doc(db, 'users', uid);
    return onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setFriendRequests(docSnapshot.data().friendRequests || []);
      }
    }, (error) => {
      console.error('Error listening for friend requests:', error);
    });
  };

  const sendFriendRequest = async () => {
    if (!friendId || friendId === userId) {
      console.error('Invalid friend ID');
      return;
    }
    
    try {
      const friendDocRef = doc(db, 'users', friendId);
      const friendDoc = await getDoc(friendDocRef);

      if (friendDoc.exists()) {
        await updateDoc(friendDocRef, {
          friendRequests: arrayUnion(userId)
        });
      } else {
        console.error('Friend ID not found');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        friendRequests: arrayRemove(requestId),
        friends: arrayUnion(requestId)
      });

      await updateDoc(doc(db, 'users', requestId), {
        friends: arrayUnion(userId)
      });
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        friendRequests: arrayRemove(requestId)
      });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <div>
      {userId && (
        <div>
          <h2>Friend Requests</h2>
          <ul>
            {friendRequests.map(requestId => (
              <li key={requestId}>
                {requestId}
                <button onClick={() => acceptFriendRequest(requestId)}>Accept</button>
                <button onClick={() => rejectFriendRequest(requestId)}>Reject</button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            placeholder="Enter friend ID"
          />
          <button onClick={sendFriendRequest}>Send Friend Request</button>
        </div>
      )}
    </div>
  );
}

export default FriendRequestComponent;