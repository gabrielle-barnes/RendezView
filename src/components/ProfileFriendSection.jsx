import ProfileFriends from "./ProfileFriends"
import ProfileSearch from "./ProfileSearch"
import "./ProfileFriendSection.css"

export default function ProfileFriendSection() {
  return (
    <section className="profile-friends-container">
      <ProfileFriends />
      <ProfileSearch />
    </section>
  )
}
