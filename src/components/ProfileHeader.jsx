export default function ProfileHeader() {
  return (
    <header className="profile-header">
      <section className="user-info-container">
        <section className="user-identity-container">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="profile-image"
          />
          <h2 className="profile-name">John Doe</h2>
        </section>
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
