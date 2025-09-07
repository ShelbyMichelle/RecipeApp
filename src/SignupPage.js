import { auth, googleProvider } from './firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Link, useHistory } from 'react-router-dom';
import './Signup.css'
import { useContext } from 'react'; 
import { UserContext } from './App';

const SignupPage = () => {
  const { setUser } = useContext(UserContext); 
  const history = useHistory();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });
      // After successful signup, set a flag indicating it's a new user
      setUser({
        uid: userCredential.user.uid,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        isNewUser: true // Add this flag
      });
      // Optional: Send additional user data to your backend
      const userData = {
        uid: userCredential.user.uid,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        createdAt: new Date().toISOString()
      };

      // If you need to store additional user data in your backend
      try {
        await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
      } catch (backendError) {
        console.warn('Failed to save user data to backend:', backendError);
        // Don't fail the signup if backend fails, Firebase user is already created
      }

      alert('Account created successfully! Welcome to MyRecipeBook!');
      setTimeout(() => {
        history.push('/home');
      }, 1000);

    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Something went wrong. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please use a different email or sign in.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again.';
          break;
        default:
          errorMessage = error.message || 'Signup failed. Please try again.';
      }
      
      setErrors({ general: errorMessage });
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
        firstName: result.user.displayName?.split(' ')[0] || 'User',
        lastName: result.user.displayName?.split(' ')[1] || '',
        displayName: result.user.displayName
      });
      
      history.push('/home');
    } catch (err) {
      console.error(err);
    }
  };
    
  return (
    <div className="signup">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Join MyRecipeBook</h1>
          <p>Sign up and savor every step</p>
        </div>

        <div className="progress-indicator">
          <div className={`progress-step ${currentStep === 1 ? 'active' : ''}`}>1</div>
          <div className="progress-line" />
          <div className={`progress-step ${currentStep === 2 ? 'active' : ''}`}>2</div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <section className="step-section">
              <h2>Personal Information</h2>
              <p>Tell us a bit about yourself</p>

              <div className="input-group">
                <label htmlFor="firstName" className="input-label">First Name</label>
                <div className="input-wrapper">
                  <User />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="lastName" className="input-label">Last Name</label>
                <div className="input-wrapper">
                  <User />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
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

              <button type="button" onClick={handleNextStep}>
                Continue to Security
              </button>
              <br /> <br />
              <div id='google'>
                <button onClick={signInWithGoogle}>Sign In With Google</button>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="step-section">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <button
                  type="button"
                  className="back-button"
                  onClick={handlePrevStep}
                  aria-label="Go back to previous step"
                >
                  <ArrowLeft />
                </button>
                <div>
                  <h2>Secure Your Account</h2>
                  <p>Create a strong password</p>
                </div>
              </div>

              {errors.general && (
                <div className="general-error">{errors.general}</div>
              )}

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
                    placeholder="Create a strong password"
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
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.3rem' }}>
                  Password must be at least 8 characters with uppercase, lowercase, and number
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" disabled={isLoading}>
                {isLoading && <span className="loader" />}
                Create Account
              </button>

            </section>
          )}
        </form>


        <div className="login-link">
          <p>Already have an account?</p>
          <Link className="login-signin" to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;