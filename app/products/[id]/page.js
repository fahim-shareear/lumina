import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductById, getProducts } from '@/lib/products';
import ProductImage from '@/components/ProductImage';
import styles from './page.module.css';

export async function generateStaticParams() {
  const products = getProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const product = getProductById(params.id);
  if (!product) return { title: 'Not Found' };
  return { title: `${product.title} – Lumina`, description: product.shortDescription };
}

const priorityColors = {
  Featured: { bg: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: 'rgba(201,168,76,0.3)' },
  High: { bg: 'rgba(76,175,125,0.1)', color: '#4caf7d', border: 'rgba(76,175,125,0.3)' },
  Normal: { bg: 'rgba(120,120,140,0.12)', color: '#8a8a9a', border: 'rgba(120,120,140,0.2)' },
};

export default function ProductDetailPage({ params }) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const pc = priorityColors[product.priority] || priorityColors.Normal;

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Back button */}
        <Link href="/products" className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 8H1M6 3L1 8l5 5"/>
          </svg>
          Back to Catalog
        </Link>

        <div className={styles.layout}>
          {/* Image */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              <ProductImage
                src={product.imageUrl}
                alt={product.title}
                className={styles.image}
                width={600}
                height={400}
              />
            </div>
          </div>

          {/* Info */}
          <div className={styles.infoCol}>
            <div className={styles.tags}>
              <span className="tag">{product.category}</span>
              <span
                className={styles.priorityBadge}
                style={{ background: pc.bg, color: pc.color, border: `1px solid ${pc.border}` }}
              >
                {product.priority}
              </span>
            </div>

            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.shortDesc}>{product.shortDescription}</p>

            <div className={styles.priceRow}>
              <span className={styles.price}>${product.price?.toLocaleString()}</span>
              <span className={styles.priceLabel}>USD</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Listed</span>
                <span className={styles.metaValue}>{product.createdAt}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Category</span>
                <span className={styles.metaValue}>{product.category}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Priority</span>
                <span className={styles.metaValue} style={{ color: pc.color }}>{product.priority}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Seller</span>
                <span className={styles.metaValue}>{product.addedBy}</span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.fullDesc}>
              <h3 className={styles.descTitle}>About this piece</h3>
              <p className={styles.descText}>{product.fullDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
