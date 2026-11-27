import React from 'react';
import LegalPage from '@/components/LegalPage/LegalPage';

export const metadata = {
  title: 'Shipping policy | VEYNCORE',
  description:
    'Learn about VEYNCORE delivery timeframes, order processing via WhatsApp, shipping charges, and order tracking.',
};

const shippingSections = [
  {
    id: 'overview',
    title: 'Overview',
    number: false,
    content: (
      <div className="legal-callout legal-callout--accent">
        <p className="legal-callout__title">Thank you for shopping with VEYNCORE!</p>
        <p className="legal-callout__text">
          We are committed to delivering our curated collections and objects to you safely and efficiently. Below you will find all information regarding our delivery timeframes, processing schedules, shipping charges, and tracking guidelines.
        </p>
      </div>
    ),
  },
  {
    id: 'delivery-timeframe',
    title: 'Delivery timeframe',
    number: 1,
    content: (
      <p>
        Orders are generally delivered within <strong>3–7 working days</strong> from the date of dispatch. Delivery timelines may vary depending on the customer’s location, courier service, and other logistical factors.
      </p>
    ),
  },
  {
    id: 'order-processing',
    title: 'Order processing',
    number: 2,
    content: (
      <p>
        Orders are confirmed and processed through our official WhatsApp ordering channel. Processing and dispatch take place on working days only. Orders confirmed on Sundays or public holidays will be processed on the next working day.
      </p>
    ),
  },
  {
    id: 'shipping-charges',
    title: 'Shipping charges',
    number: 3,
    content: (
      <p>
        Shipping charges may vary depending on the delivery location and order details. Free shipping is available only in selected areas, as specified on our website or communicated at the time of ordering.
      </p>
    ),
  },
  {
    id: 'delivery-delays',
    title: 'Delivery delays',
    number: 4,
    content: (
      <p>
        While we make every effort to deliver orders within the estimated timeframe, unforeseen circumstances such as extreme weather conditions, courier delays, public holidays, or high-demand periods may occasionally affect delivery schedules. We appreciate your patience and understanding in such situations.
      </p>
    ),
  },
  {
    id: 'tracking-your-order',
    title: 'Tracking your order',
    number: 5,
    content: (
      <p>
        Once your order has been dispatched, tracking details will be shared with you, wherever available, so you can monitor your shipment until delivery.
      </p>
    ),
  },
  {
    id: 'questions',
    title: 'Questions?',
    number: 6,
    content: (
      <>
        <p>
          If you have any questions or concerns regarding your order, shipping, or delivery, feel free to contact us at <a href="mailto:veyncore.in@gmail.com" style={{ color: '#0f172a', fontWeight: 600 }}>veyncore.in@gmail.com</a> &mdash; We&rsquo;re always happy to help.
        </p>
        <p>
          <strong>VEYNCORE Legal Dept.</strong><br />
          Email: <a href="mailto:veyncore.in@gmail.com" style={{ color: '#0f172a', fontWeight: 600 }}>veyncore.in@gmail.com</a><br />
          WhatsApp Concierge: +91 94463 91166<br />
          Official Website: <a href="https://veyncore.in" target="_blank" rel="noopener noreferrer" style={{ color: '#0f172a', fontWeight: 600 }}>veyncore.in</a>
        </p>
      </>
    ),
  },
];

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping policy"
      subtitle="Delivery timeframes, order processing, shipping charges, and tracking guidelines."
      lastUpdated="November 2026"
      sections={shippingSections}
    />
  );
}
