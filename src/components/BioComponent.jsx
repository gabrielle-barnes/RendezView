import { useState, useEffect } from "react"
import { saveUserBio, fetchUserBio } from "../services/userService"
import "./BioComponent.css"

export default function BioComponent({ userId }) {
  const [bio, setBio] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const loadBio = async () => {
      if (userId) {
        const userBio = await fetchUserBio(userId)
        setBio(userBio || "Write something about yourself...")
      }
    }
    loadBio()
  }, [userId])

  const handleSaveBio = async () => {
    if (userId) {
      await saveUserBio(userId, bio)
      setIsEditing(false)
    }
  }

  return (
    <div className="bio-container">
      {isEditing ? (
        <>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bio-input"
            placeholder="Write your bio..."
          />
          <button onClick={handleSaveBio} className="save-bio-button">
            Save
          </button>
        </>
      ) : (
        <>
          <p className="bio-text">{bio}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="edit-bio-button"
          >
            Edit
          </button>
        </>
      )}
    </div>
  )
}
