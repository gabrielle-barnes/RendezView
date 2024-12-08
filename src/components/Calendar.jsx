import React, { useState, useCallback, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebaseConfig"
import { useAuthentication } from "../services/authService"
import "./Calendar.css"
import CalendarHeader from "./CalendarHeader"
import CalendarPopup from "./CalendarPopup"
import ActiveEvents from "./ActiveEvents"

export default function Calendar() {
  const initialColor = localStorage.getItem("userProfileColor") || "#ffe5ec"
  document.documentElement.style.setProperty(
    "--calendar-background",
    initialColor
  )

  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [eventTitle, setEventTitle] = useState("")
  const [eventText, setEventText] = useState("")
  const [eventStartTime, setEventStartTime] = useState("")
  const [eventEndTime, setEventEndTime] = useState("")
  const [events, setEvents] = useState([])
  const [profileColor, setProfileColor] = useState(initialColor)
  const user = useAuthentication()

  useEffect(() => {
    const fetchUserColor = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid)
          const userSnap = await getDoc(userRef)
          if (userSnap.exists()) {
            const userData = userSnap.data()
            const newColor = userData.profileColor || "#ffe5ec"
            setProfileColor(newColor)
            localStorage.setItem("userProfileColor", newColor)
            document.documentElement.style.setProperty(
              "--calendar-background",
              newColor
            )
          }
        } catch (error) {
          console.error("Error fetching user color:", error)
        }
      }
    }

    fetchUserColor()
  }, [user])

  const handleEventTitleChange = (e) => setEventTitle(e.target.value)
  const handleEventTextChange = (e) => setEventText(e.target.value)
  const handleEventStartTimeChange = (e) => setEventStartTime(e.target.value)
  const handleEventEndTimeChange = (e) => setEventEndTime(e.target.value)

  const handleEventsChange = useCallback((newEvents) => {
    console.log("Updating events:", newEvents)
    setEvents(newEvents)
  }, [])

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const closePopup = () => {
    setIsPopupOpen(false)
    setEventTitle("")
    setEventText("")
    setEventStartTime("")
    setEventEndTime("")
  }

  const handleMonthChange = (increment) => {
    const newDate = new Date(year, month + increment)
    setMonth(newDate.getMonth())
    setYear(newDate.getFullYear())
  }

  const addEventToState = useCallback((newEvent) => {
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, newEvent]
      updatedEvents.sort((a, b) => {
        const dateA = new Date(a.year, a.month, a.day)
        const dateB = new Date(b.year, b.month, b.day)
        return dateA - dateB
      })
      return updatedEvents
    })
  }, [])

  const openPopup = (day) => {
    setSelectedDay(day)
    setIsPopupOpen(true)
  }

  const hasEvents = (day) => {
    return events.some(
      (event) =>
        event.day === day && event.month === month && event.year === year
    )
  }

  const handleEventSaved = useCallback(
    (newEvent) => {
      addEventToState(newEvent)
      handleEventsChange([...events, newEvent])
    },
    [addEventToState, handleEventsChange, events]
  )

  return (
    <section className="calendar-section" aria-label="Calendar">
      <section className="calendar">
        <CalendarHeader
          year={year}
          month={month}
          onMonthChange={handleMonthChange}
          onClose={closePopup}
        />
        <div className="calendar-days" aria-hidden="true">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="day-name">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid" role="grid">
          {[...Array(firstDay)].map((_, i) => (
            <div
              key={`empty-${i}`}
              className="day empty"
              aria-hidden="true"
            ></div>
          ))}
          {[...Array(daysInMonth)].map((_, i) => {
            const dayNumber = i + 1
            const hasEventOnDay = hasEvents(dayNumber)
            return (
              <div
                key={i}
                className={`day${hasEventOnDay ? " has-events" : ""}`}
                role="gridcell"
                aria-label={dayNumber}
                onClick={() => openPopup(dayNumber)}
              >
                {dayNumber}
                {hasEventOnDay && <span className="event-indicator"></span>}
              </div>
            )
          })}
        </div>
      </section>
      <CalendarPopup
        isOpen={isPopupOpen}
        selectedDay={selectedDay}
        month={month}
        year={year}
        eventTitle={eventTitle}
        eventText={eventText}
        eventStartTime={eventStartTime}
        eventEndTime={eventEndTime}
        onEventTitle={handleEventTitleChange}
        onEventText={handleEventTextChange}
        onEventStartTime={handleEventStartTimeChange}
        onEventEndTime={handleEventEndTimeChange}
        onClose={closePopup}
        onEventSaved={handleEventSaved}
        existingEvents={events}
      />
      <ActiveEvents onEventChange={handleEventsChange} events={events} />
    </section>
  )
}
