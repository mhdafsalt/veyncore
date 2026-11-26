import React from 'react';
import LegalPage from '@/components/LegalPage/LegalPage';

export const metadata = {
  title: 'TERMS & CONDITIONS | VEYNCORE',
  description:
    'Read the official Terms and Conditions governing your use of the VEYNCORE website, catalog purchases, and services.',
};

const termsSections = [
  {
    id: 'introduction',
    title: 'Introduction & Acceptance of Terms',
    content: (
      <>
        <p>
          Welcome to <strong>VEYNCORE</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), accessible via <strong>veyncorein.vercel.app</strong> and our affiliated online touchpoints. By accessing, browsing, or purchasing from our platform, you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions (&ldquo;Terms&rdquo;).
        </p>
        <p>
          These Terms apply to all visitors, registered accounts, shoppers, and contributors of content. If you do not agree with any part of these Terms, you must discontinue your use of our platform immediately.
        </p>
        <div className="legal-callout">
          <p className="legal-callout__title">Key Agreement</p>
          <p className="legal-callout__text">
            Using our website, creating an account, or placing an order signifies your unconditional acceptance of these Terms, our Privacy Policy, Refund Policy, and Shipping Policy.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Account Security',
    content: (
      <>
        <p>
          To purchase products or register an account with VEYNCORE, you must be at least 18 years of age or the age of majority in your jurisdiction. Individuals under 18 may only use our platform under the direct supervision of a parent or legal guardian.
        </p>
        <p>
          When you create an account, you agree to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete personal and contact details during registration and checkout.</li>
          <li>Maintain the confidentiality of your login credentials and restrict unauthorized access to your account.</li>
          <li>Promptly notify VEYNCORE customer support of any suspected security breaches or unauthorized use of your credentials.</li>
        </ul>
        <p>
          VEYNCORE reserves the right to suspend or terminate accounts that provide fraudulent, misleading, or abusive information.
        </p>
      </>
    ),
  },
  {
    id: 'products-pricing',
    title: 'Products, Sizing & Pricing',
    content: (
      <>
        <p>
          VEYNCORE designs and produces contemporary raw denim, streetwear silhouettes (including baggy, wide, bootcut, and straight cuts), and utilitarian objects (bags, chains, caps, shades, and accessories).
        </p>
        <p>
          <strong>Product Depictions:</strong> We strive to display product colors, fabric textures, and fits as accurately as possible. However, slight variations may occur due to display monitor calibrations, natural batch dye variances, and specialized denim washing techniques.
        </p>
        <p>
          <strong>Pricing:</strong> All prices listed on our platform are displayed in Indian Rupees (INR &bull; ₹) and are inclusive of applicable goods and services taxes (GST), unless specified otherwise. We reserve the right to revise product prices, promotional discounts, or drop allocations at any time without prior notice.
        </p>
      </>
    ),
  },
  {
    id: 'orders-acceptance',
    title: 'Order Placement & Contract Formation',
    content: (
      <>
        <p>
          Placing an order on VEYNCORE constitutes an offer to purchase the selected items. Receipt of an order confirmation (via email, SMS, or WhatsApp) confirms that we have received your request, but does not signify final acceptance of your order.
        </p>
        <p>
          We reserve the right to refuse, limit, or cancel any order for reasons including, but not limited to:
        </p>
        <ul>
          <li>Unavailability of raw material or stock depletion in our inventory.</li>
          <li>Inaccuracies or errors in product descriptions, size metrics, or pricing.</li>
          <li>Suspected fraudulent, automated, or unauthorized payment attempts.</li>
          <li>Unserviceable delivery pin codes or recurring failed delivery attempts.</li>
        </ul>
        <p>
          If your order is cancelled after payment deduction, the full amount will be automatically reversed to your original payment source.
        </p>
      </>
    ),
  },
  {
    id: 'payments',
    title: 'Payment Gateways & Cash on Delivery (COD)',
    content: (
      <>
        <p>
          We offer secure payment options to ensure a frictionless shopping experience:
        </p>
        <ul>
          <li><strong>Online Payments:</strong> Major credit cards, debit cards, Net Banking, UPI (Google Pay, PhonePe, Paytm), and certified digital wallets processed through encrypted, PCI-DSS compliant gateways.</li>
          <li><strong>Cash on Delivery (COD):</strong> Available across eligible pin codes throughout India. COD orders may be subject to a secondary OTP or WhatsApp confirmation call before dispatch.</li>
        </ul>
        <div className="legal-callout legal-callout--accent">
          <p className="legal-callout__title">Safe Transactions</p>
          <p className="legal-callout__text">
            VEYNCORE never stores your credit/debit card numbers or CVV. All transactions are securely encrypted and handled directly by RBI-authorized payment processors.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property & Brand Ownership',
    content: (
      <>
        <p>
          All intellectual property on this platform—including trademarks, brand logos, brand names (&ldquo;VEYNCORE&rdquo;, &ldquo;VEYN-SELECTS&rdquo;, &ldquo;VEYN-OBJECTS&rdquo;), garment patterns, photographic lookbooks, typography, iconography, and software code—is the exclusive property of VEYNCORE.
        </p>
        <p>
          You may not reproduce, duplicate, copy, sell, resell, distribute, or exploit any portion of our intellectual property or website materials without express prior written consent from VEYNCORE.
        </p>
      </>
    ),
  },
  {
    id: 'prohibited-uses',
    title: 'Prohibited Activities & Conduct',
    content: (
      <>
        <p>
          When utilizing our storefront and services, you agree not to:
        </p>
        <ul>
          <li>Use the platform for any unlawful purpose or in violation of Indian cyber laws and regulations.</li>
          <li>Deploy automated bots, scrapers, crawlers, or high-volume scripts to access or extract catalog data.</li>
          <li>Attempt to breach or probe vulnerabilities in our server security, database, or API infrastructure.</li>
          <li>Impersonate any person, brand representative, or entity, or falsify your geographical location.</li>
          <li>Place fraudulent or speculative orders intended for bulk reselling without wholesale authorization.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'limitation-liability',
    title: 'Limitation of Liability & Warranty Disclaimer',
    content: (
      <>
        <p>
          VEYNCORE provides the platform, products, and services on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied.
        </p>
        <p>
          To the maximum extent permitted under applicable law, VEYNCORE and its founders, affiliates, employees, and suppliers shall not be liable for any indirect, incidental, punitive, special, or consequential damages resulting from:
        </p>
        <ul>
          <li>Your access to or inability to access the platform.</li>
          <li>Courier delays, customs hold-ups, or logistical disruptions caused by third-party delivery partners.</li>
          <li>Any unauthorized access to our secure servers or data transmissions.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law & Jurisdiction',
    content: (
      <>
        <p>
          These Terms and Conditions shall be governed by, construed, and enforced in accordance with the laws of the Republic of India, without regard to conflict of law principles.
        </p>
        <p>
          Any disputes, legal claims, or controversies arising out of or related to these Terms, purchases, or services shall be subject to the exclusive jurisdiction of the competent courts in Kerala, India.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Updates & Legal Contact',
    content: (
      <>
        <p>
          We reserve the right to revise, update, or replace any part of these Terms at our discretion. Any revisions will take effect immediately upon being posted to this URL with an updated revision date.
        </p>
        <p>
          For legal inquiries, terms clarification, or formal correspondence, please contact:
        </p>
        <p>
          <strong>VEYNCORE Legal Dept.</strong><br />
          Email: <a href="mailto:support@veyncore.com" style={{ color: '#0f172a', fontWeight: 600 }}>support@veyncore.com</a><br />
          WhatsApp Concierge: +91 94463 91166<br />
          Official Website: <a href="https://veyncorein.vercel.app" style={{ color: '#0f172a', fontWeight: 600 }}>veyncorein.vercel.app</a>
        </p>
      </>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="TERMS & CONDITIONS"
      subtitle="Operating terms, ordering guidelines, and legal framework governing your interactions with VEYNCORE."
      lastUpdated="November 2026"
      sections={termsSections}
    />
  );
}
