import { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { BiMenuAltRight } from 'react-icons/bi';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import useAuth from './hooks/useAuth';
import Aside from './components/Aside';

const App = () => {
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const asideRef = useRef();

  useEffect(() => {
    const timeoutkey = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeoutkey);
  }, []);

  const toggleSMAside = () => {
    const aside = asideRef.current;

    aside.classList.toggle('active');
  };

  return loading ? (
    <div className="h-100 load-container" aria-busy={true}></div>
  ) : (
    <div className="fade content-wrapper">
      <Navbar />
      <main className="container home grid-c">
        <Aside userData={userData} />
        <button
          className="small-screen-aside-toggle"
          onClick={toggleSMAside}
        >
          <small>
            <BiMenuAltRight /> Folders
          </small>
        </button>
        <Aside userData={userData} smallScreen ref={asideRef} />
        <section>
          <Outlet />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
