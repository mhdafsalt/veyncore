import React from 'react';
import LegalPage from '@/components/LegalPage/LegalPage';

export const metadata = {
  title: 'Terms and conditions | VEYNCORE',
  description:
    'Read the official Terms and conditions governing your use of the VEYNCORE website, catalog purchases, and services.',
};

const termsSections = [
  {
    id: 'overview',
    title: 'Overview',
    number: false,
    content: (
      <>
        <p>
          Welcome to VEYNCORE! The terms &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to VEYNCORE. We operates this store and website, including all related information, content, features, tools, products and services in order to provide you, the customer, with a curated shopping experience (the &ldquo;Services&rdquo;).
        </p>
        <p>
          The below terms and conditions, together with any policies referenced herein (these &ldquo;Terms of Service&rdquo;) describe your rights and responsibilities when you use the Services. Please read these Terms of Service carefully, as they include important information about your legal rights and cover areas such as warranty disclaimers and limitations of liability.
        </p>
        <p>
          By visiting, interacting with or using our Services, you agree to be bound by these Terms of Service and our privacy policy. If you do not agree to these Terms of Service or Privacy Policy, you should not use or access our Services. These Terms of Service do not limit any rights you may have under applicable consumer protection laws or any other non-waivable statutory rights.
        </p>
      </>
    ),
  },
  {
    id: 'access-and-account',
    title: 'Access and account',
    number: 1,
    content: (
      <p>
        By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, and you have given us your consent to allow any of your minor dependents to use the Services on devices you own, purchase or manage. To use the Services, including accessing or browsing our online stores or purchasing any of the products or services we offer, you may be asked to provide certain information, such as your email address, billing, payment, and shipping information. You represent and warrant that all the information you provide in our stores is correct, current and complete and that you have all rights necessary to provide this information. You are solely responsible for maintaining the security of your account credentials and for all of your account activity. You may not transfer, sell, assign, or license your account to any other person.
      </p>
    ),
  },
  {
    id: 'our-products',
    title: 'Our products',
    number: 2,
    content: (
      <p>
        We have made every effort to provide an accurate representation of our products and services in our online stores. However, please note that colors or product appearance may differ from how they may appear on your screen due to the type of device you use to access the store and your device settings and configuration. We do not warrant that the appearance or quality of any products or services purchased by you will meet your expectations or be the same as depicted or rendered in our online stores. All descriptions of products are subject to change at any time without notice at our sole discretion. We reserve the right to discontinue any product at any time and may limit the quantities of any products that we offer to any person, geographic region or jurisdiction, on a case-by-case basis.
      </p>
    ),
  },
  {
    id: 'orders',
    title: 'Orders',
    number: 3,
    content: (
      <>
        <p>
          VEYNCORE accepts orders through WhatsApp. Customers can select products through our website and initiate an order through WhatsApp. Customers must provide accurate product, size, quantity and delivery information.
        </p>
        <p>
          Every order is subject to stock availability and confirmation by VEYNCORE. An order is considered confirmed only after product availability, delivery details, payment method and final order amount have been communicated and agreed upon.
        </p>
        <p>
          We reserves the right to decline or cancel an order for valid operational reasons, including stock unavailability or incorrect pricing. Your purchases are subject to return or exchange solely in accordance with our return and refund policy. This does not limit any rights you may have under applicable law. You represent and warrant that your purchases are for your own personal or household use and not for commercial resale or export.
        </p>
      </>
    ),
  },
  {
    id: 'prices-and-billing',
    title: 'Prices and billing',
    number: 4,
    content: (
      <>
        <p>
          All product prices, discounts and promotional offers displayed on the website are subject to change without prior notice. The applicable product price will be the price communicated and confirmed at the time of order confirmation through WhatsApp.
        </p>
        <p>
          Unless otherwise stated, displayed product prices do not include additional shipping charges or other applicable fees. Any applicable shipping charges, COD charges or additional costs will be communicated to the customer before the order is confirmed. Prices posted in our online stores may be different from prices offered in physical stores or in online or other stores operated by third parties.
        </p>
        <p>
          We may introduce promotional offers, discounts or special sales from time to time. Such promotions may be subject to separate terms and conditions. In case of any conflict, the specific promotional terms will apply.
        </p>
        <p>
          You are responsible for providing accurate and complete information required to process their orders, including their name, contact number, delivery address and payment details. You represent and warrant that:
        </p>
        <ul>
          <li>(1) You are authorised to use the selected payment method,</li>
          <li>(2) The information provided for your order and payment is accurate and complete,</li>
          <li>(3) You agree to pay the final order amount confirmed by VEYNCORE,</li>
          <li>(4) For Cash on Delivery (COD) orders, you agree to pay the confirmed amount to the delivery partner at the time of delivery.</li>
        </ul>
        <p>
          We accepts UPI, Bank Transfer and Cash on Delivery (COD), subject to the applicable payment and delivery conditions.
        </p>
      </>
    ),
  },
  {
    id: 'shipping-and-delivery',
    title: 'Shipping and delivery',
    number: 5,
    content: (
      <>
        <p>
          We make reasonable efforts to ensure that all orders are delivered within the estimated delivery timeframe of 3–7 working days after dispatch. However, all delivery timelines are estimates only and are not guaranteed.
        </p>
        <p>
          We shall not be held responsible for delays caused by courier or delivery partners, transportation issues, weather conditions, public holidays, operational disruptions or other circumstances beyond our reasonable control. Such circumstances may include natural disasters, severe weather, labour disputes, supply shortages, technical or communication failures, government restrictions or other unforeseen events.
        </p>
        <p>
          Once an order has been handed over to the designated courier or delivery partner, responsibility for transportation and delivery rests with the respective carrier, subject to applicable law. VEYNCORE will assist customers with available tracking information and reasonable support in resolving delivery-related concerns.
        </p>
        <p>
          Nothing in this section limits any rights or remedies available to customers under applicable Indian consumer protection laws. See our shipping policy for more details.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    number: 6,
    content: (
      <>
        <p>
          All content featured on the VEYNCORE website, including the brand name, logo, trademarks, text, images, graphics, product photographs, videos, designs, and other creative materials, is owned by VEYNCORE or used with appropriate permission from the respective rights holders.
        </p>
        <p>
          All such content is protected under applicable intellectual property laws. You may not copy, reproduce, modify, distribute, publish, or use any website content or brand assets for commercial or personal purposes without prior written permission from VEYNCORE. Purchasing any product from VEYNCORE does not grant you ownership or rights over its designs, branding, or associated intellectual property.
        </p>
        <p>
          The VEYNCORE name, logo, brand identity, and tagline may not be used without prior written authorisation. All third-party trademarks, logos, and materials remain the property of their respective owners.
        </p>
        <p>
          VEYNCORE reserves the right to take appropriate action against any unauthorised use or infringement of its intellectual property.
        </p>
      </>
    ),
  },
  {
    id: 'optional-tools',
    title: 'Optional Tools',
    number: 7,
    content: (
      <>
        <p>
          We may provide access to optional third-party tools through its website. These tools are not owned, operated, or controlled by VEYNCORE, and we do not monitor or guarantee their functionality or availability.
        </p>
        <p>
          Such tools are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, without any warranties or guarantees from VEYNCORE. Your use of these tools is entirely at your own risk and discretion. We recommend reviewing the terms and conditions of the respective third-party providers before using them.
        </p>
        <p>
          We shall not be responsible for any issues, losses, or damages arising from your use of optional third-party tools, subject to applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'third-party-links',
    title: 'Third-Party Links',
    number: 8,
    content: (
      <>
        <p>
          The VEYNCORE website may contain links to third-party websites, services, or external resources for your convenience. These websites are operated independently and are not owned, controlled, or managed by VEYNCORE. We do not guarantee the accuracy, reliability, availability, or content of any third-party websites. If you choose to access these links, you do so at your own risk and are responsible for reviewing their terms, privacy policies, and practices before engaging with them.
        </p>
        <p>
          We shall not be responsible for any loss, damage, or issues arising from your access to or use of third-party websites, products, or services, subject to applicable law. Any complaints, questions, or concerns regarding third-party products, services, or websites should be directed to the respective third-party provider.
        </p>
      </>
    ),
  },
  {
    id: 'relationship-with-veyncore',
    title: 'Relationship with VEYNCORE',
    number: 9,
    content: (
      <>
        <p>
          The VEYNCORE website serves as a platform to showcase our products and provide information about our collections. All purchases are made directly between you and VEYNCORE through our WhatsApp ordering process.
        </p>
        <p>
          We are responsible for handling order confirmations, product availability, pricing, and customer communication. Any third-party services used for website hosting, payment processing, or delivery operate independently and are subject to their respective terms and policies.
        </p>
        <p>
          By using our Services, you acknowledge that your purchase agreement is directly with VEYNCORE and not with any third-party service provider.
        </p>
      </>
    ),
  },
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    number: 10,
    content: (
      <>
        <p>
          Our Privacy Policy explains how VEYNCORE collects, uses, stores, and protects your personal information when you visit or interact with our website and Services. By using our Services, you acknowledge that you have read and understood our Privacy Policy.
        </p>
        <p>
          When you browse our website, place an order through WhatsApp, or contact us, we may collect certain information, including your name, phone number, delivery address, order details, and other information necessary to provide our services. We use this information to manage orders, confirm product availability, arrange deliveries, process payments, respond to enquiries, improve our Services, and prevent fraudulent or unauthorised activities.
        </p>
        <p>
          Where necessary, your information may be shared with trusted third-party service providers, such as payment providers, courier partners, and website service providers, strictly for purposes related to operating our business and fulfilling your orders.
        </p>
        <p>
          We take reasonable steps to protect your personal information and handle it in accordance with applicable privacy and data protection laws. Please refer to our Privacy Policy for further details about how your personal information is collected, used, and protected.
        </p>
      </>
    ),
  },
  {
    id: 'feedback',
    title: 'Feedback',
    number: 11,
    content: (
      <>
        <p>
          If you submit, share, or otherwise provide any ideas, suggestions, reviews, comments, proposals, or other feedback to VEYNCORE (&ldquo;Feedback&rdquo;), you grant VEYNCORE a worldwide, royalty-free, non-exclusive licence to use, reproduce, modify, publish, display, and distribute such Feedback for business purposes, including improving and promoting our website, products, and Services, subject to applicable law.
        </p>
        <p>
          You confirm that you own or have the necessary rights to submit the Feedback and that it does not violate the rights of any third party, including copyright, trademark, privacy, or other legal rights.
        </p>
        <p>
          VEYNCORE is not obligated to keep Feedback confidential, provide compensation, or respond to any submission unless otherwise required by law. We reserve the right to review, moderate, or remove Feedback that we consider unlawful, misleading, abusive, offensive, defamatory, spam-related, or in violation of these Terms &amp; Conditions or any third-party rights.
        </p>
        <p>
          You agree not to submit Feedback containing false information, harmful content, malicious software, or misleading identity details. You are solely responsible for the Feedback you provide and its accuracy. We are not endorse or accept responsibility for opinions, comments, or reviews submitted by customers or other third parties.
        </p>
      </>
    ),
  },
  {
    id: 'errors-inaccuracies-omissions',
    title: 'Errors, Inaccuracies & Omissions',
    number: 12,
    content: (
      <>
        <p>
          Occasionally, information on the VEYNCORE website may contain typographical errors, inaccuracies, or omissions relating to product descriptions, pricing, images, promotions, offers, shipping charges, delivery estimates, or product availability.
        </p>
        <p>
          We are reserves the right to correct such errors, update information, or modify website content at any time without prior notice.
        </p>
        <p>
          If an error affects an order, product price, or availability, we reserve the right to contact you, revise the order details with your agreement, or cancel the order where necessary, including after an order request has been submitted through WhatsApp. If payment has already been received for a cancelled order, any applicable refund will be processed in accordance with our Refund Policy and applicable laws.
        </p>
        <p>
          We appreciate your understanding that product images and colours may vary slightly depending on lighting, photography, and screen settings.
        </p>
      </>
    ),
  },
  {
    id: 'prohibited-uses',
    title: 'Prohibited Uses',
    number: 13,
    content: (
      <>
        <p>
          <strong>13.1</strong> You may access and use the VEYNCORE website and Services only for lawful purposes. You agree not to use the Services, directly or indirectly:
        </p>
        <ul>
          <li>(a) For any unlawful, fraudulent, or malicious purpose.</li>
          <li>(b) To violate any applicable local, state, national, or international laws or regulations.</li>
          <li>(c) To infringe upon the intellectual property rights of VEYNCORE or any third party.</li>
          <li>(d) To harass, abuse, threaten, insult, defame, or harm VEYNCORE, its employees, customers, or any other person.</li>
          <li>(e) To submit or transmit false, misleading, or inaccurate information.</li>
          <li>(f) To upload, share, or distribute content that violates these Terms &amp; Conditions.</li>
          <li>(g) To send unsolicited advertisements, promotional messages, spam, or other unauthorised communications.</li>
          <li>(h) To impersonate another person, business, or organisation.</li>
          <li>(i) To engage in any activity that disrupts the website, affects other users, or causes harm to VEYNCORE or its Services.</li>
        </ul>
        <p>
          <strong>13.2</strong> You also agree not to:
        </p>
        <ul>
          <li>(a) Upload or transmit viruses, malware, or any harmful code that may affect the website’s functionality or security.</li>
          <li>(b) Copy, reproduce, duplicate, extract, sell, resell, or commercially exploit any part of the website without prior written permission.</li>
          <li>(c) Collect, misuse, or attempt to access the personal information of other users.</li>
          <li>(d) Use phishing, spamming, or other deceptive methods through our website or Services.</li>
          <li>(e) Use bots, spiders, scraping tools, automated software, or other methods to access, monitor, or extract website content or data without our prior written permission.</li>
          <li>(f) Interfere with, bypass, or attempt to compromise the website’s security, access controls, or other protective features.</li>
        </ul>
        <p>
          VEYNCORE reserves the right to restrict or suspend access to its website and Services, refuse service, or take appropriate legal action if any user violates these Terms &amp; Conditions, subject to applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'automated-tools-agents',
    title: 'Automated Tools & Agents',
    number: 14,
    content: (
      <>
        <p>
          <strong>14.1</strong> This section applies to any automated software, bots, AI agents, scripts, or other tools (&ldquo;Agents&rdquo;) used to access, browse, interact with, or collect information from the VEYNCORE website and Services, whether operating independently or on behalf of another person or organisation.
        </p>
        <p>
          <strong>14.2</strong> No Agent may access, use, or interact with the VEYNCORE website without our prior permission. Agents must not access the website if VEYNCORE has requested them to stop or restricted their access.
        </p>
        <p>
          <strong>14.3</strong> VEYNCORE reserves the right to restrict, block, or limit automated access to its website through technical or other measures whenever necessary to protect its Services, content, and users.
        </p>
        <p>
          <strong>14.4</strong> Any authorised Agent must:
        </p>
        <ul>
          <li>(a) Clearly identify itself as an automated tool when accessing our website.</li>
          <li>(b) Not disguise or misrepresent automated activity as human interaction.</li>
          <li>(c) Not bypass CAPTCHA systems, security checks, or other measures designed to distinguish human users from automated tools.</li>
          <li>(d) Provide truthful information when asked whether its interactions are automated.</li>
          <li>(e) Not bypass, interfere with, or attempt to avoid any technical restrictions or security measures implemented by VEYNCORE.</li>
          <li>(f) Not collect, copy, or extract website content, product information, or user data without appropriate authorisation.</li>
        </ul>
        <p>
          We reserves the right to block unauthorised Agents or take appropriate action against violations of this section, subject to applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'termination',
    title: 'Termination',
    number: 15,
    content: (
      <>
        <p>
          We may terminate these Terms &amp; Conditions or your access to the Services (or any part thereof) at our sole discretion, at any time, where permitted by applicable law. You will remain liable for all amounts due, obligations, or liabilities incurred up to and including the date of termination.
        </p>
        <p>
          The following sections will continue to apply following any termination: Intellectual Property, Feedback, Termination, Disclaimer of Warranties, Limitation of Liability, Indemnification, Severability, Waiver; Entire Agreement, Assignment, Governing Law, Privacy Policy, and any other provisions that by their nature should survive termination.
        </p>
      </>
    ),
  },
  {
    id: 'disclaimer-of-warranties',
    title: 'Disclaimer of Warranties',
    number: 16,
    content: (
      <>
        <p>
          The information presented on or through the VEYNCORE Services is provided for general informational purposes only. While we make reasonable efforts to ensure that product descriptions, prices, images, availability, and other information are accurate and up to date, we do not warrant that all information will always be complete, accurate, current, or free from errors or omissions. Product images are provided for illustrative purposes, and actual colours or appearances may vary depending on lighting, photography, and individual screen settings. Any reliance on information provided through the Services is at your own discretion.
        </p>
        <p style={{ fontWeight: 600, letterSpacing: '0.02em' }}>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE VEYNCORE WEBSITE AND SERVICES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS. VEYNCORE MAKES NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE CONTINUOUS AVAILABILITY, UNINTERRUPTED OPERATION, SECURITY, OR ERROR-FREE FUNCTIONING OF THE WEBSITE OR SERVICES. WE DO NOT GUARANTEE THAT THE WEBSITE WILL ALWAYS BE AVAILABLE, THAT TECHNICAL ERRORS WILL BE CORRECTED, OR THAT THE SERVICES WILL BE FREE FROM VIRUSES OR OTHER HARMFUL COMPONENTS.
        </p>
        <p>
          NOTHING IN THIS SECTION SHALL EXCLUDE, RESTRICT, OR LIMIT ANY WARRANTY, GUARANTEE, LIABILITY, OR CONSUMER RIGHT THAT CANNOT LAWFULLY BE EXCLUDED OR LIMITED UNDER APPLICABLE INDIAN LAW, INCLUDING THE CONSUMER PROTECTION ACT, 2019. THIS DISCLAIMER DOES NOT AFFECT YOUR STATUTORY RIGHTS OR ANY REMEDIES AVAILABLE IN RESPECT OF DEFECTIVE, NOT-AS-DESCRIBED, OR OTHERWISE NON-COMPLIANT PRODUCTS.
        </p>
      </>
    ),
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    number: 17,
    content: (
      <>
        <p style={{ fontWeight: 600, letterSpacing: '0.02em' }}>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VEYNCORE, ITS OWNERS, PARTNERS, DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, CONTRACTORS, AND SERVICE PROVIDERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL LOSS OR DAMAGE, INCLUDING LOSS OF PROFITS, REVENUE, SAVINGS, DATA, BUSINESS OPPORTUNITIES, OR REPLACEMENT COSTS, ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF THE SERVICES OR ANY PRODUCTS PURCHASED THROUGH VEYNCORE.
        </p>
        <p>
          This limitation applies to claims arising under contract, tort (including negligence), strict liability, or any other legal basis, including claims relating to errors or omissions in website content, temporary service interruptions, technical issues, or the use of information or materials made available through the Services, even if VEYNCORE has been advised of the possibility of such losses or damages. We shall not be responsible for losses arising from circumstances beyond our reasonable control, subject to applicable law.
        </p>
        <p>
          NOTHING IN THESE TERMS SHALL EXCLUDE OR LIMIT VEYNCORE’S LIABILITY FOR MATTERS THAT CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE INDIAN LAW, INCLUDING LIABILITY FOR DEFECTIVE PRODUCTS, UNFAIR TRADE PRACTICES, OR ANY STATUTORY CONSUMER RIGHTS AND REMEDIES AVAILABLE UNDER THE CONSUMER PROTECTION ACT, 2019.
        </p>
      </>
    ),
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    number: 18,
    content: (
      <>
        <p>
          You agree to indemnify, defend, and hold harmless VEYNCORE, its owners, partners, directors, officers, employees, affiliates, agents, contractors, licensors, and service providers from and against any losses, damages, liabilities, claims, demands, or expenses, including reasonable legal fees, arising from or related to:
        </p>
        <ul>
          <li>(1) Your breach of these Terms &amp; Conditions or any documents incorporated by reference;</li>
          <li>(2) Your violation of any applicable law, regulation, or the rights of any third party; or</li>
          <li>(3) Your misuse of or unauthorised access to the VEYNCORE website or Services.</li>
        </ul>
        <p>
          We will notify you of any claim for which indemnification is sought, provided that any delay or failure to provide such notice will not release you from your obligations unless you are materially prejudiced as a result. We are may manage the defence and settlement of such claims, including the appointment of legal representatives, at your expense where legally recoverable. However, no settlement requiring you to accept any non-monetary obligation shall be made without your prior consent, which shall not be unreasonably withheld.
        </p>
        <p>
          You agree to reasonably cooperate in the defence of any such claims by providing relevant information, documents, and assistance when requested. Nothing in this section shall require you to indemnify VEYNCORE for losses arising from VEYNCORE’s own negligence, unlawful conduct, or breach of applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'severability',
    title: 'Severability',
    number: 19,
    content: (
      <>
        <p>
          If any provision of these Terms &amp; Conditions is determined to be unlawful, void, or unenforceable under applicable law, such provision shall remain enforceable to the fullest extent permitted by law, and the unenforceable portion shall be deemed severed from these Terms &amp; Conditions. Such determination shall not affect the validity or enforceability of the remaining provisions.
        </p>
        <p>
          Nothing in these Terms &amp; Conditions shall limit or exclude any rights or remedies available to you under applicable consumer protection laws or any other laws that cannot be waived by contract. If any provision of these Terms conflicts with such rights, the applicable legal rights shall prevail.
        </p>
      </>
    ),
  },
  {
    id: 'waiver-entire-agreement',
    title: 'Waiver; Entire Agreement',
    number: 20,
    content: (
      <>
        <p>
          The failure of VEYNCORE to exercise or enforce any right or provision of these Terms &amp; Conditions shall not constitute a waiver of such right or provision.
        </p>
        <p>
          These Terms &amp; Conditions, together with our Privacy Policy, Shipping Policy, Refund, Return &amp; Cancellation Policy, and any other policies or operating rules published on our website, constitute the entire agreement and understanding between you and VEYNCORE and govern your access to and use of our Services. They supersede all prior or contemporaneous agreements, communications, and proposals, whether oral or written, relating to the subject matter of these Terms &amp; Conditions.
        </p>
        <p>
          Any ambiguity in the interpretation of these Terms &amp; Conditions shall not automatically be interpreted against the party responsible for drafting them. Nothing in this section shall override any rights or protections available under applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'assignment',
    title: 'Assignment',
    number: 21,
    content: (
      <p>
        You may not delegate, transfer, or assign these Terms &amp; Conditions or any of your rights or obligations under these Terms without the prior written consent of VEYNCORE. Any unauthorised attempt to do so shall be null and void. VEYNCORE may transfer, assign, or delegate these Terms &amp; Conditions and its rights and obligations without your prior consent or notice, subject to applicable law.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    number: 22,
    content: (
      <>
        <p>
          These Terms &amp; Conditions shall be governed by and interpreted in accordance with the laws of India, without regard to conflict-of-law principles.
        </p>
        <p>
          You and VEYNCORE agree that any disputes arising out of or relating to these Terms or your use of the Services shall be subject to the jurisdiction of the competent courts in Kerala, India, subject to applicable law. Nothing in this section limits any rights you may have to bring claims before a competent consumer forum or rely on mandatory legal protections available under applicable Indian law.
        </p>
      </>
    ),
  },
  {
    id: 'translations',
    title: 'Translations',
    number: 23,
    content: (
      <p>
        These Terms &amp; Conditions may be made available in languages other than English for your convenience. In the event of any inconsistency or conflict between the English version and any translated version, the English version shall prevail to the extent permitted by applicable law. Any disputes arising out of these Terms &amp; Conditions shall be interpreted in accordance with the English version, subject to applicable law.
      </p>
    ),
  },
  {
    id: 'headings',
    title: 'Headings',
    number: 24,
    content: (
      <p>
        The headings used in these Terms &amp; Conditions are included for convenience and reference purposes only and shall not limit, define, or otherwise affect the interpretation of any provision of these Terms.
      </p>
    ),
  },
  {
    id: 'electronic-communications',
    title: 'Electronic Communications',
    number: 25,
    content: (
      <p>
        By using the VEYNCORE Services, contacting us, or placing an order, you agree that we may communicate with you electronically through WhatsApp, email, telephone, SMS, or other available communication channels. Such communications may relate to your orders, payments, delivery updates, returns, exchanges, customer support, these Terms &amp; Conditions, or other service-related matters. You are responsible for providing accurate and up-to-date contact information to ensure that you receive relevant communications.
      </p>
    ),
  },
  {
    id: 'changes-to-terms-conditions',
    title: 'Changes to Terms & Conditions',
    number: 26,
    content: (
      <>
        <p>
          You may review the most current version of these Terms &amp; Conditions at any time on this page.
        </p>
        <p>
          We reserves the right, at its discretion, to update, modify, or replace any part of these Terms &amp; Conditions by publishing the revised version on our website. It is your responsibility to review this page periodically for any changes.
        </p>
        <p>
          Where required by applicable law, we will notify you of material changes and specify the date on which such changes become effective. Your continued use of or access to the VEYNCORE Services after the revised Terms &amp; Conditions have been published shall constitute acceptance of those changes, to the extent permitted by applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'contact-information',
    title: 'Contact information',
    number: 27,
    content: (
      <>
        <p>
          Questions about the Terms of Service should be sent to us at{' '}
          <a
            href="mailto:veyncore.in@gmail.com"
            style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'underline' }}
          >
            veyncore.in@gmail.com
          </a>.
        </p>
        <p>
          Our contact information is posted in our contact information policy.
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

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms and conditions"
      subtitle="Operating terms, ordering guidelines, and legal framework governing your interactions with VEYNCORE."
      lastUpdated="November 2026"
      sections={termsSections}
    />
  );
}
