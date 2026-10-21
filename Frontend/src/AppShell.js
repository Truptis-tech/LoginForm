import React from 'react';

/* ── Inline SVG Icons ──────────────────────────────────────────── */
const Icon = {
  Shield:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Users:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Settings:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Bell:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  HelpCircle:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  LogOut:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Search:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Menu:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

const NAV_ITEMS = [
  { id: 'users',     label: 'User Management', icon: 'Users',     badge: null },
  { id: 'dashboard', label: 'Dashboard',       icon: 'Dashboard', badge: null },
  { id: 'settings',  label: 'Settings',        icon: 'Settings',  badge: null },
];

const AppShell = ({ user, currentPage, onNavigate, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="app-shell">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:99 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><Icon.Shield /></div>
          <div>
            <span>AdminPortal</span>
            <small>ADMIN PANEL</small>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {NAV_ITEMS.map(item => {
            const IconComp = Icon[item.icon];
            return (
              <div
                key={item.id}
                id={`nav-${item.id}`}
                className={`nav-item${currentPage === item.id ? ' active' : ''}`}
                onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
              >
                <IconComp />
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </div>
            );
          })}

          <div className="nav-section-label" style={{ marginTop: 16 }}>Support</div>
          <div className="nav-item"><Icon.HelpCircle /> Help &amp; Docs</div>
        </nav>

        {/* User + Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </div>
          </div>
          <div
            className="nav-item"
            id="logout-btn"
            style={{ color: '#FCA5A5', marginTop: 4 }}
            onClick={onLogout}
          >
            <Icon.LogOut /> Log Out
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <button
            className="topbar-icon-btn"
            style={{ display:'flex' }}
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <Icon.X /> : <Icon.Menu />}
          </button>
          <span className="topbar-title">
            {NAV_ITEMS.find(n => n.id === currentPage)?.label || 'Admin Portal'}
          </span>
          <div className="topbar-actions">
            <button className="topbar-icon-btn" title="Search" aria-label="Search"><Icon.Search /></button>
            <button className="topbar-icon-btn" title="Notifications" aria-label="Notifications" style={{ position:'relative' }}>
              <Icon.Bell />
              <span className="topbar-badge" />
            </button>
            <button className="topbar-icon-btn" title="Settings" aria-label="Settings"><Icon.Settings /></button>
            <div className="sidebar-avatar" style={{ width:36, height:36, fontSize:'.78rem', cursor:'pointer' }}>{initials}</div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <div className="page-header">
            <div>
              <h2>{NAV_ITEMS.find(n => n.id === currentPage)?.label || 'Welcome'}</h2>
              <p>
                {currentPage === 'users'     && 'Manage your team members and their account permissions.'}
                {currentPage === 'dashboard' && 'Overview of your admin portal activity.'}
                {currentPage === 'settings'  && 'Configure your portal preferences.'}
              </p>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
