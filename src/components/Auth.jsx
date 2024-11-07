import { login, logout, useAuthentication } from "../services/authService"

export function SignIn() {
  return <button onClick={login}>Sign In with Google</button>
}

export function SignOut() {
  const user = useAuthentication()

  return (
    <div>
      {user ? (
        <>
          Hello, {user.displayName}
          <button onClick={logout}>Sign Out</button>
        </>
      ) : (
        "Not signed in"
      )}
    </div>
  )
}
