import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let result;
    if (isLogin) {
      result = await login(formData.username, formData.password);
    } else {
      result = await register(formData.username, formData.password);
    }

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Authentication failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container center-container">
      <div className="auth-card">
        <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Enter your credentials to access your account' : 'Sign up to start shopping'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          {!isLogin && (
             <div className="form-group">
             <label>Email</label>
             <div className="input-with-icon">
               <Mail size={18} className="input-icon" />
               <input
                 type="email"
                 name="email"
                 value={formData.email}
                 onChange={handleChange}
                 placeholder="Enter email"
                 required
               />
             </div>
           </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="text-btn" 
              onClick={() => {
                setIsLogin(!isLogin); 
                setError('');
                setFormData({username: '', password: '', email: ''});
              }}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
        
        <div className="mock-credentials">
          <p><strong>Mock Credentials:</strong></p>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem', fontSize: '0.875rem' }}>
            <li>User: <b>student1</b> / password</li>
            <li>User: <b>student2</b> / password</li>
            <li>Admin: <b>teacher</b> / password</li>
            <li>Admin: <b>admin</b> / password</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
