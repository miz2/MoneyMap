import React from 'react';
import './Welcome.css'; // Import the new stylesheet
import { useAuth0, RedirectLoginOptions } from '@auth0/auth0-react'; // Import the Auth0 hook and type

const Welcome: React.FC = () => {
  const { loginWithRedirect } = useAuth0(); // Destructure the loginWithRedirect function

  const handleSignUp = () => {
    // Directly use type casting to include screen_hint
    loginWithRedirect({
      screen_hint: 'signup',
    } as RedirectLoginOptions);
  };

  return (
    <div className="welcome-page">
      <div className="content-container">
        <div className="image-section">
          <img src='src/components/welcome.jpg' alt="Finance Tracker" className="welcome-image" />
        </div>
        <div className="text-section">
          <h1>Welcome to the Finance Tracker</h1>
          <p>Manage your expenses efficiently and gain insights into your spending habits.</p>
          <div className="features-section">
            <h2>Features:</h2>
            <ul>
              <li>Track all your monthly expenses in one place.</li>
              <li>Get detailed reports and analytics on your spending patterns.</li>
              <li>Visualize your spending with easy-to-read charts and graphs.</li>
              <li>Export your data for further analysis or tax purposes.</li>
            </ul>
          </div>
          <button className="get-started-button" onClick={handleSignUp}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
