import Link from 'next/link';
import { formatPrice, truncateText } from '@/lib/helpers';
import styles from './ProductCard.module.css';

/** Props accepted by the {@link ProductCard} component. */
export interface ProductCardProps {
  /** Unique product identifier. */
  id: string;
  /** Display name of the product. */
  name: string;
  /** Price in MXN (whole number, no decimals). */
  price: number;
  /** Full product description — will be truncated to 100 chars. */
  description: string;
  /** URL of the product image. */
  imageUrl: string;
}

/**
 * ProductCard — displays a single furniture product as an elevated card.
 *
 * Features:
 * - Image with subtle zoom on hover
 * - Formatted MXN price badge overlay
 * - Truncated description
 * - "Ver detalles" link to the product page
 *
 * @example
 * ```tsx
 * <ProductCard
 *   id="1"
 *   name="Mesa de Centro"
 *   price={8500}
 *   description="Mesa artesanal de roble macizo…"
 *   imageUrl="/images/mesa.jpg"
 * />
 * ```
 */
export default function ProductCard({
  id,
  name,
  price,
  description,
  imageUrl,
}: ProductCardProps) {
  return (
    <article className={styles.card}>
      {/* Image + price badge */}
      <div className={styles.imageContainer}>
        {/* Using a plain <img> to avoid requiring next/image domain config for every source */}
        <img
          className={styles.image}
          src={imageUrl}
          alt={name}
          loading="lazy"
        />
        <span className={styles.priceBadge}>{formatPrice(price)}</span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{truncateText(description, 100)}</p>
        <Link href={`/productos/${id}`} className={styles.detailsLink}>
          Ver detalles →
        </Link>
      </div>
    </article>
  );
}
