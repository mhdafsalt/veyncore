import React from 'react';
import LegalPage from '@/components/LegalPage/LegalPage';

export const metadata = {
  title: 'Privacy policy | VEYNCORE',
  description:
    'Learn how VEYNCORE collects, uses, processes, and protects your personal information when you use our website and services.',
};

const privacySections = [
  {
    id: 'overview',
    title: 'Overview',
    number: false,
    content: (
      <>
        <p>
          VEYNCORE operates this store and website, including all related information, content, features, tools, products and services, in order to provide you, the customer, with a curated shopping experience (the &ldquo;Services&rdquo;). This Privacy Policy describes how we collect, use, process, and disclose your personal information when you visit, use, or make a purchase or other transaction through our Services, or otherwise communicate with us.
        </p>
        <p>
          Please read this Privacy Policy carefully. By accessing or using any of our Services, you acknowledge that you have read and understood this Privacy Policy and the collection, use, and disclosure of your information as described herein.
        </p>
      </>
    ),
  },
  {
    id: 'personal-information-we-collect-or-process',
    title: 'Personal Information We Collect or Process',
    number: 1,
    content: (
      <>
        <p>
          When we use the term &ldquo;personal information&rdquo;, we refer to information that identifies or can reasonably be linked to you or another individual. Personal information does not include information that has been collected anonymously or de-identified so that it cannot reasonably identify an individual.
        </p>
        <p>
          Depending on how you interact with our Services, we may collect or process the following categories of personal information:
        </p>
        <ul>
          <li><strong>Contact Details</strong> including your name, billing address, shipping address, phone number, and email address.</li>
          <li><strong>Financial Information</strong> including payment details, transaction information, payment confirmation, payment method, and other relevant financial details where applicable.</li>
          <li><strong>Account Information</strong> including your username, password, preferences, and account settings, where account registration is available.</li>
          <li><strong>Transaction Information</strong> including the products you view, add to your cart or wishlist, purchase, return, exchange, or cancel, along with your order history and related transaction details.</li>
          <li><strong>Communications with Us</strong> including information you provide when contacting VEYNCORE through email, WhatsApp, or other customer support channels, such as enquiries, feedback, and order-related communications.</li>
          <li><strong>Device Information</strong> including information about your device, browser, network connection, IP address, and other technical identifiers.</li>
          <li><strong>Usage Information</strong> including information about how and when you access, browse, and interact with our website and Services.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'personal-information-sources',
    title: 'Personal Information Sources',
    number: 2,
    content: (
      <>
        <p>
          We may collect personal information from the following sources:
        </p>
        <ul>
          <li><strong>Directly from You</strong> including when you browse our website, place an order, contact us through WhatsApp or email, submit an enquiry, or otherwise provide your personal information.</li>
          <li><strong>Automatically Through Our Services</strong> including information collected from your device when you access or use our website, through cookies and similar tracking technologies.</li>
          <li><strong>From Our Service Providers</strong> including third-party providers who assist us in operating our website, processing transactions, managing communications, and providing other business-related services.</li>
          <li><strong>From Partners or Other Third Parties</strong> including information made available to us through services or platforms that support our business operations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use-your-personal-information',
    title: 'How We Use Your Personal Information',
    number: 3,
    content: (
      <>
        <p>
          Depending on how you interact with us and which Services you use, we may use your personal information for the following purposes:
        </p>
        <ul>
          <li><strong>Provide, Tailor, and Improve the Services.</strong> We use your personal information to provide and maintain our Services, process your orders and transactions, manage product enquiries, confirm product availability, arrange shipping and delivery, facilitate eligible returns or exchanges, respond to customer requests, and improve your overall shopping experience.</li>
          <li><strong>Marketing and Advertising.</strong> We may use your personal information to communicate product updates, new arrivals, promotional offers, announcements, and other marketing-related information through email, WhatsApp, or other communication channels, where permitted by applicable law. You may opt out of promotional communications at any time.</li>
          <li><strong>Security and Fraud Prevention.</strong> We use relevant information to verify transactions, protect our website and Services, detect and prevent fraudulent or unauthorized activities, investigate suspicious transactions, and maintain the security of our business operations.</li>
          <li><strong>Communicating with You.</strong> We use your personal information to respond to enquiries, provide order confirmations and updates, assist with delivery-related matters, offer customer support, and maintain our relationship with you.</li>
          <li><strong>Legal Reasons.</strong> We may use and process your personal information to comply with applicable laws and regulations, respond to valid legal requests from authorized authorities, resolve disputes, enforce our policies, and protect our legal rights and interests.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-disclose-personal-information',
    title: 'How We Disclose Personal Information',
    number: 4,
    content: (
      <>
        <p>
          In certain circumstances, we may disclose your personal information to third parties for legitimate business purposes, subject to this Privacy Policy and applicable laws. Such circumstances may include:
        </p>
        <ul>
          <li><strong>Service Providers and Business Partners.</strong> We may share relevant information with third-party service providers who assist us in operating our business, including website hosting providers, technology providers, payment service providers, shipping and logistics partners, and customer support services.</li>
          <li><strong>Shipping and Delivery Partners.</strong> We may provide your name, contact number, shipping address, and relevant order details to delivery and logistics partners to facilitate the shipment and delivery of your purchases.</li>
          <li><strong>Marketing and Promotional Partners.</strong> Where applicable and permitted by law, we may share limited information with business or marketing partners to support promotional activities, advertising, and communication regarding our products and Services.</li>
          <li><strong>At Your Direction or With Your Consent.</strong> We may disclose your personal information when you specifically request or authorize us to share certain information with third parties, including where necessary to fulfil your order or provide requested services.</li>
          <li><strong>Legal and Business Requirements.</strong> We may disclose your personal information when required to comply with applicable laws, regulations, legal proceedings, or valid requests from government authorities, enforce our policies, protect our rights, or safeguard the security of our Services and customers.</li>
        </ul>
        <p>
          We do not sell or rent your personal information to third parties for their independent commercial use.
        </p>
      </>
    ),
  },
  {
    id: 'third-party-websites-and-links',
    title: 'Third-Party Websites and Links',
    number: 5,
    content: (
      <>
        <p>
          Our Services may contain links to websites or online platforms operated by third parties that are not owned, operated, or controlled by us. If you choose to access any third-party websites through links provided on our Services, we encourage you to review their respective privacy policies, security practices, and terms and conditions.
        </p>
        <p>
          We does not control, guarantee, or accept responsibility for the privacy, security, content, accuracy, completeness, or reliability of information available on such third-party websites or platforms.
        </p>
        <p>
          Any information you share through public or semi-public platforms, including third-party social networking websites, may be accessible to other users and may be used by those platforms in accordance with their own policies.
        </p>
        <p>
          The inclusion of third-party links on our website does not constitute an endorsement, approval, or recommendation of such websites, their content, or their operators, unless expressly stated otherwise.
        </p>
      </>
    ),
  },
  {
    id: 'childrens-data',
    title: 'Children’s Data',
    number: 6,
    content: (
      <>
        <p>
          Our Services are not intended for use by children. We does not knowingly collect personal information from individuals who are below the age permitted to independently provide such information under applicable laws.
        </p>
        <p>
          If you are a parent or legal guardian and believe that a child has provided us with personal information without appropriate consent, you may contact us using the contact details provided below. We will take reasonable steps to review the request and delete such information where required by applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'security-and-retention-of-your-information',
    title: 'Security and Retention of Your Information',
    number: 7,
    content: (
      <>
        <p>
          We takes reasonable technical and organizational measures to protect your personal information against unauthorized access, disclosure, alteration, misuse, or destruction.
        </p>
        <p>
          However, no method of electronic transmission or information storage is completely secure, and we cannot guarantee absolute security. Information transmitted over the internet or through digital communication channels may carry certain security risks. We recommend avoiding unsecured channels when sharing sensitive or confidential information with us.
        </p>
        <p>
          The period for which we retain your personal information depends on several factors, including the purpose for which it was collected, whether it is required to provide our Services, fulfil orders, maintain business records, comply with applicable legal obligations, resolve disputes, or enforce our agreements and policies.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights-and-choices',
    title: 'Your Rights and Choices',
    number: 8,
    content: (
      <>
        <p>
          Subject to applicable laws and regulations, you may have certain rights regarding the personal information we collect and process about you. These rights may include:
        </p>
        <ul>
          <li><strong>Right to Access.</strong> You may request information about the personal information we hold about you and how it is being processed.</li>
          <li><strong>Right to Correction.</strong> You may request the correction or updating of inaccurate, incomplete, or outdated personal information.</li>
          <li><strong>Right to Erasure.</strong> You may request the deletion of your personal information, subject to applicable legal and business record-retention requirements.</li>
          <li><strong>Right to Withdraw Consent.</strong> Where we process your personal information based on your consent, you may withdraw that consent, subject to applicable laws.</li>
          <li><strong>Right to Grievance Redressal.</strong> You may contact us to raise concerns or complaints regarding the collection, use, or processing of your personal information.</li>
          <li><strong>Managing Communication Preferences.</strong> You may opt out of receiving promotional communications from VEYNCORE at any time by following the unsubscribe instructions, where available, or by contacting us directly. Please note that even if you opt out of promotional communications, we may continue to send essential non-promotional messages relating to your orders, transactions, delivery updates, or customer support.</li>
        </ul>
        <p>
          You may exercise your applicable rights by contacting us using the contact details provided below. We may request reasonable information to verify your identity before processing your request.
        </p>
        <p>
          We will review and respond to requests within the timelines prescribed under applicable laws. Certain requests may be subject to limitations or exceptions as permitted by law.
        </p>
      </>
    ),
  },
  {
    id: 'complaints-and-grievances',
    title: 'Complaints and Grievances',
    number: 9,
    content: (
      <>
        <p>
          If you have any questions, concerns, or complaints regarding how VEYNCORE collects, uses, stores, or processes your personal information, you may contact us using the details provided below.
        </p>
        <p>
          We will make reasonable efforts to review and address your concerns in accordance with applicable laws and regulations.
        </p>
        <p>
          Where applicable, you may also have the right to approach the relevant data protection authority or other competent regulatory body for assistance or grievance redressal.
        </p>
      </>
    ),
  },
  {
    id: 'international-transfers',
    title: 'International Transfers',
    number: 10,
    content: (
      <p>
        Your personal information may be stored or processed in locations outside your state or country of residence, depending on the location of our website hosting providers, technology partners, and other service providers. Where personal information is transferred across national borders, VEYNCORE will take reasonable steps to ensure that such transfers are carried out in accordance with applicable data protection laws and that appropriate safeguards are maintained where required.
      </p>
    ),
  },
  {
    id: 'changes-to-this-privacy-policy',
    title: 'Changes to This Privacy Policy',
    number: 11,
    content: (
      <>
        <p>
          We reserves the right to update, modify, or revise this Privacy Policy from time to time to reflect changes in our business practices, website operations, services, or applicable legal and regulatory requirements.
        </p>
        <p>
          Any revised version will be published on this page with an updated &ldquo;Last updated&rdquo; date. Where required by applicable law, we will provide additional notice regarding significant changes.
        </p>
        <p>
          We encourage you to review this Privacy Policy periodically to stay informed about how we protect and process your personal information.
        </p>
      </>
    ),
  },
  {
    id: 'contact-information',
    title: 'Contact Information',
    number: 12,
    content: (
      <>
        <p>
          If you have any questions, requests, or concerns regarding this Privacy Policy or the handling of your personal information, please contact us at <a href="mailto:veyncore.in@gmail.com" style={{ color: '#0f172a', fontWeight: 600 }}>veyncore.in@gmail.com</a>. You can find our other contact details on our contact information policy.
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

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      subtitle="How VEYNCORE collects, uses, processes, and protects your personal information."
      lastUpdated="November 26, 2026"
      sections={privacySections}
    />
  );
}
