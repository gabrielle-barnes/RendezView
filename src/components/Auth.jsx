import { login, logout, useAuthentication } from "../services/authService"

export function SignIn() {
  return (
    <button className="sign-in-button" onClick={login}>
      Sign In with Google
    </button>
  )
}

export function SignOut() {
  const user = useAuthentication()

  return (
    <div className="user-name">
      {user ? (
        <>
          Hello, {user.displayName}
          <button className="sign-out-button" onClick={logout}>
            Sign Out
          </button>
        </>
      ) : (
        "Not signed in"
      )}
    </div>
  )
}

export default function SignInPage() {
  return (
    <>
      <h1>This is the Sign In page</h1>
    </>
  )
}
