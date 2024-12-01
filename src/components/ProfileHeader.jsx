import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import fetchRandomArt from "../services/fetchRandomArt";
import { useAuthentication, updateProfilePhoto } from "../services/authService";
import { db } from "../firebaseConfig";
import "./ProfileHeader.css";

export default function ProfileHeader() {
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150");
  const user = useAuthentication();

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          
          if (userData.profilePhoto) {
            setProfileImage(userData.profilePhoto);
          }
        }
      }
    };
    fetchProfilePhoto();
  }, [user]);

  const handleFetchRandomArt = async () => {
    const randomArt = await fetchRandomArt();
    if (randomArt) {
      setProfileImage(randomArt);

      if (user) {
        await updateProfilePhoto(user, randomArt);
      }
    }
  };

  return (
    <header className="profile-header">
      <section className="user-info-container">
        <section className="user-identity-container">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-image"
          />
          <h2 className="profile-name">{user ? user.displayName : "John Doe"}</h2>
        </section>
        <button onClick={handleFetchRandomArt} className="random-art-button">
          Randomize Picture
        </button>
        <section className="user-friends-container">
          <p>count</p>
          <p>Friends</p>
        </section>
        <section className="user-enemies-container">
          <p>count</p>
          <p>Enemies</p>
        </section>
      </section>
      <section className="user-bio-container">
        <p className="profile-bio">
          this is the user bio. It can be a few lines long.
        </p>
      </section>
    </header>
  );
}