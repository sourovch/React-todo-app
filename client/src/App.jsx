import React from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuth } from './context/authContext';

const App = () => {
  const [loading, setLoading] = useState(true);
  const { setIsLoggedIn } = useAuth();

  useState(() => {
    const timeoutkey = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeoutkey);
  }, []);
  return loading ? (
    <div className="h-100 load-container" aria-busy={true}></div>
  ) : (
    <div className="fade">
      <Navbar />
      <main className="container">
        <h1>Main Content</h1>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }}
        >
          Logout
        </button>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
