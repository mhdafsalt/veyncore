'use client';

import React, { useState } from 'react';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { FaWhatsapp, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submittedMethod, setSubmittedMethod] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide your message.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const text = [
      `*New Inquiry via VEYNCORE Contact Form*`,
      `*Name:* ${formData.name}`,
      `*Email:* ${formData.email || 'Not provided'}`,
      `*Phone:* ${formData.phone || 'Not provided'}`,
      `*Subject:* ${formData.subject}`,
      `*Message:*`,
      formData.message,
    ].join('\n');

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setSubmittedMethod('WhatsApp');
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const subjectLine = `[VEYNCORE Inquiry] ${formData.subject} - ${formData.name}`;
    const bodyText = [
      `Name: ${formData.name}`,
      `Email: ${formData.email || 'Not provided'}`,
      `Phone: ${formData.phone || 'Not provided'}`,
      `Subject: ${formData.subject}`,
      ``,
      `Message:`,
      formData.message,
    ].join('\n');

    window.location.href = `mailto:veyncore.in@gmail.com?subject=${encodeURIComponent(
      subjectLine
    )}&body=${encodeURIComponent(bodyText)}`;
    setSubmittedMethod('Email');
  };

  return (
    <div className="contact-page">
      {/* 1. Header with activeCategory null on /pages/* */}
      <StoreHeader
        initialCategory={null}
        showMainCategories={true}
        showSubCategories={false}
      />

      <main className="contact-page__container">
        {/* Page Hero Header */}
        <header className="contact-page__header">
          <h1 className="contact-page__title">CONTACT US</h1>
          <p className="contact-page__subtitle">
            HAVE A QUESTION REGARDING SIZING, AN ACTIVE ORDER, OR A NEW DROP? REACH OUT DIRECTLY TO THE VEYNCORE CONCIERGE.
          </p>
        </header>

        {/* Interactive Contact Form */}
        <section className="contact-form-section" aria-label="Contact form">
          {submittedMethod ? (
            <div className="contact-success-box" role="alert">
              <FaCheckCircle className="contact-success-icon" />
              <h3 className="contact-success-title">Message Prepared!</h3>
              <p className="contact-success-text">
                Your message has been initiated via {submittedMethod}. Our concierge team typically reviews and replies within minutes during operational hours.
              </p>
              <button
                type="button"
                className="contact-reset-btn"
                onClick={() => {
                  setSubmittedMethod(null);
                  setErrors({});
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: 'General Inquiry',
                    message: '',
                  });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" noValidate onSubmit={handleWhatsAppSubmit}>
              <div className="contact-form__row">
                <div className="contact-form__group">
                  <label htmlFor="contact-name" className="contact-form__label">
                    YOUR NAME <span className="contact-required">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    className={`contact-form__input ${errors.name ? 'contact-form__input--error' : ''}`}
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <span className="contact-form__field-error" role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="contact-form__group">
                  <label htmlFor="contact-email" className="contact-form__label">
                    EMAIL ADDRESS <span className="contact-required">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    className={`contact-form__input ${errors.email ? 'contact-form__input--error' : ''}`}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <span className="contact-form__field-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="contact-form__row">
                <div className="contact-form__group">
                  <label htmlFor="contact-phone" className="contact-form__label">
                    PHONE / WHATSAPP NUMBER
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    className="contact-form__input"
                    placeholder="+91 99999999"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-form__group">
                  <label htmlFor="contact-subject" className="contact-form__label">
                    INQUIRY SUBJECT
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    className="contact-form__select"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Tracking">Order Tracking</option>
                    <option value="Sizing & Fit Advice">Sizing & Fit Advice</option>
                    <option value="Return or Exchange">Return or Exchange Request</option>
                    <option value="Launch Sale Inquiry">Launch Sale Inquiry</option>
                    <option value="Collaboration / PR">Collaboration / PR</option>
                  </select>
                </div>
              </div>

              <div className="contact-form__group">
                <label htmlFor="contact-message" className="contact-form__label">
                  MESSAGE <span className="contact-required">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  className={`contact-form__textarea ${errors.message ? 'contact-form__input--error' : ''}`}
                  placeholder="Tell us about your inquiry, order details, or sizing question..."
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && (
                  <span className="contact-form__field-error" role="alert">
                    {errors.message}
                  </span>
                )}
              </div>

              <div className="contact-form__actions">
                <button
                  type="submit"
                  className="contact-form__btn contact-form__btn--whatsapp"
                >
                  <FaWhatsapp /> SEND VIA WHATSAPP (INSTANT)
                </button>
                <button
                  type="button"
                  className="contact-form__btn contact-form__btn--email"
                  onClick={handleEmailSubmit}
                >
                  <FaPaperPlane /> SEND VIA EMAIL
                </button>
              </div>
            </form>
          )}
        </section>
      </main>

      {/* Standard Footer */}
      <Footer />
    </div>
  );
}
