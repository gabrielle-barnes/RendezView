import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";

export async function checkAndCreateUser(user) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      bio: "",
      displayName: user.displayName || "",
      emails: user.email || "",
      enemies: [],
      friendRequests: [],
      friends: [],
      enemies: [],
      profilePhoto: "",
    });
  }
}

export async function login() {
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  const user = result.user;

  await checkAndCreateUser(user);
  return user;
}

export function logout() {
  return signOut(auth);
}

export function loggedInUserDisplayName() {
  return auth.currentUser.displayName;
}

export function useAuthentication() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        checkAndCreateUser(user).then(() => {
          setUser(user);
        });
      } else {
        setUser(null);
      }
    });
  }, []);
  return user;
}

export async function updateProfilePhoto(user, photoURL) {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, { profilePhoto: photoURL }, { merge: true });
}
