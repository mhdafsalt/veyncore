'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import {
  FaWhatsapp,
  FaChevronDown,
  FaArrowRight,
  FaCheckCircle,
  FaLayerGroup,
  FaRulerCombined,
  FaTruck,
  FaUndoAlt,
  FaShieldAlt,
} from 'react-icons/fa';
import './AboutPage.css';

/**
 * FAQ Data for AEO (Answer Engine Optimization) & User Navigation
 * Answers are concise, factual, and strictly based on verified website features.
 */
const FAQS = [
  {
    id: 'faq-1',
    question: 'What is VEYNCORE?',
    answer:
      'VEYNCORE is an independent contemporary streetwear brand and online clothing store based in India. The brand specializes in modern apparel, relaxed silhouettes, and curated fashion pieces designed for individuals seeking authentic style and personal expression.',
  },
  {
    id: 'faq-2',
    question: 'What type of clothing does VEYNCORE offer?',
    answer:
      'VEYNCORE offers a focused collection of contemporary streetwear garments including heavyweight oversized T-shirts, relaxed baggy pants, straight-fit denim, bootcut trousers, and thoughtfully sourced fashion pieces through VEYN-SELECTS, as well as everyday lifestyle accessories in VEYN-OBJECTS.',
  },
  {
    id: 'faq-3',
    question: 'Where can I shop VEYNCORE collections?',
    answer:
      'You can explore and shop all official VEYNCORE collections online directly through our website at veyncore.in. Customers can browse drops, review accurate size charts, and place orders through the online cart or via our official WhatsApp concierge.',
  },
  {
    id: 'faq-4',
    question: 'What is VEYN-SELECTS?',
    answer:
      'VEYN-SELECTS is VEYNCORE’s dedicated curation line. It features handpicked denim and statement fashion pieces selected to reflect the brand’s creative direction, relaxed drape, and distinctive streetwear aesthetic, with each piece thoroughly quality-checked before dispatch.',
  },
  {
    id: 'faq-5',
    question: 'How can I place an order with VEYNCORE?',
    answer:
      'You can place an order directly on our website by adding products to your bag and checking out, or by using our direct WhatsApp ordering channel (+91 94463 91166). The WhatsApp concierge offers real-time sizing assistance, order confirmation, and personalized support.',
  },
  {
    id: 'faq-6',
    question: 'Does VEYNCORE offer online shopping?',
    answer:
      'Yes, VEYNCORE operates primarily as a digital-first streetwear store serving customers throughout India with nationwide door-to-door courier delivery and live order tracking.',
  },
  {
    id: 'faq-7',
    question: 'How can I contact VEYNCORE?',
    answer:
      'You can contact VEYNCORE through our official WhatsApp concierge at +91 94463 91166 (available Monday to Saturday, 10:00 AM – 8:00 PM IST), via email at veyncore.in@gmail.com, or through the contact message form on our website.',
  },
  {
    id: 'faq-8',
    question: 'Where can I find shipping and return information?',
    answer:
      'Official shipping and return policies are accessible in our website footer. Orders are typically delivered within 3–7 working days from dispatch. We provide a 7-day issue reporting window from delivery for verified damaged, defective, or incorrect products (a continuous unboxing video is required).',
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  // Structured Data Schema Graph (AboutPage + Organization + BreadcrumbList + FAQPage)
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://veyncore.in/pages/about#webpage',
        url: 'https://veyncore.in/pages/about',
        name: 'About VEYNCORE | Contemporary Streetwear & Curated Fashion',
        description:
          'Discover VEYNCORE: contemporary streetwear, oversized T-shirts, baggy pants, and curated fashion pieces via VEYN-SELECTS. Built for individuality and modern style.',
        inLanguage: 'en-IN',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://veyncore.in/#website',
          url: 'https://veyncore.in',
          name: 'VEYNCORE',
          description: 'Contemporary Streetwear & Curated Fashion Store',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://veyncore.in/#organization',
        name: 'VEYNCORE',
        url: 'https://veyncore.in',
        logo: {
          '@type': 'ImageObject',
          url: 'https://veyncore.in/images/veyncoreLogo_black.svg',
          caption: 'VEYNCORE Streetwear',
        },
        email: 'veyncore.in@gmail.com',
        telephone: '+919446391166',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+919446391166',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['en', 'hi'],
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://veyncore.in/pages/about#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://veyncore.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About VEYNCORE',
            item: 'https://veyncore.in/pages/about',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://veyncore.in/pages/about#faq',
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="about-page">
      {/* Dynamic JSON-LD Structured Data for Search & Answer Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Global Store Header (activeCategory null on institutional pages) */}
      <StoreHeader
        initialCategory={null}
        showMainCategories={true}
        showSubCategories={false}
      />

      <main className="about-page__main" id="main-content">
        {/* =================================================================
            1. HERO SECTION
            ================================================================= */}
        <section className="about-hero" aria-label="About VEYNCORE Hero">
          <div className="about-hero__container">
            <span className="about-hero__eyebrow">
              CONTEMPORARY STREETWEAR &bull; CURATED FASHION
            </span>
            <h1 className="about-hero__title">ABOUT VEYNCORE</h1>
            <p className="about-hero__statement">
              Modern silhouettes, intentional proportions, and curated fashion
              crafted for personal identity.
            </p>
            <p className="about-hero__desc">
              VEYNCORE is an independent online streetwear store designed for
              those who view clothing as a medium of self-expression. We blend
              relaxed tailoring, oversized silhouettes, and disciplined curation
              to deliver modern wardrobe essentials that effortlessly stand out.
            </p>

            {/* Quick Metrics & Architecture Strip */}
            <div className="about-metrics" role="list">
              <div className="about-metric" role="listitem">
                <span className="about-metric__label">BRAND LINES</span>
                <span className="about-metric__value">VEYN SELECTS &amp; OBJECTS</span>
              </div>
              <div className="about-metric" role="listitem">
                <span className="about-metric__label">SIGNATURE FITS</span>
                <span className="about-metric__value">OVERSIZED, BAGGY &amp; STRAIGHT</span>
              </div>
              <div className="about-metric" role="listitem">
                <span className="about-metric__label">ORDERING CHANNELS</span>
                <span className="about-metric__value">ONLINE CART &amp; WHATSAPP</span>
              </div>
              <div className="about-metric" role="listitem">
                <span className="about-metric__label">PAN-INDIA DELIVERY</span>
                <span className="about-metric__value">3–7 WORKING DAYS</span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            2. ABOUT VEYNCORE (AEO DIRECT DEFINITION)
            ================================================================= */}
        <section className="about-section about-intro" aria-labelledby="heading-about">
          <div className="about-container">
            <div className="about-section-header">
              <span className="about-section-tag">BRAND IDENTITY</span>
              <h2 id="heading-about" className="about-section-title">
                What Is VEYNCORE?
              </h2>
            </div>

            <div className="about-intro__content">
              <p className="about-intro__lead">
                <strong>VEYNCORE</strong> is a contemporary streetwear brand and
                curated online clothing store focused on modern fashion, relaxed
                silhouettes, and distinctive aesthetic direction.
              </p>
              <p className="about-text">
                Born out of an appreciation for modern street culture and minimal
                editorial design, VEYNCORE provides thoughtfully assembled drops
                that challenge rigid fashion categories. Rather than chasing
                transient micro-trends, our collections emphasize balanced
                proportions, durable fabric hand-feel, and versatile staples that
                integrate seamlessly into daily streetwear rotation.
              </p>
              <p className="about-text">
                Every drop reflects our dedication to individuality: whether it
                is the precise drop of an oversized shoulder seam, the stack of
                wide-leg denim over sneakers, or the subtle accent of a curated
                lifestyle accessory, VEYNCORE offers pieces designed to be styled
                distinctly by every wearer.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================================
            3. OUR FASHION & COLLECTIONS
            ================================================================= */}
        <section className="about-section about-collections" aria-labelledby="heading-collections">
          <div className="about-container">
            <div className="about-section-header">
              <span className="about-section-tag">OUR WARDROBE</span>
              <h2 id="heading-collections" className="about-section-title">
                Our Fashion &amp; Streetwear Collections
              </h2>
              <p className="about-section-desc">
                Engineered with deliberate cuts and relaxed dimensions, our
                collections cover essential streetwear categories built for modern
                living.
              </p>
            </div>

            <div className="about-grid about-grid--4">
              {/* Category 1: Oversized T-Shirts */}
              <article className="about-card">
                <div className="about-card__header">
                  <span className="about-card__index">01</span>
                  <h3 className="about-card__title">Oversized T-Shirts</h3>
                </div>
                <p className="about-card__text">
                  Signature relaxed-fit tees featuring dropped shoulders,
                  structured ribbed collars, and heavyweight cotton drape.
                  Engineered to hold their sculptural shape throughout all-day
                  movement.
                </p>
                <Link href="/collections/all-drops" className="about-card__link">
                  <span>Explore Drops</span>
                  <FaArrowRight aria-hidden="true" />
                </Link>
              </article>

              {/* Category 2: Denim & Baggy Pants */}
              <article className="about-card">
                <div className="about-card__header">
                  <span className="about-card__index">02</span>
                  <h3 className="about-card__title">Denim &amp; Baggy Pants</h3>
                </div>
                <p className="about-card__text">
                  Wide-leg cuts and spacious leg openings designed with
                  intentional stacking over footwear. Premium washed denim and
                  relaxed trousers that blend skate-culture volume with contemporary
                  streetwear aesthetics.
                </p>
                <Link href="/collections/all" className="about-card__link">
                  <span>View Denim Fits</span>
                  <FaArrowRight aria-hidden="true" />
                </Link>
              </article>

              {/* Category 3: Straight-Fit & Bootcut Pants */}
              <article className="about-card">
                <div className="about-card__header">
                  <span className="about-card__index">03</span>
                  <h3 className="about-card__title">Straight-Fit &amp; Bootcut</h3>
                </div>
                <p className="about-card__text">
                  Clean vertical lines with tailored knee-to-hem flares that break
                  effortlessly over sneakers and boots. Versatile streetwear
                  trousers that easily bridge casual daywear and elevated evening
                  ensembles.
                </p>
                <Link href="/collections/all" className="about-card__link">
                  <span>Browse Pants</span>
                  <FaArrowRight aria-hidden="true" />
                </Link>
              </article>

              {/* Category 4: Curated Curation (VEYN SELECTS & OBJECTS) */}
              <article className="about-card">
                <div className="about-card__header">
                  <span className="about-card__index">04</span>
                  <h3 className="about-card__title">Curated Selects &amp; Objects</h3>
                </div>
                <p className="about-card__text">
                  Handpicked fashion pieces via <strong>VEYN-SELECTS</strong> and
                  functional lifestyle accessories through{' '}
                  <strong>VEYN-OBJECTS</strong>. Thoughtfully curated to provide
                  the subtle details that complete your style identity.
                </p>
                <Link href="/veyn-objects" className="about-card__link">
                  <span>Discover Objects</span>
                  <FaArrowRight aria-hidden="true" />
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* =================================================================
            4. OUR BRAND PHILOSOPHY
            ================================================================= */}
        <section className="about-section about-philosophy" aria-labelledby="heading-philosophy">
          <div className="about-container">
            <div className="about-section-header">
              <span className="about-section-tag">CORE PRINCIPLES</span>
              <h2 id="heading-philosophy" className="about-section-title">
                Our Brand Philosophy
              </h2>
              <p className="about-section-desc">
                Everything we design, source, and curate is guided by five
                foundational pillars.
              </p>
            </div>

            <div className="about-pillars">
              <div className="about-pillar">
                <div className="about-pillar__marker">01</div>
                <div className="about-pillar__content">
                  <h3 className="about-pillar__title">Authentic Individuality</h3>
                  <p className="about-pillar__text">
                    We reject mass uniformity. Streetwear at VEYNCORE is an open
                    canvas where personal taste leads and conventional styling rules
                    step aside.
                  </p>
                </div>
              </div>

              <div className="about-pillar">
                <div className="about-pillar__marker">02</div>
                <div className="about-pillar__content">
                  <h3 className="about-pillar__title">Everyday Function &amp; Ease</h3>
                  <p className="about-pillar__text">
                    Streetwear must be lived in. We prioritize comfortable
                    silhouettes, breathable weights, and unrestrictive cuts that
                    perform throughout daily city life.
                  </p>
                </div>
              </div>

              <div className="about-pillar">
                <div className="about-pillar__marker">03</div>
                <div className="about-pillar__content">
                  <h3 className="about-pillar__title">Modern Street Aesthetics</h3>
                  <p className="about-pillar__text">
                    From monochromatic palettes to sculptural oversized lines, our
                    visual language is rooted in timeless street culture, architectural
                    shapes, and understated luxury.
                  </p>
                </div>
              </div>

              <div className="about-pillar">
                <div className="about-pillar__marker">04</div>
                <div className="about-pillar__content">
                  <h3 className="about-pillar__title">Personal Self-Expression</h3>
                  <p className="about-pillar__text">
                    Fashion is not just what you wear—it is how you move through
                    the world. Our garments are intentionally versatile to give
                    you complete creative freedom.
                  </p>
                </div>
              </div>

              <div className="about-pillar">
                <div className="about-pillar__marker">05</div>
                <div className="about-pillar__content">
                  <h3 className="about-pillar__title">Disciplined Curation</h3>
                  <p className="about-pillar__text">
                    Rather than overwhelming catalogs, we curate focused collections
                    where every cut, seam, and colorway serves a deliberate role in
                    a modern wardrobe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            5. WHY CHOOSE VEYNCORE?
            ================================================================= */}
        <section className="about-section about-why" aria-labelledby="heading-why">
          <div className="about-container">
            <div className="about-section-header">
              <span className="about-section-tag">VERIFIED ADVANTAGES</span>
              <h2 id="heading-why" className="about-section-title">
                Why Choose VEYNCORE?
              </h2>
              <p className="about-section-desc">
                Clear, honest features based entirely on our actual website
                operations and verified customer services.
              </p>
            </div>

            <div className="about-features-grid">
              <div className="about-feature">
                <div className="about-feature__icon">
                  <FaLayerGroup aria-hidden="true" />
                </div>
                <h3 className="about-feature__title">Dual Brand Architecture</h3>
                <p className="about-feature__text">
                  Clear separation between <strong>VEYN-SELECTS</strong> (apparel
                  and curated denim drops) and <strong>VEYN-OBJECTS</strong> (accessories
                  and daily essentials) for focused shopping.
                </p>
              </div>

              <div className="about-feature">
                <div className="about-feature__icon">
                  <FaWhatsapp aria-hidden="true" />
                </div>
                <h3 className="about-feature__title">Instant WhatsApp Concierge</h3>
                <p className="about-feature__text">
                  Direct personal communication via our official WhatsApp channel
                  (+91 94463 91166) for real-time sizing advice, drop inquiries,
                  and express order confirmations.
                </p>
              </div>

              <div className="about-feature">
                <div className="about-feature__icon">
                  <FaRulerCombined aria-hidden="true" />
                </div>
                <h3 className="about-feature__title">Accurate Measurement Charts</h3>
                <p className="about-feature__text">
                  Detailed manual measurements (chest, length, waist, inseam)
                  displayed clearly on product pages to help you choose your ideal
                  fit before ordering.
                </p>
              </div>

              <div className="about-feature">
                <div className="about-feature__icon">
                  <FaTruck aria-hidden="true" />
                </div>
                <h3 className="about-feature__title">Pan-India Tracked Shipping</h3>
                <p className="about-feature__text">
                  Reliable door-to-door courier delivery across India, typically
                  completed within 3–7 working days from dispatch with tracking
                  updates sent via WhatsApp and email.
                </p>
              </div>

              <div className="about-feature">
                <div className="about-feature__icon">
                  <FaUndoAlt aria-hidden="true" />
                </div>
                <h3 className="about-feature__title">Transparent 7-Day Policy</h3>
                <p className="about-feature__text">
                  Clear resolution guidelines with a 7-day reporting window for
                  damaged, defective, or incorrect deliveries backed by continuous
                  unboxing video verification.
                </p>
              </div>

              <div className="about-feature">
                <div className="about-feature__icon">
                  <FaShieldAlt aria-hidden="true" />
                </div>
                <h3 className="about-feature__title">Direct Brand Authenticity</h3>
                <p className="about-feature__text">
                  Every product is sourced, cataloged, and quality-checked
                  directly by VEYNCORE, ensuring 100% original pieces delivered
                  directly to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            6. VEYN-SELECTS CURATED LINE DEEP DIVE
            ================================================================= */}
        <section className="about-section about-selects" aria-labelledby="heading-selects">
          <div className="about-container">
            <div className="about-selects__wrapper">
              <div className="about-selects__content">
                <span className="about-section-tag">CURATION SPOTLIGHT</span>
                <h2 id="heading-selects" className="about-selects__title">
                  VEYN-SELECTS: Thoughtfully Curated Fashion
                </h2>
                <p className="about-selects__lead">
                  A dedicated collection of fashion pieces handpicked to reflect
                  VEYNCORE’s unique vision and creative direction.
                </p>
                <p className="about-text">
                  Every piece in <strong>VEYN-SELECTS</strong> is thoughtfully
                  sourced and quality-checked, with an uncompromising focus on
                  streetwear aesthetics, silhouette volume, and individuality.
                  From heavyweight drop-shoulder tees to statement denim washes,
                  SELECTS represents our most intentional aesthetic exploration.
                </p>
                <div className="about-selects__points">
                  <div className="about-selects__point">
                    <FaCheckCircle className="about-selects__check" aria-hidden="true" />
                    <span>Handpicked cuts that complement contemporary streetwear outfits</span>
                  </div>
                  <div className="about-selects__point">
                    <FaCheckCircle className="about-selects__check" aria-hidden="true" />
                    <span>Rigorous pre-dispatch quality checks for finish and construction</span>
                  </div>
                  <div className="about-selects__point">
                    <FaCheckCircle className="about-selects__check" aria-hidden="true" />
                    <span>Limited drop rotations ensuring distinctive wardrobe originality</span>
                  </div>
                </div>
                <div className="about-selects__actions">
                  <Link href="/collections/all-drops" className="about-btn about-btn--black">
                    EXPLORE VEYN-SELECTS
                  </Link>
                  <Link href="/veyn-objects" className="about-btn about-btn--outline">
                    VIEW VEYN-OBJECTS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            7. FREQUENTLY ASKED QUESTIONS (FAQ - AEO OPTIMIZED)
            ================================================================= */}
        <section className="about-section about-faq" aria-labelledby="heading-faq">
          <div className="about-container">
            <div className="about-section-header about-section-header--centered">
              <span className="about-section-tag">FREQUENTLY ASKED QUESTIONS</span>
              <h2 id="heading-faq" className="about-section-title">
                Common Questions About VEYNCORE
              </h2>
              <p className="about-section-desc">
                Everything you need to know about our collections, sizing, orders, and delivery.
              </p>
            </div>

            <div className="about-faq__list" role="region" aria-label="FAQ List">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`about-faq__item ${isOpen ? 'about-faq__item--open' : ''}`}
                  >
                    <button
                      type="button"
                      className="about-faq__question-btn"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      id={`faq-question-${index}`}
                    >
                      <span className="about-faq__question-text">
                        <span className="about-faq__num">0{index + 1}.</span> {faq.question}
                      </span>
                      <FaChevronDown
                        className={`about-faq__chevron ${
                          isOpen ? 'about-faq__chevron--rotated' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      className={`about-faq__answer-wrap ${
                        isOpen ? 'about-faq__answer-wrap--open' : ''
                      }`}
                    >
                      <div className="about-faq__answer-inner">
                        <p className="about-faq__answer-text">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================
            8. CALL TO ACTION & CONNECT
            ================================================================= */}
        <section className="about-cta" aria-label="Connect with VEYNCORE">
          <div className="about-container">
            <div className="about-cta__card">
              <span className="about-cta__tag">READY TO EXPLORE?</span>
              <h2 className="about-cta__title">DISCOVER THE LATEST DROPS</h2>
              <p className="about-cta__desc">
                Explore our curated streetwear catalog, check size guides, or
                connect directly with our WhatsApp concierge for tailored assistance.
              </p>
              <div className="about-cta__actions">
                <Link href="/collections/all-drops" className="about-btn about-btn--white">
                  SHOP ALL DROPS
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    'Hello VEYNCORE, I would like to learn more about your latest drops.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-btn about-btn--whatsapp"
                >
                  <FaWhatsapp aria-hidden="true" /> CHAT ON WHATSAPP
                </a>
                <Link href="/pages/contact" className="about-btn about-btn--ghost">
                  CONTACT SUPPORT
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Store Footer */}
      <Footer />
    </div>
  );
}
