import React, { useState } from 'react';
import LoginPage from './LoginPage';
import UserManagement from './UserManagement';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin  = (loggedInUser) => setUser(loggedInUser);
  const handleLogout = () => setUser(null);

  return (
    <div className="app-root">
      {!user
        ? <LoginPage onLogin={handleLogin} />
        : <UserManagement currentUser={user} onLogout={handleLogout} />
      }
    </div>
  );
}
