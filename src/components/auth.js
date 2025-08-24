export const Auth = () =>{
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
    )
}