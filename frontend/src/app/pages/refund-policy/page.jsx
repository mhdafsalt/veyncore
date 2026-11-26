import React from 'react';
import LegalPage from '@/components/LegalPage/LegalPage';

export const metadata = {
  title: 'REFUND & CANCELLATION POLICY | VEYNCORE',
  description:
    'Review the official 7-Day Easy Returns, Exchanges, and Refund Policy for VEYNCORE contemporary raw denim and objects.',
};

const refundSections = [
  {
    id: 'guarantee',
    title: '7-Day Easy Returns & Exchanges Guarantee',
    content: (
      <>
        <p>
          At <strong>VEYNCORE</strong>, our commitment to architectural design, raw denim craftsmanship, and customer satisfaction is paramount. If you are not completely satisfied with the fit, size, or styling of your purchase, you may initiate a return or exchange within <strong>7 days from the verified delivery date</strong>.
        </p>
        <div className="legal-callout legal-callout--accent">
          <p className="legal-callout__title">7-Day Window</p>
          <p className="legal-callout__text">
            Returns or size exchanges must be requested within 7 calendar days of delivery. Doorstep reverse pickup is arranged by VEYNCORE at no extra cost across eligible pin codes.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Garment Condition Requirements',
    content: (
      <>
        <p>
          To qualify for a full refund or size replacement, returned items must meet the following strict standards:
        </p>
        <ul>
          <li><strong>Unworn &amp; Unwashed:</strong> Garments must be in pristine, brand-new condition without perfumes, odors, makeup marks, body oils, or creasing from prolonged wear.</li>
          <li><strong>Original Tags Intact:</strong> All original brand tags, woven identity labels, size identifiers, and care instructions must remain securely attached in their original placement.</li>
          <li><strong>Complete Packaging:</strong> Items must be returned with their original dust bags, protective garment sleeves, and branded polybag packaging.</li>
          <li><strong>Unaltered Denim:</strong> Hemmed, distressed, or customized denim cannot be returned or exchanged.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'non-returnable',
    title: 'Non-Returnable & Final Sale Items',
    content: (
      <>
        <p>
          For hygiene, hygiene seals, and limited-edition authenticity, certain items are non-returnable:
        </p>
        <ul>
          <li>Intimates, undergarments, and socks.</li>
          <li>Jewelry, chains, bracelets, and caps with broken hygiene/security seals.</li>
          <li>Items marked as &ldquo;Final Sale,&rdquo; &ldquo;Archive Drop,&rdquo; or specialized promotional gift sets.</li>
          <li>Free promotional merchandise or complimentary gifts included with orders.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'return-process',
    title: 'Step-by-Step Return Process',
    content: (
      <>
        <p>
          Initiating a return or exchange with VEYNCORE is effortless:
        </p>
        <ol>
          <li>
            <strong>Submit Your Request:</strong> Contact our support team via WhatsApp Concierge at <strong>+91 94463 91166</strong> or email <strong>support@veyncore.com</strong> within 7 days of delivery. State your Order ID and reason for return or preferred replacement size.
          </li>
          <li>
            <strong>Reverse Pickup Scheduled:</strong> Once approved, our courier partner will arrive at your original delivery address within 24 to 48 hours to collect the securely packaged parcel.
          </li>
          <li>
            <strong>Handover &amp; Acknowledgment:</strong> Ensure the courier agent scans and hands over a physical or digital pickup acknowledgment slip for tracking.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: 'inspection-refunds',
    title: 'Inspection & Refund Timelines',
    content: (
      <>
        <p>
          Upon arrival at our fulfillment center, your returned item undergoes a thorough Quality Assurance (QA) inspection within <strong>24 to 48 hours</strong>.
        </p>
        <p>
          Once inspection confirms the item meets our return standards:
        </p>
        <ul>
          <li><strong>Prepaid Orders (Cards, UPI, Net Banking):</strong> Refunds are processed immediately back to your original payment method. Depending on your issuing bank, the credit reflects in your account within <strong>3 to 5 business days</strong>.</li>
          <li><strong>Cash on Delivery (COD) Orders:</strong> Refunds are disbursed directly to your verified Bank Account (via NEFT/IMPS) or UPI ID. Our concierge team will reach out to collect your secure transfer details once the item clears inspection.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'exchanges',
    title: 'Size & Fit Exchanges',
    content: (
      <>
        <p>
          Need a different waist size, length, or silhouette? We provide <strong>one complimentary size exchange per order</strong>.
        </p>
        <p>
          If your preferred replacement size is out of stock in our active drop, you may opt for:
        </p>
        <ul>
          <li>A direct store credit voucher with lifetime validity across any future VEYN-SELECTS or VEYN-OBJECTS drops.</li>
          <li>A full refund back to your original payment method or bank account.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'damaged-defective',
    title: 'Damaged, Defective or Incorrect Items',
    content: (
      <>
        <p>
          Each VEYNCORE piece undergoes multiple quality audits before dispatch. In the rare event you receive a damaged, defective, or incorrect product:
        </p>
        <ul>
          <li>Please notify us within <strong>48 hours of delivery</strong> with clear photographs or a short video demonstrating the defect.</li>
          <li>We will immediately arrange a priority replacement shipment at zero expense, or issue an expedited full refund without delay.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cancellations',
    title: 'Order Cancellation Guidelines',
    content: (
      <>
        <p>
          You may cancel your order free of charge at any time prior to shipment dispatch:
        </p>
        <ul>
          <li><strong>Pre-Dispatch Cancellation:</strong> If your order has not yet been processed by our warehouse, simply message our WhatsApp support or click Cancel in your order overview. Your full payment will be reversed immediately.</li>
          <li><strong>Post-Dispatch:</strong> Once a parcel is handed over to our courier partner and a tracking AWB is generated, orders cannot be directly cancelled in-transit. You may choose to refuse the delivery upon arrival, and a refund will be processed upon the parcel&rsquo;s return to our hub.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Returns Concierge & Inquiries',
    content: (
      <>
        <p>
          For help initiating a return, checking inspection status, or tracking a refund:
        </p>
        <p>
          <strong>VEYNCORE Returns &amp; Exchange Desk</strong><br />
          WhatsApp Concierge: +91 94463 91166 (10:00 AM – 8:00 PM IST)<br />
          Email: <a href="mailto:support@veyncore.com" style={{ color: '#0f172a', fontWeight: 600 }}>support@veyncore.com</a><br />
          Operating Hub: Kerala, India
        </p>
      </>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="REFUND & CANCELLATION"
      subtitle="Everything you need to know about our 7-Day Easy Returns, size exchanges, and transparent refund procedures."
      lastUpdated="November 2026"
      sections={refundSections}
    />
  );
}
