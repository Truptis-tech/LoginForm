import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [form, setForm]                 = useState({ email: '', password: '' });
  const [errors, setErrors]             = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [loginError, setLoginError]     = useState('');
  const [showForgot, setShowForgot]     = useState(false);
  const [forgotEmail, setForgotEmail]   = useState('');
  const [forgotSent, setForgotSent]     = useState(false);
  const [forgotError, setForgotError]   = useState('');

  // Self-Registration States
  const [isSignup, setIsSignup]         = useState(false);
  const [signupForm, setSignupForm]     = useState({ name: '', email: '', dept: 'Engineering', password: '', confirmPassword: '' });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupSuccess, setSignupSuccess] = useState(false);

  const getUsersList = () => {
    const saved = localStorage.getItem('portal_users');
    if (saved) return JSON.parse(saved);
    const initialList = [
      { id: 0, name: 'Trupti Lakshmi',  email: 'truptilakshmi.tm@gmail.com', password: 'trupti@2005', role: 'Super Admin', status: 'Active',   joined: '2026-06-06', avatar: 'TL', dept: 'Leadership' },
      { id: 1, name: 'Alice Johnson',   email: 'alice@gmail.com',   password: 'password123', role: 'Super Admin', status: 'Active',   joined: '2024-01-10', avatar: 'AJ', dept: 'Engineering' },
      { id: 2, name: 'Bob Martinez',    email: 'bob@yahoo.com',     password: 'password123', role: 'Editor',      status: 'Active',   joined: '2024-02-14', avatar: 'BM', dept: 'Marketing'   },
      { id: 3, name: 'Carol Smith',     email: 'carol@gmail.com',   password: 'password123', role: 'Viewer',      status: 'Inactive', joined: '2024-03-05', avatar: 'CS', dept: 'Sales'        },
      { id: 4, name: 'David Lee',       email: 'david@yahoo.com',   password: 'password123', role: 'Editor',      status: 'Active',   joined: '2024-04-22', avatar: 'DL', dept: 'Design'       },
      { id: 5, name: 'Emma Wilson',     email: 'emma@gmail.com',    password: 'password123', role: 'Viewer',      status: 'Pending',  joined: '2024-05-18', avatar: 'EW', dept: 'HR'           },
      { id: 6, name: 'Frank Brown',     email: 'frank@yahoo.com',   password: 'password123', role: 'Editor',      status: 'Active',   joined: '2024-06-01', avatar: 'FB', dept: 'Finance'      },
      { id: 7, name: 'Grace Davis',     email: 'grace@gmail.com',   password: 'password123', role: 'Viewer',      status: 'Inactive', joined: '2024-07-09', avatar: 'GD', dept: 'Engineering'  },
      { id: 8, name: 'Henry Taylor',    email: 'henry@yahoo.com',   password: 'password123', role: 'Super Admin', status: 'Active',   joined: '2024-08-15', avatar: 'HT', dept: 'Leadership'   },
    ];
    localStorage.setItem('portal_users', JSON.stringify(initialList));
    return initialList;
  };

  const getInitials = (name) => {
    return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?';
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!form.password) {
      errs.password = 'Password is required.';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (loginError)   setLoginError('');
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
    if (signupErrors[name]) setSignupErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateSignup = () => {
    const errs = {};
    if (!signupForm.name.trim()) {
      errs.name = 'Full Name is required.';
    }
    if (!signupForm.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!signupForm.password) {
      errs.password = 'Password is required.';
    } else if (signupForm.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (!signupForm.confirmPassword) {
      errs.confirmPassword = 'Confirm password is required.';
    } else if (signupForm.password !== signupForm.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setLoginError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: data.avatar || getInitials(data.name),
          dept: data.dept
        });
      } else {
        setLoginError(data.message || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err) {
      setLoginError('Failed to connect to the backend service. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const errs = validateSignup();
    if (Object.keys(errs).length) { setSignupErrors(errs); return; }
    setLoading(true);
    setSignupSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
          dept: signupForm.dept,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSignupSuccess(true);
      } else {
        if (data.message && data.message.toLowerCase().includes('email')) {
          setSignupErrors({ email: data.message });
        } else {
          setSignupErrors({ general: data.message || 'An error occurred during sign up.' });
        }
      }
    } catch (err) {
      setSignupErrors({ general: 'Failed to connect to the backend service. Make sure the backend is running.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) { setForgotError('Please enter your email.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) { setForgotError('Invalid email address.'); return; }
    setForgotError('');
    await new Promise(r => setTimeout(r, 800));
    setForgotSent(true);
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotEmail('');
    setForgotSent(false);
    setForgotError('');
  };

  return (
    <div className="lp-root">
      <div className="lp-blob lp-blob-1" />
      <div className="lp-blob lp-blob-2" />
      <div className="lp-blob lp-blob-3" />

      <div className="lp-wrapper">
        {/* RIGHT — login / signup card */}
        <div className="lp-right">
          <div className="lp-card">
            {isSignup ? (
              signupSuccess ? (
                <div className="lp-success-state">
                  <div className="lp-success-icon">🎉</div>
                  <h2 className="lp-card-title">Success!</h2>
                  <p className="lp-card-sub" style={{ marginTop: '10px', lineHeight: '1.6' }}>
                    Your account has been created. However, <strong>only administrators can grant access</strong> to log in.
                  </p>
                  <p className="lp-card-sub" style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                    Please wait for <strong>truptilakshmi.tm@gmail.com</strong> to approve your account.
                  </p>
                  <button
                    style={{ marginTop: '24px' }}
                    className="lp-btn-primary"
                    onClick={() => {
                      setIsSignup(false);
                      setSignupSuccess(false);
                      setSignupForm({ name: '', email: '', dept: 'Engineering', password: '', confirmPassword: '' });
                    }}
                    id="lp-back-to-signin-btn"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              ) : (
                <>
                  <div className="lp-card-header">
                    <h2 className="lp-card-title">Create Account</h2>
                  </div>

                  {signupErrors.general && (
                    <div className="lp-alert lp-alert-error" id="lp-signup-error-alert" style={{ marginBottom: '16px' }}>
                      <span>⚠️</span> {signupErrors.general}
                    </div>
                  )}

                  <form className="lp-form" onSubmit={handleSignupSubmit} noValidate>
                    {/* Full Name */}
                    <div className={`lp-field ${signupErrors.name ? 'lp-field-error' : ''}`}>
                      <label className="lp-label" htmlFor="lp-signup-name">Full Name</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon">👤</span>
                        <input
                          id="lp-signup-name"
                          className="lp-input"
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          value={signupForm.name}
                          onChange={handleSignupChange}
                        />
                      </div>
                      {signupErrors.name && <p className="lp-error-msg">{signupErrors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className={`lp-field ${signupErrors.email ? 'lp-field-error' : ''}`}>
                      <label className="lp-label" htmlFor="lp-signup-email">Email Address</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon">✉️</span>
                        <input
                          id="lp-signup-email"
                          className="lp-input"
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={signupForm.email}
                          onChange={handleSignupChange}
                        />
                      </div>
                      {signupErrors.email && <p className="lp-error-msg">{signupErrors.email}</p>}
                    </div>

                    {/* Department */}
                    <div className={`lp-field ${signupErrors.dept ? 'lp-field-error' : ''}`}>
                      <label className="lp-label" htmlFor="lp-signup-dept">Department</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon">🏢</span>
                        <select
                          id="lp-signup-dept"
                          className="lp-input"
                          style={{ paddingLeft: '40px', appearance: 'none', background: 'white' }}
                          name="dept"
                          value={signupForm.dept}
                          onChange={handleSignupChange}
                        >
                          {['Engineering','Marketing','Sales','Design','HR','Finance','Leadership'].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <span className="lp-select-arrow" style={{ position: 'absolute', right: '15px', pointerEvents: 'none', color: '#6B7280' }}>▼</span>
                      </div>
                      {signupErrors.dept && <p className="lp-error-msg">{signupErrors.dept}</p>}
                    </div>

                    {/* Password */}
                    <div className={`lp-field ${signupErrors.password ? 'lp-field-error' : ''}`}>
                      <label className="lp-label" htmlFor="lp-signup-password">Password</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon">🔑</span>
                        <input
                          id="lp-signup-password"
                          className="lp-input"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="At least 6 characters"
                          value={signupForm.password}
                          onChange={handleSignupChange}
                        />
                        <button
                          type="button"
                          className="lp-eye-btn"
                          onClick={() => setShowPassword(p => !p)}
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                      {signupErrors.password && <p className="lp-error-msg">{signupErrors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className={`lp-field ${signupErrors.confirmPassword ? 'lp-field-error' : ''}`}>
                      <label className="lp-label" htmlFor="lp-signup-confirmPassword">Confirm Password</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon">🔒</span>
                        <input
                          id="lp-signup-confirmPassword"
                          className="lp-input"
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Re-enter password"
                          value={signupForm.confirmPassword}
                          onChange={handleSignupChange}
                        />
                      </div>
                      {signupErrors.confirmPassword && <p className="lp-error-msg">{signupErrors.confirmPassword}</p>}
                    </div>

                    <button
                      className={`lp-btn-primary ${loading ? 'lp-btn-loading' : ''}`}
                      type="submit"
                      disabled={loading}
                      id="lp-signup-btn"
                    >
                      {loading ? <><span className="lp-spinner" /> Signing up…</> : '→  Sign Up'}
                    </button>
                  </form>

                  <div className="lp-row-between" style={{ justifyContent: 'center', marginTop: '16px' }}>
                    <button
                      type="button"
                      className="lp-forgot-link"
                      onClick={() => {
                        setIsSignup(false);
                        setSignupErrors({});
                      }}
                      id="lp-toggle-login-link"
                    >
                      Already have an account? Sign In
                    </button>
                  </div>
                </>
              )
            ) : (
              <>
                <div className="lp-card-header">
                  <h2 className="lp-card-title">Sign in to your account</h2>
                </div>

                {loginError && (
                  <div className="lp-alert lp-alert-error" id="lp-login-error-alert">
                    <span>⚠️</span> {loginError}
                  </div>
                )}

                <form className="lp-form" onSubmit={handleSubmit} noValidate>
                  <div className={`lp-field ${errors.email ? 'lp-field-error' : ''}`}>
                    <label className="lp-label" htmlFor="lp-email">Email Address</label>
                    <div className="lp-input-wrap">
                      <span className="lp-input-icon">✉️</span>
                      <input
                        id="lp-email"
                        className="lp-input"
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="username"
                      />
                    </div>
                    {errors.email && <p className="lp-error-msg">{errors.email}</p>}
                  </div>

                  <div className={`lp-field ${errors.password ? 'lp-field-error' : ''}`}>
                    <label className="lp-label" htmlFor="lp-password">Password</label>
                    <div className="lp-input-wrap">
                      <span className="lp-input-icon">🔑</span>
                      <input
                        id="lp-password"
                        className="lp-input"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="lp-eye-btn"
                        onClick={() => setShowPassword(p => !p)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {errors.password && <p className="lp-error-msg">{errors.password}</p>}
                  </div>

                  <div className="lp-row-between">
                    <label className="lp-checkbox-label">
                      <input type="checkbox" className="lp-checkbox" /> Remember me
                    </label>
                    <button type="button" className="lp-forgot-link" onClick={() => setShowForgot(true)}>
                      Forgot password?
                    </button>
                  </div>

                  <button
                    className={`lp-btn-primary ${loading ? 'lp-btn-loading' : ''}`}
                    type="submit"
                    disabled={loading}
                    id="lp-login-btn"
                  >
                    {loading ? <><span className="lp-spinner" /> Signing in…</> : '→  Sign In'}
                  </button>
                </form>

                <div className="lp-row-between" style={{ justifyContent: 'center', marginTop: '16px' }}>
                  <button
                    type="button"
                    className="lp-forgot-link"
                    onClick={() => {
                      setIsSignup(true);
                      setErrors({});
                    }}
                    id="lp-toggle-signup-link"
                  >
                    Don't have an account? Sign Up
                  </button>
                </div>


              </>
            )}
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="lp-modal-overlay" onClick={closeForgot}>
          <div className="lp-modal" onClick={e => e.stopPropagation()}>
            <button className="lp-modal-close" onClick={closeForgot}>✕</button>
            {!forgotSent ? (
              <>
                <div className="lp-modal-icon">📬</div>
                <h3 className="lp-modal-title">Reset Password</h3>
                <p className="lp-modal-sub">Enter your email and we'll send reset instructions.</p>
                <form onSubmit={handleForgot} className="lp-form" noValidate>
                  <div className={`lp-field ${forgotError ? 'lp-field-error' : ''}`}>
                    <label className="lp-label" htmlFor="lp-forgot-email">Email Address</label>
                    <div className="lp-input-wrap">
                      <span className="lp-input-icon">✉️</span>
                      <input
                        id="lp-forgot-email"
                        className="lp-input"
                        type="email"
                        placeholder="your@email.com"
                        value={forgotEmail}
                        onChange={e => { setForgotEmail(e.target.value); setForgotError(''); }}
                      />
                    </div>
                    {forgotError && <p className="lp-error-msg">{forgotError}</p>}
                  </div>
                  <button className="lp-btn-primary" type="submit" id="lp-forgot-send-btn">
                    Send Reset Link
                  </button>
                </form>
              </>
            ) : (
              <div className="lp-success-state">
                <div className="lp-success-icon">✅</div>
                <h3 className="lp-modal-title">Check your inbox!</h3>
                <p className="lp-modal-sub">
                  We sent reset instructions to <strong>{forgotEmail}</strong>.
                </p>
                <button className="lp-btn-primary" onClick={closeForgot} id="lp-forgot-done-btn">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
