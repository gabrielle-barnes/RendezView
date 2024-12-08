import { useState, useEffect } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebaseConfig"
import { useAuthentication, updateProfilePhoto } from "../services/authService"
import fetchRandomArt from "../services/fetchRandomArt"
import BioComponent from "./BioComponent"
import "./ProfileHeader.css"

export default function ProfileHeader() {
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/150"
  )
  const [friendCount, setFriendCount] = useState(0)
  const [enemyCount, setEnemyCount] = useState(0)
  const [bio, setBio] = useState("")
  const [profileColor, setProfileColor] = useState("#ffe5ec")
  const user = useAuthentication()

  const availableColors = [
    { color: "#ffe5ec" },
    { color: "#ACC8E5" },
    { color: "#bfd6b8" },
    { color: "#E6E6FA" },
    { color: "#FFFACD" },
  ]

  const fetchProfileData = async () => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const userData = userSnap.data()
          setProfileImage(userData.profilePhoto || profileImage)
          setFriendCount((userData.friends || []).length)
          setEnemyCount((userData.enemies || []).length || 0)
          setBio(userData.bio || "")
          setProfileColor(userData.profileColor || "#ffe5ec")
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.message)
      }
    }
  }

  useEffect(() => {
    fetchProfileData()
  }, [user])

  const handleFetchRandomArt = async () => {
    const randomArt = await fetchRandomArt()
    if (randomArt) {
      setProfileImage(randomArt)
      if (user) {
        await updateProfilePhoto(user, randomArt)
        fetchProfileData()
      }
    }
  }

  const handleColorChange = async (color) => {
    setProfileColor(color)
    if (user) {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, { profileColor: color })
    }
  }

  return (
    <header className="profile-header" style={{ background: profileColor }}>
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

      <div className="color-picker-container">
        <h3 className="color-picker-title">Profile Colors</h3>
        <div className="color-options">
          {availableColors.map((colorOption) => (
            <label
              key={colorOption.color}
              className="color-option-label"
              style={{ backgroundColor: colorOption.color }}
            >
              <input
                type="radio"
                name="profile-color"
                value={colorOption.color}
                checked={profileColor === colorOption.color}
                onChange={() => handleColorChange(colorOption.color)}
              />
              {colorOption.label}
            </label>
          ))}
        </div>
      </div>
    </header>
  )
}
