export default function ProfileFriends() {
  return (
    //we are going to make two areas in this component, one for search input and one for the list of friends
    <section className="profile-friends">
      //make a serch input
      <input
        type="text"
        placeholder="Search for friends"
        className="search-input"
      />
      //make a list of friends from firebase and if there are no friends,
      display a message
      <section className="friends-list">
        <p>No friends found</p>
      </section>
    </section>
  );
}
