import React from 'react';
import LegalPage from '@/components/LegalPage/LegalPage';

export const metadata = {
  title: 'PRIVACY POLICY | VEYNCORE',
  description:
    'Learn how VEYNCORE collects, protects, processes, and respects your personal data, payment security, and digital privacy.',
};

const privacySections = [
  {
    id: 'commitment',
    title: 'Our Privacy Commitment',
    content: (
      <>
        <p>
          At <strong>VEYNCORE</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), we take your privacy and personal data protection with the utmost seriousness. This Privacy Policy details how we collect, utilize, store, and safeguard the information you provide when visiting our website, signing up for an account, or purchasing our contemporary denim and objects.
        </p>
        <p>
          We adhere to applicable data privacy principles under Indian Information Technology laws and globally recognized digital security standards.
        </p>
        <div className="legal-callout legal-callout--accent">
          <p className="legal-callout__title">No Data Brokering</p>
          <p className="legal-callout__text">
            VEYNCORE does not sell, rent, or lease your personal identification or contact details to third-party advertisers or data aggregators. Ever.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'information-collected',
    title: 'Information We Collect',
    content: (
      <>
        <p>
          We collect personal and transactional data through direct interactions and automated analytics when you navigate our platform:
        </p>
        <ul>
          <li><strong>Identity &amp; Contact Details:</strong> Name, phone number, delivery address, billing address, and email address provided during checkout or account registration.</li>
          <li><strong>Transaction Records:</strong> Products purchased, sizes selected, total amounts, date/time of transactions, and delivery receipts.</li>
          <li><strong>Communication Logs:</strong> Customer support requests submitted via email, WhatsApp concierge chats, and order verification calls.</li>
          <li><strong>Device &amp; Technical Identifiers:</strong> IP address, device type, operating system, browser version, approximate location, referring URLs, and page navigation patterns.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use-data',
    title: 'How We Use Your Information',
    content: (
      <>
        <p>
          We use your data solely for legitimate business operations and enhancing your shopping experience:
        </p>
        <ul>
          <li><strong>Order Processing &amp; Fulfillment:</strong> Preparing, packaging, dispatching, and tracking your shipments with our authorized logistics partners.</li>
          <li><strong>Customer Support:</strong> Assisting you with size guidance, order modifications, address corrections, returns, and refunds.</li>
          <li><strong>Account Management:</strong> Maintaining your VEYNCORE member profile, order history, VIP benefits, and authentication sessions.</li>
          <li><strong>Fraud Prevention:</strong> Detecting, preventing, and investigating unauthorized access, payment fraud, or illegal abuse.</li>
          <li><strong>Service Improvements:</strong> Analyzing website speed, Core Web Vitals, and user journeys to optimize platform performance.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies-tracking',
    title: 'Cookies & Analytics',
    content: (
      <>
        <p>
          We use essential and functional cookies, local storage tokens, and web analytics tools to ensure our website operates smoothly:
        </p>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for cart persistence, secure session authentication, and smooth page navigation.</li>
          <li><strong>Performance &amp; Analytics:</strong> Anonymous metrics that help us evaluate page load times, layout stability, and popular product drops.</li>
        </ul>
        <p>
          You can configure your browser to decline or delete cookies. Note that disabling essential cookies may impact your ability to maintain items in your shopping bag or sign into your account.
        </p>
      </>
    ),
  },
  {
    id: 'payment-security',
    title: 'Payment & Financial Data Protection',
    content: (
      <>
        <p>
          All electronic transactions are processed through encrypted, certified payment gateways compliant with <strong>Payment Card Industry Data Security Standards (PCI-DSS)</strong>.
        </p>
        <p>
          VEYNCORE does not collect, capture, or store your credit/debit card numbers, PINs, or CVV codes on our servers. Financial authorization is handled exclusively in real-time by licensed banks and payment institutions.
        </p>
      </>
    ),
  },
  {
    id: 'third-party-disclosure',
    title: 'Third-Party Service Providers',
    content: (
      <>
        <p>
          We only share necessary portions of your personal data with trusted third-party providers who assist in our operational workflows:
        </p>
        <ul>
          <li><strong>Logistics &amp; Courier Partners:</strong> Name, phone number, and physical shipping address shared with licensed couriers (e.g. Delhivery, Bluedart, Shiprocket) for delivery and pickup.</li>
          <li><strong>Payment Processors:</strong> Necessary transaction amounts and customer identifiers required to complete payment captures and refunds.</li>
          <li><strong>Cloud Infrastructure:</strong> Encrypted hosting providers and content delivery networks (Vercel, MongoDB Atlas, Cloudinary) that power our platform.</li>
        </ul>
        <p>
          All third-party partners are bound by strict non-disclosure obligations and are prohibited from utilizing your personal data for any secondary purposes.
        </p>
      </>
    ),
  },
  {
    id: 'data-retention',
    title: 'Data Retention & Security Safeguards',
    content: (
      <>
        <p>
          We implement rigorous technical and organizational security controls—including TLS/SSL cryptographic encryption, firewalled server clusters, access-restricted database authentication, and periodic security audits—to safeguard your information from loss, theft, or unauthorized access.
        </p>
        <p>
          We retain your transaction records only for as long as required to fulfill tax, accounting, warranty, and statutory obligations under Indian commercial law.
        </p>
      </>
    ),
  },
  {
    id: 'user-rights',
    title: 'Your Privacy Rights & Choices',
    content: (
      <>
        <p>
          As a valued VEYNCORE customer, you possess the right to:
        </p>
        <ul>
          <li>Access and review the personal information associated with your account.</li>
          <li>Request corrections or updates to inaccurate delivery or contact details.</li>
          <li>Opt-out of non-essential promotional SMS, WhatsApp announcements, or email updates at any time.</li>
          <li>Request the closure of your account and deletion of non-essential personal information, subject to statutory record-keeping requirements.</li>
        </ul>
        <p>
          To exercise any of these rights, simply email our dedicated privacy officer at <a href="mailto:veyncore.in@gmail.com" style={{ color: '#0f172a', fontWeight: 600 }}>veyncore.in@gmail.com</a>.
        </p>
      </>
    ),
  },
  {
    id: 'policy-updates',
    title: 'Policy Updates & Contact Details',
    content: (
      <>
        <p>
          We may revise this Privacy Policy periodically to reflect changes in our operational procedures or relevant legal standards. The revised policy will be posted on this page with an updated &ldquo;Last Revised&rdquo; timestamp.
        </p>
        <p>
          For privacy concerns, data inquiries, or formal requests:
        </p>
        <p>
          <strong>VEYNCORE Data Protection Officer</strong><br />
          Email: <a href="mailto:veyncore.in@gmail.com" style={{ color: '#0f172a', fontWeight: 600 }}>veyncore.in@gmail.com</a><br />
          WhatsApp Support: +91 94463 91166<br />
          Official Website: <a href="https://veyncore.in" target="_blank" rel="noopener noreferrer" style={{ color: '#0f172a', fontWeight: 600 }}>veyncore.in</a>
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="PRIVACY POLICY"
      subtitle="How VEYNCORE collects, protects, and handles your personal information with absolute integrity."
      lastUpdated="November 2026"
      sections={privacySections}
    />
  );
}
