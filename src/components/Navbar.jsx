import { Link } from "react-router-dom"

export function Navbar() {
  return (
    <nav className="navigation-buttons">
      <Link to="/homepage">
        <button className="nav-button">Home</button>
      </Link>
      <Link to="/profile">
        <button className="nav-button">Your Profile</button>
      </Link>
    </nav>
  )
}
