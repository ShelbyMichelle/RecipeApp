import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; 
import './Login.css'
import { useContext } from 'react';
import { UserContext } from './App';


const Login = () => {
  const { setUser } = useContext(UserContext);
  const history = useHistory();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const displayName = userCredential.user.displayName;
    const firstName = displayName ? displayName.split(' ')[0] : 'User';
    
      // After successful login, don't set the isNewUser flag (or set it to false)
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        firstName: firstName,
        lastName: displayName ? displayName.split(' ').slice(1).join(' ') : '',
        displayName: displayName,
        isNewUser: false // Explicitly set to false for returning users
      });

      alert('Login successful! Welcome back!');
      setTimeout(() => {
        history.push('/home');
      }, 1000);

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Log in to access your account</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-group">
            <label htmlFor="email">Email</label>
            <div className="login-input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="login-group">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={togglePassword} className="login-password-toggle">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? <span className="loader"></span> : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don’t have an account?</p>
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
