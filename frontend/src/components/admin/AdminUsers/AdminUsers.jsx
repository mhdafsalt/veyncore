'use client';

import React from 'react';
import './AdminUsers.css';

export default function AdminUsers({
  users,
  currentUser,
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  vipFilter,
  onVipFilterChange,
  onToggleRole,
  onToggleVip,
  onDeleteUser,
}) {
  return (
    <div className="admin-users">
      {/* 1. Users Toolbar */}
      <div className="admin-users__toolbar">
        <div className="admin-users__filters">
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            className="admin-users__input admin-users__input--search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <select
            className="admin-users__select"
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="user">Standard Users</option>
          </select>

          <select
            className="admin-users__select"
            value={vipFilter}
            onChange={(e) => onVipFilterChange(e.target.value)}
          >
            <option value="all">All VIP Statuses</option>
            <option value="vip">VIP Notifications</option>
            <option value="standard">Standard</option>
          </select>
        </div>
      </div>

      {/* 2. Users Table */}
      <div className="admin-users__table-wrap">
        <table className="admin-users__table">
          <thead>
            <tr>
              <th>USER</th>
              <th>EMAIL ADDRESS</th>
              <th>MOBILE NUMBER</th>
              <th>ROLE</th>
              <th>VIP SYNDICATE</th>
              <th>REGISTERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((u) => {
                const isSelf =
                  currentUser && (currentUser._id === u._id || currentUser.email === u.email);
                return (
                  <tr key={u._id}>
                    <td>
                      <div className="admin-users__user-cell">
                        <div className="admin-users__avatar">
                          {(u.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="admin-users__name">{u.name}</span>
                        {isSelf && <span className="admin-users__self-badge">(YOU)</span>}
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.mobileNumber || '—'}</td>
                    <td>
                      <button
                        type="button"
                        className={`admin-users__badge-btn ${
                          u.role === 'admin'
                            ? 'admin-users__badge-btn--admin'
                            : 'admin-users__badge-btn--user'
                        }`}
                        onClick={() => !isSelf && onToggleRole(u)}
                        disabled={isSelf}
                        title={
                          isSelf
                            ? 'Cannot modify your own active account'
                            : 'Click to toggle admin role'
                        }
                      >
                        {u.role.toUpperCase()} {isSelf ? '' : '⇄'}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`admin-users__badge-btn ${
                          u.vipNotifications
                            ? 'admin-users__badge-btn--vip'
                            : 'admin-users__badge-btn--standard'
                        }`}
                        onClick={() => onToggleVip(u)}
                        title="Click to toggle VIP subscription"
                      >
                        {u.vipNotifications ? '★ VIP' : 'STANDARD'} ⇄
                      </button>
                    </td>
                    <td style={{ color: '#71717a' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      {!isSelf && (
                        <button
                          type="button"
                          className="admin-users__delete-btn"
                          onClick={() => onDeleteUser(u)}
                          title="Delete User Account"
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#71717a' }}>
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
