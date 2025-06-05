import { Outlet, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';

export default function Layout() {
  const location = useLocation();
  const { pathname, state } = location;
  const { cart, toastMessage } = useCart();

  const [showToast, setShowToast] = useState(false);
  const [hideToast, setHideToast] = useState(false);
  const [localToast, setLocalToast] = useState(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const pageTitles = {
    '/': 'Dashboard',
    '/events': 'Events',
    '/feedback': 'Feedback'
  };

  const pageTitle = pageTitles[pathname] || '';

  useEffect(() => {
    if (toastMessage) {
      setLocalToast(toastMessage);
      setShowToast(true);
      setHideToast(false);

      const timer1 = setTimeout(() => setHideToast(true), 2700);
      const timer2 = setTimeout(() => setShowToast(false), 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [toastMessage]);

  useEffect(() => {
    if (state && state.toast) {
      setLocalToast(state.toast);
      setShowToast(true);
      setHideToast(false);

      const timer1 = setTimeout(() => setHideToast(true), 2700);
      const timer2 = setTimeout(() => setShowToast(false), 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [state]);

  return (
    <div className="projects-wrapper">
      <aside id="sidebar">
        <section className="logotype">
          <Link to="/">
            <img src="/SiteLogo.png" alt="logo" />
            <span>Ventixe</span>
          </Link>
        </section>
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            <i className="fa-solid fa-table-columns"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/events" className={`nav-link ${pathname.startsWith('/events') ? 'active' : ''}`}>
            <i className="fa-solid fa-ticket-simple"></i>
            <span>Events</span>
          </Link>
          <Link to="/feedback" className={`nav-link ${pathname.startsWith('/feedback') ? 'active' : ''}`}>
            <i className="fa-solid fa-star"></i>
            <span>Feedback</span>
          </Link>
        </nav>
      </aside>

      <main id="main">
        <header id="header">
          <h1 className="page-title">{pageTitle}</h1>
          <div id="settings-container">
            <Link to="/cart" className="cart-btn">
              <i className="fa fa-basket-shopping"></i>
              {cartCount > 0 && (
                <span className="cart-count" aria-label={`${cartCount} items in cart`}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        <div id="projects" className="page">
          <Outlet />
        </div>

        <footer id="footer">
          <p className="footer-copyright">Copyright &copy; 2025 Peterdraw</p>
          <div className="footer-info">
            <p>Privacy Policy</p>
            <p>Term and conditions</p>
            <p>Contact</p>
          </div>
        </footer>

        {showToast && (
          <div className={`toast-message${hideToast ? ' hide' : ''}`} role="alert" aria-live="assertive">
            {localToast}
          </div>
        )}
      </main>
    </div>
  );
}
