import React, { useRef } from "react"
import Draggable from "react-draggable"
import { addEvent } from "../services/calendarService" // Changed from saveEvent to addEvent
import { useAuthentication } from "../services/authService"
import "./CalendarPopup.css"

export default function CalendarPopup({
  isOpen,
  selectedDay,
  month,
  year,
  eventTitle,
  eventText,
  eventStartTime,
  eventEndTime,
  onEventTitle,
  onEventText,
  onEventStartTime,
  onEventEndTime,
  onClose,
  onEventSaved,
}) {
  const popupRef = useRef(null)
  const user = useAuthentication()

  async function handleSave() {
    if (!user) return
    const eventData = {
      title: eventTitle,
      description: eventText,
      startTime: eventStartTime,
      endTime: eventEndTime,
      day: selectedDay,
      month: month,
      year: year,
    }

    try {
      await addEvent(user.uid, eventData)
      if (onEventSaved) onEventSaved(eventData)
      onClose()
    } catch (error) {
      console.error("Error saving event:", error)
    }
  }

  if (!isOpen) return null

  return (
    <section className="popup-section">
      <Draggable nodeRef={popupRef}>
        <form ref={popupRef} className="popup-overlay">
          <fieldset>
            <legend>Event Title</legend>
            <input
              className="event-title"
              type="text"
              placeholder="Event Title"
              value={eventTitle}
              onChange={onEventTitle}
            />
          </fieldset>
          <fieldset>
            <legend>Event Description</legend>
            <input
              className="event-description"
              type="text"
              placeholder="What do you have today!"
              value={eventText}
              onChange={onEventText}
            />
          </fieldset>
          <fieldset>
            <legend>Start Time</legend>
            <input
              className="event-start-time"
              type="time"
              value={eventStartTime}
              onChange={onEventStartTime}
            />
          </fieldset>
          <fieldset>
            <legend>End Time</legend>
            <input
              className="event-end-time"
              type="time"
              value={eventEndTime}
              onChange={onEventEndTime}
            />
          </fieldset>
          <section className="pop-up-button-section">
            <button className="save-button" type="button" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-button" type="button" onClick={onClose}>
              Cancel
            </button>
          </section>
        </form>
      </Draggable>
    </section>
  )
}
