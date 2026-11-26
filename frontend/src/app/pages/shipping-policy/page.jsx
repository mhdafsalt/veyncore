import React from 'react';
import LegalPage from '@/components/LegalPage/LegalPage';

export const metadata = {
  title: 'SHIPPING & DELIVERY POLICY | VEYNCORE',
  description:
    'Learn about VEYNCORE Pan-India delivery timelines, dispatch processing, free shipping coverage, and real-time tracking.',
};

const shippingSections = [
  {
    id: 'pan-india-coverage',
    title: 'Pan-India Delivery Coverage',
    content: (
      <>
        <p>
          <strong>VEYNCORE</strong> delivers contemporary raw denim drops and utilitarian objects across India. Through our network of premier logistics and express courier partners (including Bluedart, Delhivery, and Shiprocket), we service over <strong>26,000+ pin codes</strong> across all 28 states and 8 union territories.
        </p>
        <div className="legal-callout legal-callout--accent">
          <p className="legal-callout__title">Free Shipping Across India</p>
          <p className="legal-callout__text">
            We are proud to offer <strong>Complimentary Standard Shipping on all orders across India</strong>. No hidden delivery fees, minimum order values, or surprise charges at checkout.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'processing-dispatch',
    title: 'Order Processing & Dispatch Timelines',
    content: (
      <>
        <p>
          We pride ourselves on swift order handling and artisanal packaging:
        </p>
        <ul>
          <li><strong>Processing Window:</strong> Orders placed before 2:00 PM IST (Monday through Saturday) are typically processed and handed over to our couriers within <strong>24 to 48 hours</strong>.</li>
          <li><strong>Sundays &amp; National Holidays:</strong> Orders placed on Sundays or public holidays will be dispatched on the following business day.</li>
          <li><strong>Drop Releases:</strong> During high-volume seasonal collection launches, processing may take up to 72 hours due to intense order influx.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'delivery-timelines',
    title: 'Estimated Delivery Timelines',
    content: (
      <>
        <p>
          Once dispatched from our central distribution hub in South India, transit timelines typically adhere to the following schedules:
        </p>
        <ul>
          <li><strong>Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 3 to 5 business days.</li>
          <li><strong>Tier 2 &amp; Tier 3 Cities / Regional Hubs:</strong> 4 to 6 business days.</li>
          <li><strong>Remote Zones &amp; North East India:</strong> 5 to 7 business days.</li>
        </ul>
        <p>
          <em>Note: Unforeseen environmental disruptions, severe monsoon events, or local regulatory inspections may occasionally extend delivery times by 24 to 48 hours.</em>
        </p>
      </>
    ),
  },
  {
    id: 'order-tracking',
    title: 'Live Tracking & Real-Time Updates',
    content: (
      <>
        <p>
          You will never have to guess where your VEYNCORE pieces are:
        </p>
        <ul>
          <li><strong>Instant Dispatch Alert:</strong> The moment your parcel is scanned by our carrier, you will receive an SMS, Email, and WhatsApp notification containing your unique Air Waybill (AWB) tracking number and direct live tracking link.</li>
          <li><strong>Real-Time Milestones:</strong> Track your package from warehouse pickup, hub transitions, out-for-delivery status, to final verified delivery.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cash-on-delivery',
    title: 'Cash on Delivery (COD) Guidelines',
    content: (
      <>
        <p>
          To make premium denim accessible to all enthusiasts across India, we support Cash on Delivery (COD) on eligible orders:
        </p>
        <ul>
          <li><strong>Pre-Dispatch Verification:</strong> To prevent logistical rejections, COD orders may receive an automated WhatsApp confirmation link or a quick confirmation phone call before parcel generation.</li>
          <li><strong>Payment Collection:</strong> Please ensure the exact cash amount or active UPI QR scan capability is available upon arrival of the delivery agent. Delivery agents cannot leave parcels without full payment collection.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'packaging-inspection',
    title: 'Tamper-Evident Packaging & Delivery Inspection',
    content: (
      <>
        <p>
          All VEYNCORE orders are packaged in durable, custom-sealed, tamper-evident security polybags and protective dust packaging.
        </p>
        <p>
          <strong>Delivery Check:</strong> Before accepting your package from the courier agent, please inspect the outer packaging. If the security seal is broken, torn, or visibly tampered with, please <strong>refuse delivery</strong> and notify our support concierge immediately at +91 94463 91166.
        </p>
      </>
    ),
  },
  {
    id: 'failed-deliveries',
    title: 'Failed Delivery Attempts & Address Corrections',
    content: (
      <>
        <p>
          Our courier partners attempt delivery up to <strong>three (3) times</strong> before initiating a Return to Origin (RTO):
        </p>
        <ul>
          <li><strong>Contact Availability:</strong> Ensure your registered contact number is reachable so the delivery partner can coordinate the final doorstep handover.</li>
          <li><strong>Address Modifications:</strong> If you need to modify your delivery address or contact number, please contact us within 12 hours of placing your order. Once a package is in-transit with the courier, rerouting may incur slight transit delays.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'shipping-support',
    title: 'Shipping Escalations & Courier Inquiries',
    content: (
      <>
        <p>
          Have questions regarding an active shipment or need priority courier coordination?
        </p>
        <p>
          <strong>VEYNCORE Logistics Desk</strong><br />
          WhatsApp Concierge: +91 94463 91166 (Mon – Sat, 10:00 AM – 8:00 PM IST)<br />
          Email: <a href="mailto:support@veyncore.com" style={{ color: '#0f172a', fontWeight: 600 }}>support@veyncore.com</a><br />
          Official Website: <a href="https://veyncorein.vercel.app" style={{ color: '#0f172a', fontWeight: 600 }}>veyncorein.vercel.app</a>
        </p>
      </>
    ),
  },
];

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title="SHIPPING & DELIVERY"
      subtitle="Complete information regarding our complimentary Pan-India shipping, delivery timelines, COD guidelines, and tracking."
      lastUpdated="November 2026"
      sections={shippingSections}
    />
  );
}
