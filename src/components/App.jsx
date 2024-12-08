import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "../pages/HomePage"
import UserProfilePage from "../pages/UserProfilePage"
import SignInPage from "../pages/SignInPage"
import { Layout } from "../Layout"
import { SignIn, SignOut } from "../components/Auth"
import { useAuthentication } from "../services/authService"
import "./App.css"

function App() {
  const user = useAuthentication()

  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/homepage"
              element={user ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={user ? <UserProfilePage /> : <Navigate to="/" />}
            />
          </Route>

          <Route
            path="/"
            element={user ? <Navigate to="/homepage" /> : <SignInPage />}
          />
        </Routes>
      </Router>

      <h1>RendezView</h1>
      <div className="auth-section">{user ? <SignOut /> : <SignIn />}</div>
    </>
  )
}

export default App
