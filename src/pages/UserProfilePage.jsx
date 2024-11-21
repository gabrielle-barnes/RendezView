import ProfileHeader from "../components/ProfileHeader";
import ProfileFriends from "../components/ProfileFriends";
import ProfileSearch from "../components/ProfileSearch";

export default function UserProfilePage() {
  return (
    <>
      <h1>This is the user profile page</h1>
      <ProfileHeader />
      <ProfileFriends />
      <ProfileSearch />
    </>
  );
}
