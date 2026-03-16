import Link from 'next/link';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

export default async function HomePage() {
  const products = (await getProducts()).slice(0, 3);

  const features = [
    {
      icon: '◈',
      title: 'Curator-Vetted',
      description: 'Every product is hand-selected by our team of experts for exceptional quality and provenance.',
    },
    {
      icon: '◇',
      title: 'Artisan Heritage',
      description: 'We partner exclusively with makers who hold generations of craft knowledge in their hands.',
    },
    {
      icon: '◉',
      title: 'Authenticated Origin',
      description: 'Full supply-chain transparency and certificate of authenticity for every piece listed.',
    },
    {
      icon: '◐',
      title: 'White-Glove Service',
      description: 'Dedicated concierge support and bespoke packaging for every order, worldwide.',
    },
  ];

  const stats = [
    { value: '2,400+', label: 'Curated Products' },
    { value: '840+', label: 'Artisan Partners' },
    { value: '48', label: 'Countries Served' },
    { value: '99.2%', label: 'Satisfaction Rate' },
  ];

  const testimonials = [
    {
      quote: 'Lumina has fundamentally changed how I discover and acquire beautiful objects. Every piece tells a story.',
      author: 'Isabelle Marchand',
      role: 'Interior Designer, Paris',
      avatar: 'I',
    },
    {
      quote: 'The level of curation here is unlike anything else. I trust Lumina to only surface things that are genuinely worth owning.',
      author: 'Kenji Watanabe',
      role: 'Architect, Tokyo',
      avatar: 'K',
    },
    {
      quote: 'I have gifted items from Lumina to my most discerning clients. The quality and presentation are always impeccable.',
      author: 'Amara Osei',
      role: 'Brand Consultant, London',
      avatar: 'A',
    },
  ];

  const categories = [
    { name: 'Timepieces', icon: '⌚', count: 84, color: '#c9a84c' },
    { name: 'Fragrance', icon: '✿', count: 62, color: '#a084c9' },
    { name: 'Home', icon: '⌂', count: 140, color: '#84c9a0' },
    { name: 'Textiles', icon: '◈', count: 56, color: '#c98484' },
    { name: 'Beauty', icon: '◉', count: 78, color: '#c984b8' },
    { name: 'Stationery', icon: '✎', count: 34, color: '#84afc9' },
  ];

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOrb1} />
        <div className={styles.heroOrb2} />
        <div className="container">
          <div className={styles.heroContent}>
            <span className="badge badge-accent">Est. 2024 · Curated Excellence</span>
            <h1 className={styles.heroTitle}>
              Where craft becomes
              <br />
              <span className={styles.heroAccent}>desire.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Lumina is the marketplace for the genuinely discerning — a curated collection of extraordinary objects, each chosen for its rarity, provenance, and enduring worth.
            </p>
            <div className={styles.heroCTA}>
              <Link href="/products" className="btn-primary">
                Explore Catalog
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 7h12M8 3l4 4-4 4"/>
                </svg>
              </Link>
              <Link href="/register" className="btn-secondary">
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.heroScrollIndicator}>
          <span>Scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Why Lumina</span>
            <h2 className={styles.sectionTitle}>A standard set apart</h2>
            <p className={styles.sectionSubtitle}>
              We apply a rigorous selection process to every product in our marketplace.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeaderRow}>
            <div>
              <span className="section-label">Featured</span>
              <h2 className={styles.sectionTitle}>Selected pieces</h2>
            </div>
            <Link href="/products" className="btn-secondary">
              View all
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 7h12M8 3l4 4-4 4"/>
              </svg>
            </Link>
          </div>
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="about" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Browse</span>
            <h2 className={styles.sectionTitle}>Every category, perfected</h2>
          </div>
          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.name}`}
                className={styles.categoryCard}
                style={{ '--cat-color': cat.color }}
              >
                <span className={styles.catIcon}>{cat.icon}</span>
                <div>
                  <p className={styles.catName}>{cat.name}</p>
                  <p className={styles.catCount}>{cat.count} items</p>
                </div>
                <svg className={styles.catArrow} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 8h14M9 3l5 5-5 5"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className={styles.testimonialSection}>
        <div className={styles.testimonialOrb} />
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Voices</span>
            <h2 className={styles.sectionTitle}>From those who know</h2>
          </div>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t) => (
              <div key={t.author} className={styles.testimonialCard}>
                <div className={styles.testimonialQuoteIcon}>&quot;</div>
                <p className={styles.testimonialQuote}>{t.quote}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.avatar}</div>
                  <div>
                    <p className={styles.testimonialName}>{t.author}</p>
                    <p className={styles.testimonialRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerOrb1} />
        <div className={styles.ctaBannerOrb2} />
        <div className="container">
          <div className={styles.ctaContent}>
            <span className="badge badge-accent">Join Lumina</span>
            <h2 className={styles.ctaTitle}>Ready to sell extraordinary?</h2>
            <p className={styles.ctaSubtitle}>
              Apply to become a Lumina seller. We work with artisans, independent studios, and rare find specialists worldwide.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/register" className="btn-primary">
                Create an Account
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
