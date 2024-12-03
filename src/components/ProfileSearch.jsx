import { useState, useEffect } from "react";
import { fetchAllUsers, sendFriendRequest } from "../services/userService";
import { useAuthentication } from "../services/authService";
import "./ProfileSearch.css";
import UserCard from "./UserCard";

export default function ProfileSearch() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = useAuthentication();

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await fetchAllUsers();
      setUsers(allUsers);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      user.id !== currentUser?.uid
  );

  return (
    <section className="profile-search">
      <input
        type="text"
        placeholder="Search for Users"
        className="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <section className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              currentUser={currentUser}
              onRequest={() => sendFriendRequest(user.id, currentUser?.uid)}
            />
          ))
        ) : (
          <p>No Users found</p>
        )}
      </section>
    </section>
  );
}
