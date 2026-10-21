import React, { useState, useMemo, useEffect } from 'react';
import './UserManagement.css';

const INITIAL_USERS = [
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

const ROLES   = ['All Roles',   'Super Admin', 'Editor', 'Viewer'];
const STATUSES = ['All Status', 'Active', 'Inactive', 'Pending'];
const DEPTS   = ['All Depts',  'Engineering', 'Marketing', 'Sales', 'Design', 'HR', 'Finance', 'Leadership'];

const EMPTY_USER = { name:'', email:'', role:'Viewer', status:'Active', dept:'Engineering', avatar:'' };

const avatarColors = {
  'Super Admin': '#4F6EF7',
  'Editor':      '#F97316',
  'Viewer':      '#22C55E',
};
const statusBadge = {
  'Active':   { bg: '#DCFCE7', color: '#15803D', dot: '#22C55E' },
  'Inactive': { bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF' },
  'Pending':  { bg: '#FEF3C7', color: '#B45309', dot: '#F59E0B' },
};

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?';
}

export default function UserManagement({ currentUser, onLogout }) {
  const [users, setUsers]         = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        showToast('Failed to fetch users from server.', 'error');
      }
    } catch (err) {
      showToast('Failed to connect to backend server.', 'error');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter]     = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [deptFilter, setDeptFilter]     = useState('All Depts');
  const [page, setPage]           = useState(1);
  const [selected, setSelected]   = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser]   = useState(null); // null = new
  const [formData, setFormData]   = useState(EMPTY_USER);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast]         = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = currentUser.role === 'Super Admin';
  const PER_PAGE = 5;

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    return users.filter(u => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.dept.toLowerCase().includes(q);
      const matchRole   = roleFilter   === 'All Roles'   || u.role   === roleFilter;
      const matchStatus = statusFilter === 'All Status'  || u.status === statusFilter;
      const matchDept   = deptFilter   === 'All Depts'   || u.dept   === deptFilter;
      return matchSearch && matchRole && matchStatus && matchDept;
    });
  }, [users, search, roleFilter, statusFilter, deptFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageUsers  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const stats = useMemo(() => ({
    total:    users.length,
    active:   users.filter(u => u.status === 'Active').length,
    inactive: users.filter(u => u.status === 'Inactive').length,
    pending:  users.filter(u => u.status === 'Pending').length,
    admins:   users.filter(u => u.role === 'Super Admin').length,
  }), [users]);

  /* Selection */
  const allSelected = pageUsers.length > 0 && pageUsers.every(u => selected.includes(u.id));
  const toggleAll = () => setSelected(allSelected ? selected.filter(id => !pageUsers.map(u=>u.id).includes(id)) : [...new Set([...selected, ...pageUsers.map(u=>u.id)])]);
  const toggleOne = (id) => setSelected(sel => sel.includes(id) ? sel.filter(x=>x!==id) : [...sel, id]);

  /* Open Add/Edit modal */
  const openAdd = () => {
    setEditUser(null);
    setFormData({ ...EMPTY_USER });
    setFormErrors({});
    setShowModal(true);
  };
  const openEdit = (u) => {
    setEditUser(u);
    setFormData({ name:u.name, email:u.email, role:u.role, status:u.status, dept:u.dept, avatar:u.avatar });
    setFormErrors({});
    setShowModal(true);
  };

  /* Validate */
  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim())  errs.name  = 'Name is required.';
    if (!formData.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email.';
    else {
      const dup = users.find(u => u.email === formData.email && u.id !== editUser?.id);
      if (dup) errs.email = 'Email already exists.';
    }
    return errs;
  };

  /* Save */
  const handleSave = async () => {
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    
    try {
      if (editUser) {
        const response = await fetch(`http://localhost:5000/api/users/${editUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          showToast('User updated successfully!');
          fetchUsers();
        } else {
          const data = await response.json();
          showToast(data.message || 'Failed to update user.', 'error');
        }
      } else {
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          showToast('User added successfully!');
          fetchUsers();
        } else {
          const data = await response.json();
          showToast(data.message || 'Failed to add user.', 'error');
        }
      }
      setShowModal(false);
    } catch (err) {
      showToast('Connection error. Failed to save user.', 'error');
      console.error(err);
    }
  };

  /* Delete single */
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSelected(sel => sel.filter(x => x !== id));
        showToast('User deleted.', 'error');
        fetchUsers();
      } else {
        const data = await response.json();
        showToast(data.message || 'Failed to delete user.', 'error');
      }
    } catch (err) {
      showToast('Connection error. Failed to delete user.', 'error');
      console.error(err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  /* Bulk delete */
  const handleBulkDelete = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selected }),
      });
      if (response.ok) {
        showToast(`${selected.length} users deleted.`, 'error');
        setSelected([]);
        fetchUsers();
      } else {
        const data = await response.json();
        showToast(data.message || 'Failed to bulk delete users.', 'error');
      }
    } catch (err) {
      showToast('Connection error. Failed to bulk delete users.', 'error');
      console.error(err);
    }
  };

  /* Toggle status */
  const toggleStatus = async (id) => {
    const userToToggle = users.find(u => u.id === id);
    if (!userToToggle) return;
    const newStatus = userToToggle.status === 'Active' ? 'Inactive' : 'Active';

    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        showToast('Status updated.');
        fetchUsers();
      } else {
        const data = await response.json();
        showToast(data.message || 'Failed to update status.', 'error');
      }
    } catch (err) {
      showToast('Connection error. Failed to update status.', 'error');
      console.error(err);
    }
  };

  return (
    <div className="um-root">
      {/* Sidebar */}
      <aside className={`um-sidebar ${sidebarOpen ? 'um-sidebar-open' : ''}`}>
        <div className="um-sidebar-header">
          <span className="um-sidebar-logo">⚡</span>
          <span className="um-sidebar-brand">AdminPortal</span>
        </div>
        <nav className="um-nav">
          {[
            { icon:'🏠', label:'Dashboard', active: false },
            { icon:'👥', label:'Users',     active: true  },
            { icon:'🔒', label:'Roles & Permissions', active: false },
            { icon:'📊', label:'Analytics', active: false },
            { icon:'⚙️', label:'Settings',  active: false },
            { icon:'🔔', label:'Alerts',    active: false },
          ].map(item => (
            <button
              key={item.label}
              className={`um-nav-item ${item.active ? 'um-nav-active' : ''}`}
              id={`um-nav-${item.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              <span className="um-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.active && <span className="um-nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="um-sidebar-footer">
          <div className="um-current-user">
            <div className="um-user-av">{currentUser.avatar}</div>
            <div className="um-user-info">
              <div className="um-user-name">{currentUser.name}</div>
              <div className="um-user-role">{currentUser.role}</div>
            </div>
          </div>
          <button className="um-logout-btn" onClick={onLogout} id="um-logout-btn">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="um-main">
        {/* Top bar */}
        <header className="um-topbar">
          <div className="um-topbar-left">
            <button className="um-hamburger" onClick={() => setSidebarOpen(o => !o)} id="um-hamburger">☰</button>
            <div>
              <h1 className="um-page-title">User Management</h1>
              <p className="um-page-sub">Manage your team members and their access</p>
            </div>
          </div>
          <div className="um-topbar-right">
            <div className="um-topbar-av">{currentUser.avatar}</div>
          </div>
        </header>

        {/* Stats cards */}
        <section className="um-stats-row">
          {[
            { label:'Total Users',  value: stats.total,    icon:'👥', color:'#4F6EF7', bg:'#EEF1FF' },
            { label:'Active',       value: stats.active,   icon:'✅', color:'#22C55E', bg:'#DCFCE7' },
            { label:'Inactive',     value: stats.inactive, icon:'⏸️', color:'#6B7280', bg:'#F3F4F6' },
            { label:'Pending',      value: stats.pending,  icon:'⏳', color:'#F59E0B', bg:'#FEF3C7' },
            { label:'Admins',       value: stats.admins,   icon:'🛡️', color:'#EF4444', bg:'#FEE2E2' },
          ].map(s => (
            <div className="um-stat-card" key={s.label}>
              <div className="um-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div>
                <div className="um-stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="um-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Toolbar */}
        <div className="um-toolbar">
          <div className="um-search-wrap">
            <span className="um-search-icon">🔍</span>
            <input
              id="um-search"
              className="um-search"
              type="text"
              placeholder="Search by name, email or department…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && <button className="um-search-clear" onClick={() => { setSearch(''); setPage(1); }}>✕</button>}
          </div>

          <div className="um-filters">
            {[
              { value: roleFilter,   onChange: v => { setRoleFilter(v);   setPage(1); }, opts: ROLES   },
              { value: statusFilter, onChange: v => { setStatusFilter(v); setPage(1); }, opts: STATUSES },
              { value: deptFilter,   onChange: v => { setDeptFilter(v);   setPage(1); }, opts: DEPTS   },
            ].map((f, i) => (
              <select key={i} className="um-select" value={f.value} onChange={e => f.onChange(e.target.value)}>
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
          </div>

          <div className="um-toolbar-actions">
            {selected.length > 0 && (
              <button 
                className="um-btn-danger" 
                onClick={handleBulkDelete} 
                id="um-bulk-delete-btn"
                disabled={!isAdmin}
                style={{ opacity: isAdmin ? 1 : 0.5, cursor: isAdmin ? 'pointer' : 'not-allowed' }}
                title={!isAdmin ? "Only Super Admins can delete users" : ""}
              >
                🗑️ Delete ({selected.length})
              </button>
            )}
            <button 
              className="um-btn-primary" 
              onClick={openAdd} 
              id="um-add-user-btn"
              disabled={!isAdmin}
              style={{ opacity: isAdmin ? 1 : 0.5, cursor: isAdmin ? 'pointer' : 'not-allowed' }}
              title={!isAdmin ? "Only Super Admins can add users" : ""}
            >
              ＋ Add User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="um-table-wrap">
          {filtered.length === 0 ? (
            <div className="um-empty">
              <div className="um-empty-icon">🔍</div>
              <h3>No users found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <table className="um-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" className="um-cb" checked={allSelected} onChange={toggleAll} /></th>
                    <th>User</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageUsers.map(u => {
                    const badge = statusBadge[u.status] || statusBadge.Inactive;
                    const avColor = avatarColors[u.role] || '#4F6EF7';
                    return (
                      <tr key={u.id} className={`um-tr ${selected.includes(u.id) ? 'um-tr-selected' : ''}`}>
                        <td>
                          <input
                            type="checkbox"
                            className="um-cb"
                            checked={selected.includes(u.id)}
                            onChange={() => toggleOne(u.id)}
                          />
                        </td>
                        <td>
                          <div className="um-user-cell">
                            <div className="um-avatar" style={{ background: avColor }}>{u.avatar}</div>
                            <div>
                              <div className="um-cell-name">{u.name}</div>
                              <div className="um-cell-email">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="um-dept">{u.dept}</span></td>
                        <td>
                          <span className="um-role-badge" style={{ background: avColor + '18', color: avColor }}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className="um-status-badge" style={{ background: badge.bg, color: badge.color }}>
                            <span className="um-status-dot" style={{ background: badge.dot }} />
                            {u.status}
                          </span>
                        </td>
                        <td className="um-joined">{u.joined}</td>
                        <td>
                          <div className="um-actions">
                            <button
                              className="um-action-btn um-action-edit"
                              onClick={() => openEdit(u)}
                              title={!isAdmin ? "Only Super Admins can edit users" : "Edit User"}
                              disabled={!isAdmin}
                              style={{ opacity: isAdmin ? 1 : 0.4, cursor: isAdmin ? 'pointer' : 'not-allowed' }}
                              id={`um-edit-${u.id}`}
                            >✏️</button>
                            <button
                              className={`um-action-btn um-action-toggle ${u.status === 'Pending' ? 'um-action-approve' : ''}`}
                              onClick={() => toggleStatus(u.id)}
                              title={!isAdmin ? "Only Super Admins can change status" : (u.status === 'Active' ? 'Deactivate' : u.status === 'Pending' ? 'Approve & Activate' : 'Activate')}
                              disabled={!isAdmin}
                              style={{ opacity: isAdmin ? 1 : 0.4, cursor: isAdmin ? 'pointer' : 'not-allowed' }}
                              id={`um-toggle-${u.id}`}
                            >
                              {u.status === 'Active' ? '⏸️' : u.status === 'Pending' ? '✅' : '▶️'}
                            </button>
                            <button
                              className="um-action-btn um-action-del"
                              onClick={() => setDeleteConfirm(u)}
                              title={!isAdmin ? "Only Super Admins can delete users" : "Delete User"}
                              disabled={!isAdmin}
                              style={{ opacity: isAdmin ? 1 : 0.4, cursor: isAdmin ? 'pointer' : 'not-allowed' }}
                              id={`um-del-${u.id}`}
                            >🗑️</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="um-pagination">
                <span className="um-page-info">
                  Showing {Math.min((page-1)*PER_PAGE+1, filtered.length)}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length} users
                </span>
                <div className="um-page-btns">
                  <button className="um-page-btn" disabled={page===1} onClick={() => setPage(p => p-1)} id="um-prev-btn">‹</button>
                  {Array.from({length: totalPages}, (_,i) => (
                    <button
                      key={i+1}
                      className={`um-page-btn ${page===i+1 ? 'um-page-active' : ''}`}
                      onClick={() => setPage(i+1)}
                      id={`um-page-${i+1}`}
                    >{i+1}</button>
                  ))}
                  <button className="um-page-btn" disabled={page===totalPages} onClick={() => setPage(p => p+1)} id="um-next-btn">›</button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="um-overlay" onClick={() => setShowModal(false)}>
          <div className="um-modal" onClick={e => e.stopPropagation()}>
            <div className="um-modal-header">
              <h2 className="um-modal-title">{editUser ? '✏️ Edit User' : '➕ Add New User'}</h2>
              <button className="um-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="um-modal-body">
              {/* Preview */}
              <div className="um-modal-preview">
                <div className="um-avatar um-avatar-lg" style={{ background: avatarColors[formData.role] || '#4F6EF7' }}>
                  {getInitials(formData.name) || '?'}
                </div>
                <div>
                  <div className="um-preview-name">{formData.name || 'Full Name'}</div>
                  <div className="um-preview-email">{formData.email || 'email@example.com'}</div>
                </div>
              </div>

              <div className="um-modal-grid">
                {/* Name */}
                <div className={`um-mfield ${formErrors.name ? 'um-mfield-error' : ''}`}>
                  <label className="um-mlabel">Full Name *</label>
                  <input
                    id="um-form-name"
                    className="um-minput"
                    value={formData.name}
                    onChange={e => { setFormData(f=>({...f,name:e.target.value})); setFormErrors(er=>({...er,name:''})); }}
                    placeholder="John Doe"
                  />
                  {formErrors.name && <span className="um-merror">{formErrors.name}</span>}
                </div>

                {/* Email */}
                <div className={`um-mfield ${formErrors.email ? 'um-mfield-error' : ''}`}>
                  <label className="um-mlabel">Email Address *</label>
                  <input
                    id="um-form-email"
                    className="um-minput"
                    type="email"
                    value={formData.email}
                    onChange={e => { setFormData(f=>({...f,email:e.target.value})); setFormErrors(er=>({...er,email:''})); }}
                    placeholder="john@portal.com"
                  />
                  {formErrors.email && <span className="um-merror">{formErrors.email}</span>}
                </div>

                {/* Role */}
                <div className="um-mfield">
                  <label className="um-mlabel">Role</label>
                  <select
                    id="um-form-role"
                    className="um-mselect"
                    value={formData.role}
                    onChange={e => setFormData(f=>({...f,role:e.target.value}))}
                  >
                    {['Super Admin','Editor','Viewer'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>

                {/* Status */}
                <div className="um-mfield">
                  <label className="um-mlabel">Status</label>
                  <select
                    id="um-form-status"
                    className="um-mselect"
                    value={formData.status}
                    onChange={e => setFormData(f=>({...f,status:e.target.value}))}
                  >
                    {['Active','Inactive','Pending'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Department */}
                <div className="um-mfield um-mfield-full">
                  <label className="um-mlabel">Department</label>
                  <select
                    id="um-form-dept"
                    className="um-mselect"
                    value={formData.dept}
                    onChange={e => setFormData(f=>({...f,dept:e.target.value}))}
                  >
                    {['Engineering','Marketing','Sales','Design','HR','Finance','Leadership'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="um-modal-footer">
              <button className="um-btn-outline" onClick={() => setShowModal(false)} id="um-cancel-btn">Cancel</button>
              <button className="um-btn-primary" onClick={handleSave} id="um-save-btn">
                {editUser ? '💾 Save Changes' : '➕ Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="um-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="um-modal um-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="um-del-icon">⚠️</div>
            <h3 className="um-del-title">Delete User</h3>
            <p className="um-del-sub">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="um-modal-footer">
              <button className="um-btn-outline" onClick={() => setDeleteConfirm(null)} id="um-del-cancel-btn">Cancel</button>
              <button className="um-btn-danger" onClick={() => handleDelete(deleteConfirm.id)} id="um-del-confirm-btn">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`um-toast um-toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '🗑️'} {toast.msg}
        </div>
      )}
    </div>
  );
}
