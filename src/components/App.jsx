import { useEffect, useState } from "react"
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import UserProfilePage from "../pages/UserProfilePage";
import FriendProfilePage from "../pages/FriendProfilePage";
import { Layout } from "../Layout";
import { SignIn, SignOut } from "../components/Auth";
import { useAuthentication } from "../services/authService"; 
import "./App.css";

function App() {
  const user = useAuthentication();

  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/friend" element={<FriendProfilePage />} />
          </Route>
        </Routes>
      </Router>
      <h1>Plan&Do</h1>

      <div className="auth-section">
        {user ? (
          <SignOut />
        ) : (
          <SignIn />
        )}
      </div>
    </>
  );
}

export default App;
