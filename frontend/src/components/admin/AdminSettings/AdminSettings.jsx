'use client';

import React from 'react';
import './AdminSettings.css';

export default function AdminSettings({
  settings,
  onSettingsChange,
  onSave,
  saving,
}) {
  return (
    <div className="admin-settings">
      <div className="admin-settings__card">
        <h3 className="admin-settings__title">STORE CONFIGURATION &amp; CONCIERGE</h3>
        <p className="admin-settings__desc">
          Configure live store parameters. Changes take effect across the storefront and WhatsApp
          checkout immediately.
        </p>

        <form onSubmit={onSave} className="admin-settings__form">
          <div className="admin-settings__form-group">
            <label className="admin-settings__label">
              DIRECT WHATSAPP CONCIERGE PHONE NUMBER
            </label>
            <input
              type="text"
              className="admin-settings__input"
              value={settings.whatsappNumber || ''}
              onChange={(e) =>
                onSettingsChange({ ...settings, whatsappNumber: e.target.value })
              }
              placeholder="e.g. 919876543210 (country code + phone number without + or spaces)"
              required
            />
            <small className="admin-settings__hint">
              All &ldquo;Direct WhatsApp Order&rdquo; buttons on PDP and Cart Drawer dispatch
              directly to this contact.
            </small>
          </div>

          <div className="admin-settings__form-group">
            <label className="admin-settings__label">
              TOP ANNOUNCEMENT BAR BANNER MESSAGE
            </label>
            <input
              type="text"
              className="admin-settings__input"
              value={settings.announcementText || ''}
              onChange={(e) =>
                onSettingsChange({ ...settings, announcementText: e.target.value })
              }
              required
            />
          </div>

          <div className="admin-settings__form-group">
            <label className="admin-settings__label">
              CUSTOMER SUPPORT &amp; CONCIERGE EMAIL
            </label>
            <input
              type="email"
              className="admin-settings__input"
              value={settings.supportEmail || ''}
              onChange={(e) =>
                onSettingsChange({ ...settings, supportEmail: e.target.value })
              }
              required
            />
          </div>

          <div className="admin-settings__form-group">
            <label className="admin-settings__label">
              VIP SYNDICATE SECRET DISCOUNT (%)
            </label>
            <input
              type="number"
              className="admin-settings__input"
              value={settings.vipDiscountPercent ?? 10}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  vipDiscountPercent: Number(e.target.value),
                })
              }
              min={0}
              max={100}
            />
          </div>

          <button
            type="submit"
            className="admin-settings__save-btn"
            disabled={saving}
          >
            {saving ? 'SAVING CONFIGURATION...' : 'SAVE SETTINGS'}
          </button>
        </form>
      </div>
    </div>
  );
}
