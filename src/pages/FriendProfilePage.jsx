import React, { useEffect, useState } from "react"
import { useParams, Navigate } from "react-router-dom"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../firebaseConfig"
import { useAuthentication } from "../services/authService"
import Calendar from "../components/Calendar"

function FriendProfilePage() {
  const { friendId } = useParams()
  const [friendData, setFriendData] = useState(null)
  const [friendEvents, setFriendEvents] = useState([])
  const [error, setError] = useState(null)
  const currentUser = useAuthentication()

  useEffect(() => {
    if (!friendId || !currentUser) return

    if (friendId === currentUser.uid) {
      setError("redirect")
      return
    }

    const unsubscribe = onSnapshot(
      doc(db, "users", friendId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data()

          if (!data.friends?.includes(currentUser.uid)) {
            setError(
              "You must be friends with this user to view their calendar"
            )
            return
          }

          setFriendData(data)
          setFriendEvents(data.events || [])
          setError(null)
        } else {
          setError("User not found")
        }
      },
      (error) => {
        console.error("Error listening to friend's data:", error)
        setError("Unable to load calendar data. Please try again later.")
      }
    )

    return () => unsubscribe()
  }, [friendId, currentUser])

  if (error === "redirect") {
    return <Navigate to="/profile" replace />
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (!friendData) {
    return <div>Loading friend's profile...</div>
  }

  return (
    <>
      <h2>{friendData.displayName}'s Calendar</h2>
      <Calendar
        isReadOnly={true}
        events={friendEvents}
        profileColor={friendData.profileColor}
      />
    </>
  )
}

export default FriendProfilePage
