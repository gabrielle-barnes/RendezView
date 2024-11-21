export default function ProfileSearch() {
  return (
    <section className="profile-search">
      <input
        type="text"
        placeholder="Search for Users"
        className="search-input"
      />
      <section className="User-list">
        <p>No Users found</p>
      </section>
    </section>
  );
}
