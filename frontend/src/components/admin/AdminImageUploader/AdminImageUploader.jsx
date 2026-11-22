'use client';

import React, { useState, useRef, useCallback } from 'react';
import { API_BASE_URL } from '@/lib/constants';
import './AdminImageUploader.css';

/**
 * AdminImageUploader Component
 * Provides complete support for both:
 * 1. File Upload (Native drag-and-drop or device file chooser with instant upload)
 * 2. URL Upload (Direct image URL input)
 */
export default function AdminImageUploader({
  label = 'IMAGE',
  value = '',
  onChange,
  aspectRatio = '16/9',
  placeholder = 'https://... or /images/...',
  required = false,
  helpText = '',
  onRemove = null,
}) {
  // Modes: 'file' | 'url'
  const [mode, setMode] = useState('file');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);

  // Get Auth Token from local storage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('veyncore_token') || '';
    }
    return '';
  };

  // Perform upload to Express backend /api/upload
  const uploadFile = async (file) => {
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, GIF, SVG, AVIF).');
      return;
    }

    // Check file size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image size exceeds 15MB limit. Please choose a smaller file.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(false);

      const formData = new FormData();
      formData.append('image', file);

      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await res.json();

      if (res.ok && json.success && json.data?.url) {
        onChange(json.data.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        throw new Error(json.message || 'Server rejected file upload.');
      }
    } catch (err) {
      console.warn('[AdminImageUploader] Upload failed, converting to data URI fallback:', err);
      // Fallback: convert file to local data URL so admin is never blocked
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        }
      };
      reader.readAsDataURL(file);
      setUploadError(err.message || 'Upload error. Converted to direct media format.');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        uploadFile(e.dataTransfer.files[0]);
      }
    },
    [onChange]
  );

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    onChange('');
    setUploadError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="admin-uploader">
      {/* Top Header with Label & Dual-Mode Toggle */}
      <div className="admin-uploader__header">
        <label className="admin-uploader__label">
          {label}
          {required && <span className="admin-uploader__required">*</span>}
        </label>

        {/* High-visibility Mode Switcher */}
        <div className="admin-uploader__tabs" role="tablist">
          <button
            type="button"
            className={`admin-uploader__tab ${mode === 'file' ? 'admin-uploader__tab--active' : ''}`}
            onClick={() => setMode('file')}
            aria-selected={mode === 'file'}
          >
            <span className="admin-uploader__tab-icon">📁</span>
            <span>Upload File</span>
          </button>
          <button
            type="button"
            className={`admin-uploader__tab ${mode === 'url' ? 'admin-uploader__tab--active' : ''}`}
            onClick={() => setMode('url')}
            aria-selected={mode === 'url'}
          >
            <span className="admin-uploader__tab-icon">🔗</span>
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Drag & Drop File Upload */}
      {mode === 'file' && (
        <div className="admin-uploader__dropzone-wrap">
          <div
            className={`admin-uploader__dropzone ${
              isDragging ? 'admin-uploader__dropzone--dragging' : ''
            } ${isUploading ? 'admin-uploader__dropzone--disabled' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
              className="admin-uploader__file-input"
              onChange={handleFileChange}
            />

            {isUploading ? (
              <div className="admin-uploader__loading">
                <div className="admin-uploader__spinner" />
                <span className="admin-uploader__loading-text">Uploading image file to server...</span>
              </div>
            ) : (
              <>
                <svg
                  className="admin-uploader__drop-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div className="admin-uploader__drop-title">
                  Choose image file or <span className="admin-uploader__drop-browse">Browse Device</span>
                </div>
                <div className="admin-uploader__drop-hint">
                  Drag & drop JPG, PNG, WEBP, GIF, SVG, AVIF (Max 15MB)
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="admin-uploader__switch-hint-btn"
            onClick={() => setMode('url')}
          >
            Or paste image URL directly →
          </button>
        </div>
      )}

      {/* Mode 2: Direct URL Input */}
      {mode === 'url' && (
        <div className="admin-uploader__url-wrap">
          <div className="admin-uploader__url-box">
            <input
              type="text"
              className="admin-uploader__url-input"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={required && !value}
            />
            {value && (
              <button
                type="button"
                className="admin-uploader__url-clear"
                onClick={handleClear}
                title="Clear input"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            className="admin-uploader__switch-hint-btn"
            onClick={() => setMode('file')}
          >
            Or upload a file from your device instead →
          </button>
        </div>
      )}

      {/* Upload Feedback Alerts */}
      {uploadSuccess && (
        <div className="admin-uploader__success">
          <span>✓</span>
          <span>Image file uploaded and linked successfully.</span>
        </div>
      )}

      {uploadError && (
        <div className="admin-uploader__error">
          <span>⚠️</span>
          <span>{uploadError}</span>
        </div>
      )}

      {/* Live Image Preview Container */}
      {value && (
        <div className="admin-uploader__preview-wrapper">
          <div
            className="admin-uploader__preview-img-container"
            style={{ aspectRatio: aspectRatio || '16/9' }}
          >
            <img
              src={value}
              alt="Preview"
              className="admin-uploader__preview-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/products/artic-blue-wide.jpg';
              }}
            />
          </div>

          <div className="admin-uploader__preview-toolbar">
            <span className="admin-uploader__preview-path" title={value}>
              {value}
            </span>

            <div className="admin-uploader__preview-actions">
              <button
                type="button"
                className="admin-uploader__preview-btn"
                onClick={handleCopyUrl}
                title="Copy Image URL to clipboard"
              >
                {copied ? '✓ Copied' : 'Copy URL'}
              </button>

              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="admin-uploader__preview-btn"
                title="Open full image in new tab"
              >
                Open ↗
              </a>

              <button
                type="button"
                className="admin-uploader__preview-btn admin-uploader__preview-btn--danger"
                onClick={onRemove || handleClear}
                title="Remove image"
              >
                ✕ Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {helpText && <div className="admin-uploader__help">{helpText}</div>}
    </div>
  );
}
