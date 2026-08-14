'use client';

import { type CSSProperties } from 'react';
import styles from './ImageZoom.module.css';

/** Props accepted by the {@link ImageZoom} component. */
export interface ImageZoomProps {
  /** Image source URL. */
  src: string;
  /** Accessible alt text. */
  alt: string;
  /** Container width (CSS value, e.g. `"100%"` or `400`). */
  width?: number | string;
  /** Container height (CSS value, e.g. `"300px"` or `300`). */
  height?: number | string;
  /** Optional extra class name for the outer container. */
  className?: string;
}

/**
 * ImageZoom — an image that smoothly scales up on hover.
 *
 * The outer container clips overflow so the zoom effect stays
 * within bounds.  No JavaScript event handlers are needed — the
 * entire effect is driven by CSS `:hover` on the container.
 *
 * @example
 * ```tsx
 * <ImageZoom
 *   src="/images/mesa.jpg"
 *   alt="Mesa de centro"
 *   width={400}
 *   height={300}
 * />
 * ```
 */
export default function ImageZoom({
  src,
  alt,
  width,
  height,
  className,
}: ImageZoomProps) {
  const containerStyle: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${styles.container}${className ? ` ${className}` : ''}`}
      style={containerStyle}
    >
      <img
        className={styles.image}
        src={src}
        alt={alt}
        loading="lazy"
      />
    </div>
  );
}
