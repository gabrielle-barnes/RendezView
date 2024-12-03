import "./ProfileFriends.css";
export default function ProfileFriends() {
  return (
    <section className="profile-friends">
      <input
        type="text"
        placeholder="Search for friends"
        className="search-input"
      />
      <section className="friends-list">
        <p>No friends found</p>
      </section>
    </section>
  );
}
