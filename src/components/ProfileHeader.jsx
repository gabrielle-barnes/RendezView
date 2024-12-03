import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuthentication, updateProfilePhoto } from "../services/authService";
import fetchRandomArt from "../services/fetchRandomArt";
import BioComponent from "./BioComponent";
import "./ProfileHeader.css";

export default function ProfileHeader() {
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/150"
  );
  const [friendCount, setFriendCount] = useState(0);
  const [enemyCount, setEnemyCount] = useState(0);
  const [bio, setBio] = useState("");
  const user = useAuthentication();

  const fetchProfileData = async () => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setProfileImage(userData.profilePhoto || profileImage);
          setFriendCount((userData.friends || []).length);
          setEnemyCount((userData.enemies || []).length || 0);
          setBio(userData.bio || "");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const handleFetchRandomArt = async () => {
    const randomArt = await fetchRandomArt();
    if (randomArt) {
      setProfileImage(randomArt);
      if (user) {
        await updateProfilePhoto(user, randomArt);
        fetchProfileData();
      }
    }
  };

  const handleBioUpdate = (updatedBio) => {
    setBio(updatedBio);
  };

  return (
    <header className="profile-header">
      <div className="profile-top-row">
        <div className="profile-identity-container">
          <img src={profileImage} alt="Profile" className="profile-image" />
          <h2 className="profile-name">{user?.displayName || "User Name"}</h2>
          <button onClick={handleFetchRandomArt} className="random-art-button">
            Randomize Picture
          </button>
        </div>
        <div className="friends-enemies-container">
          <div className="count-container">
            <p>{friendCount}</p>
            <p>Friends</p>
          </div>
          <div className="count-container">
            <p>{enemyCount}</p>
            <p>Enemies</p>
          </div>
        </div>
      </div>

      <BioComponent userId={user?.uid} />
    </header>
  );
}
