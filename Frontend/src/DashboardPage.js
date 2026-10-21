import React from 'react';

/* Simple placeholder dashboard with stat cards */
const DashboardPage = () => {
  const cards = [
    { label: 'Total Revenue',   value: '$48,295', change: '+18.2%', up: true,  color: '#3B82F6' },
    { label: 'Active Sessions', value: '1,342',   change: '+7.4%',  up: true,  color: '#10B981' },
    { label: 'New Signups',     value: '284',     change: '+4.1%',  up: true,  color: '#8B5CF6' },
    { label: 'Support Tickets', value: '37',      change: '-12%',   up: false, color: '#F59E0B' },
  ];
  return (
    <div>
      <div className="stats-grid">
        {cards.map(c => (
          <div className="stat-card" key={c.label}>
            <div className="stat-icon" style={{ background: c.color }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22,color:'#fff'}}>
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="stat-body">
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label}</div>
              <div className={`stat-trend ${c.up ? 'up' : 'down'}`}>
                {c.up ? '▲' : '▼'} {c.change} this month
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background:'#fff', borderRadius:12, padding:'24px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)', textAlign:'center', color:'var(--text-muted)' }}>
        <div style={{ fontSize:'3rem', marginBottom:12 }}>📊</div>
        <h3 style={{ color:'var(--text)', marginBottom:8 }}>Charts coming soon</h3>
        <p style={{ fontSize:'.875rem' }}>Navigate to <strong>User Management</strong> to manage your team.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
