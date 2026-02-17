import { auth, googleProvider } from './firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import React, { useState, useContext } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';   // ← import CSS (or do it globally)
import './Signup.css';
import { UserContext } from './App';

const SignupPage = () => {
  const { setUser } = useContext(UserContext);
  const history = useHistory();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.fullName.trim()
      });

      setUser({
        uid: userCredential.user.uid,
        email: formData.email,
        displayName: formData.fullName.trim(),
        isNewUser: true
      });

      // Optional backend call (non-blocking)
      fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          email: formData.email,
          fullName: formData.fullName.trim(),
          createdAt: new Date().toISOString()
        })
      }).catch((err) => console.warn('Backend save failed:', err));

      // Success toast + redirect
      toast.success('Account created successfully! Welcome to MyRecipeBook 🎉', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        history.push('/home');
      }, 2200); // Give toast time to be visible

    } catch (error) {
      console.error('Signup error:', error);

      let errorMessage = 'Something went wrong. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use': errorMessage = 'This email is already registered.'; break;
        case 'auth/invalid-email':        errorMessage = 'Invalid email address.'; break;
        case 'auth/weak-password':        errorMessage = 'Password is too weak.'; break;
        case 'auth/network-request-failed': errorMessage = 'Network error. Check your connection.'; break;
        default: errorMessage = error.message || 'Signup failed.';
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      // You can keep setErrors({ general: errorMessage }) too if you prefer inline errors
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || 'User'
      });
      toast.success('Signed in with Google successfully!');
      history.push('/home');
    } catch (err) {
      console.error('Google sign-in failed:', err);
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="signup">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Join MyRecipeBook</h1>
          <p>Sign up and start cooking!</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="fullName" className="input-label">Full Name</label>
            <div className="input-wrapper">
              <User />
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && <p className="error-message">{errors.fullName}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="email" className="input-label">Email Address</label>
            <div className="input-wrapper">
              <Mail />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
              />
            </div>
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <div className="input-wrapper">
              <Lock />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? <span className="loader" /> : 'Create Account'}
          </button>

          <div className="divider"><span>or</span></div>

          <button type="button" onClick={signInWithGoogle} className="google-btn">
            Sign up with Google
          </button>
        </form>

        <div className="login-link">
          <p>Already have an account?</p>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;