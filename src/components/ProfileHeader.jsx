import { useState } from "react";
import fetchRandomArt from "../services/fetchRandomArt";
import "./ProfileHeader.css";

export default function ProfileHeader() {
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150");
  const handleFetchRandomArt = async () => {
    const randomArt = await fetchRandomArt();
    if (randomArt) setProfileImage(randomArt);
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
          <h2 className="profile-name">John Doe</h2>
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