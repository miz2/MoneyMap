import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './dashboard';
import { Auth } from './auth';
import { FinancialRecordsProvider } from './context/financial-record-context.tsx';
import Navbar from './components/Navbar';
import { useAuth0 } from '@auth0/auth0-react';
import Welcome from './components/Welcome';
import About from './dashboard/About.tsx';
import Investments from './dashboard/Investments'; // Import Investments component
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const { enqueueSnackbar } = useSnackbar();

  // Show the snackbar only once when the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      enqueueSnackbar('Welcome back!', { variant: 'success' });
    }
  }, [isAuthenticated, enqueueSnackbar]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Router>
      <FinancialRecordsProvider>
        <div className="app-container">
            <Navbar />
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/investments" element={<Investments />} /> {/* Add Investments route */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Welcome />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
       
      </FinancialRecordsProvider>
    </Router>
    
    </>
  );
}

export default App;
