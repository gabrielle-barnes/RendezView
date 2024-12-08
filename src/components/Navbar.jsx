import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <>
      <Link to="/">
        <button>HomePage</button>
      </Link>
      <Link to="/profile">
        <button>UserProfilePage</button>
      </Link>
    </>
  );
}
