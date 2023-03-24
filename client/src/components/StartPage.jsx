import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Footer from './Footer';
import Navbar from './Navbar';

const StartPage = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      const timeoutkey = setTimeout(() => {
        setLoading(false);
      }, 300);
      return () => clearTimeout(timeoutkey);
    }

    navigate('/');
  }, [isLoggedIn]);

  return loading ? (
    <div className="load-container h-100" aria-busy={true}></div>
  ) : (
    <div className="fade">
      <Navbar />
      <main className="container login-form">
        <article className="grid">{children}</article>
      </main>
      <Footer />
    </div>
  );
};

export default StartPage;
