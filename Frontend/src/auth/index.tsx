import { useAuth0 } from "@auth0/auth0-react";
export const Auth = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect(); // Simply call loginWithRedirect without any options
  };

  const handleLogout = () => {
    logout(); // Call logout without returnTo option
  };

  return (
    <div className="sign-in-container">
      {!isAuthenticated ? (
        <div>
          <button
            onClick={handleLogin}
            className="button"
          >
            Sign In
          </button>
          <button
            onClick={handleLogin}
            className="button"
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={handleLogout} className="button">
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};
