import React from 'react';
import LegalPage from '@/components/LegalPage/LegalPage';

export const metadata = {
  title: 'Refund policy | VEYNCORE',
  description:
    'Review the official Refund, Return, Replacement, and Cancellation Policy for VEYNCORE contemporary fashion pieces and objects.',
};

const refundSections = [
  {
    id: 'overview',
    title: 'Overview',
    number: false,
    content: (
      <>
        <p><strong>VEYNCORE has two lines:</strong></p>
        <p>
          <strong>VEYN SELECTS:</strong> A carefully curated collection of fashion pieces, handpicked to reflect VEYNCORE&rsquo;s unique vision and creative direction. Every piece is thoughtfully sourced and quality-checked, with a focus on style, individuality, and originality.
        </p>
        <p>
          <strong>VEYN OBJECTS:</strong> A curated selection of accessories and everyday essentials, chosen to complement your style and complete your identity. From subtle details to statement pieces, each object brings its own character, adding another dimension to the way you express yourself.
        </p>
        <div className="legal-callout legal-callout--accent" style={{ marginTop: '20px' }}>
          <p className="legal-callout__title">Refund, Return, Replacement and Cancellation Policy</p>
          <p className="legal-callout__text">
            We believe every purchase should meet reasonable expectations of quality and presentation. This policy outlines the conditions under which refund, return, replacement, exchange, and cancellation requests may be considered.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'general-terms',
    title: 'General terms',
    number: 1,
    content: (
      <ul>
        <li>All return, refund, replacement, and exchange requests are subject to review and approval by VEYNCORE.</li>
        <li>Customers must contact us within 7 days from the date of delivery to report an issue or request a return or exchange.</li>
        <li>An unboxing video is mandatory for claims involving damaged, defective, incorrect, or missing products.</li>
        <li>The unboxing video must be continuous and clearly show the sealed package, opening of the package, and the condition of the product.</li>
        <li>Requests submitted without the required evidence may not be accepted.</li>
        <li>Return shipping costs are the responsibility of the customer unless the issue is verified to have resulted from an error on our part.</li>
        <li>Products must be unused, unwashed, undamaged, and returned with their original tags, labels, and packaging.</li>
        <li>VEYNCORE reserves the right to reject requests that do not meet the eligibility conditions outlined in this policy.</li>
      </ul>
    ),
  },
  {
    id: 'damaged-defective-or-incorrect-products',
    title: 'Damaged, defective or incorrect products',
    number: 2,
    content: (
      <>
        <p>
          If you receive a damaged, defective, or incorrect product, please contact VEYNCORE within 7 days of delivery.
        </p>
        <p style={{ fontWeight: 700, margin: '20px 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0f172a' }}>
          MANDATORY UNBOXING VIDEO REQUIREMENT
        </p>
        <p>
          Customers must provide a complete, continuous and unedited unboxing video showing the sealed package, the entire opening process and the product received. The video must be recorded in one uninterrupted take from start to finish. No cuts, edits, pauses, transitions or interruptions are permitted. The recording must begin before opening the package and clearly document the complete unboxing process.
        </p>
        <p>
          Clear photographs and additional information may also be requested to assess the reported issue.
        </p>
        <p>
          Once the claim has been reviewed and verified, VEYNCORE may arrange a replacement or another appropriate resolution.
        </p>
        <p>
          If the reported issue is confirmed to have been caused by VEYNCORE or its fulfilment process, the applicable return or replacement shipping costs will be handled by us.
        </p>
        <p>
          Claims submitted without a valid, complete and uninterrupted unboxing video, or with insufficient supporting evidence, may be declined.
        </p>
      </>
    ),
  },
  {
    id: 'size-related-returns-and-exchanges',
    title: 'Size-related returns and exchanges',
    number: 3,
    content: (
      <>
        <p>
          Customers are responsible for reviewing the size charts and product measurements provided on the respective product pages before placing an order.
        </p>
        <ul>
          <li>All available sizes and measurements are displayed on the product pages, wherever applicable.</li>
          <li>Customers are advised to use a measuring tape and compare their measurements with the provided size chart before ordering.</li>
          <li>Measurements are taken manually, so minor variations may occur.</li>
          <li>Size-related exchange requests may be considered on a case-by-case basis, subject to product availability and approval by VEYNCORE.</li>
          <li>Customers are responsible for the return shipping costs associated with approved size-related exchanges.</li>
          <li>Products must be unused, unwashed, and returned with their original tags and packaging.</li>
        </ul>
        <p>
          A size-related return or exchange is not guaranteed and will depend on the eligibility of the request.
        </p>
      </>
    ),
  },
  {
    id: 'offer-and-sale-products',
    title: 'Offer and sale products',
    number: 4,
    content: (
      <>
        <p>
          Products purchased during promotional campaigns, discounts, clearance sales, or special offers may be subject to additional return and exchange restrictions.
        </p>
        <ul>
          <li>Sale and promotional products may not be eligible for returns, refunds, or exchanges unless the product is verified to be defective, damaged, incorrect, or otherwise covered by applicable consumer protection laws.</li>
          <li>Any special restrictions applicable to a particular product or offer will be communicated on the website or at the time of ordering.</li>
          <li>Customers are advised to review the product description, available sizes, measurements, and applicable offer conditions carefully before confirming their purchase.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'return-and-exchange-conditions',
    title: 'Return and exchange conditions',
    number: 5,
    content: (
      <>
        <p>
          To be eligible for an approved return or exchange:
        </p>
        <ul>
          <li>The request must be submitted within 7 days of delivery.</li>
          <li>The product must be unused, unwashed, and in its original condition.</li>
          <li>Original tags, labels, and packaging must be retained.</li>
          <li>The product must not show signs of wear, damage, alteration, or misuse.</li>
          <li>The return or exchange must be approved by VEYNCORE before the product is shipped back.</li>
        </ul>
        <p>
          Products that fail to meet these conditions may be rejected.
        </p>
      </>
    ),
  },
  {
    id: 'refund-policy',
    title: 'Refund policy',
    number: 6,
    content: (
      <>
        <p>
          Refunds are not automatically available for every return request.
        </p>
        <ul>
          <li>Refund eligibility will be assessed on a case-by-case basis.</li>
          <li>Approved refunds will be processed using the original payment method or another mutually agreed method, where applicable.</li>
          <li>Any applicable refund amount and processing details will be communicated to the customer.</li>
          <li>Shipping charges, where applicable, may be non-refundable unless the issue is attributable to VEYNCORE or otherwise required by applicable law.</li>
          <li>Refund processing time may vary depending on the payment method and financial institution.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'order-cancellation',
    title: 'Order cancellation',
    number: 7,
    content: (
      <>
        <p>
          Since orders are placed and confirmed through WhatsApp, customers are advised to review all product details, sizes, quantities, and delivery information before confirming their order.
        </p>
        <ul>
          <li>Cancellation requests must be communicated to VEYNCORE as soon as possible.</li>
          <li>Orders that have not yet been processed or dispatched may be eligible for cancellation.</li>
          <li>Once an order has been dispatched, cancellation may no longer be possible.</li>
          <li>Approved cancellations of prepaid orders will be refunded through the applicable payment method, subject to processing requirements.</li>
          <li>VEYNCORE reserves the right to cancel an order due to product unavailability, pricing errors, or other operational reasons. In such cases, any payment received for the cancelled order will be refunded as applicable.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-to-request-a-return-replacement-or-exchange',
    title: 'How to request a return, replacement or exchange',
    number: 8,
    content: (
      <>
        <p>
          To initiate a request, contact us through our official WhatsApp channel or email with the following details:
        </p>
        <ul>
          <li>Order reference number.</li>
          <li>Product name and size.</li>
          <li>Reason for the request.</li>
          <li>Relevant photographs or unboxing video, where applicable.</li>
        </ul>
        <p>
          Our team will review your request and communicate the next steps. Please do not ship any product back without receiving approval and return instructions from us.
        </p>
      </>
    ),
  },
  {
    id: 'contact-information',
    title: 'Contact information',
    number: 9,
    content: (
      <>
        <p>
          For questions or assistance regarding refunds, returns, replacements, exchanges, or cancellations, please contact us at <a href="mailto:veyncore.in@gmail.com" style={{ color: '#0f172a', fontWeight: 600 }}>veyncore.in@gmail.com</a>.
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

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund policy"
      subtitle="Conditions under which refund, return, replacement, exchange, and cancellation requests may be considered."
      lastUpdated="November 2026"
      sections={refundSections}
    />
  );
}
