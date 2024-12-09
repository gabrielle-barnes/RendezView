import "../components/SignInPage.css"
import logo from "../../public/logo.png"

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="logo-container">
        <img src={logo} alt="App Logo" className="floating-logo" />
      </div>
      <h2 className="welcome-message">
        Please sign in to take a <span className="highlight">RendezView</span>{" "}
        into your plans!
      </h2>
    </div>
  )
}
