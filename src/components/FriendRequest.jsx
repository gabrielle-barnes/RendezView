import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function FriendRequestComponent() {
  // get all users, add request, service: add request, get request, get my friends

}

export default FriendRequestComponent;
