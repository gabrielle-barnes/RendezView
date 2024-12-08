import { Link } from "react-router-dom"

export function Navbar() {
  return (
    <div className="navbar-container">
      <Link to="/homepage">
        <button className="home-button">Home</button>
      </Link>
      <Link to="/profile">
        <button className="your-profile-button">Your Profile</button>
      </Link>
    </div>
  )
}
