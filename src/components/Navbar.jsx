import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, History as HistoryIcon, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          SimpleShop
        </Link>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          
          {user && (
            <NavLink to="/history" className="nav-item">
              <HistoryIcon size={20} />
              <span>History</span>
            </NavLink>
          )}

          <NavLink to="/cart" className="nav-item cart-link">
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>

          {user ? (
            <div className="nav-item" style={{ gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem' }}>Hi, {user.username}</span>
              <button 
                onClick={handleLogout} 
                className="nav-item" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="nav-item">
              <User size={20} />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
