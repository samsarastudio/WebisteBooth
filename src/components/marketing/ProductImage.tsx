import Image, { type ImageProps } from 'next/image'

/** High-quality product imagery — avoids soft default Next.js compression. */
export function ProductImage({
  alt,
  className,
  priority,
  sizes = '(max-width: 768px) 100vw, 560px',
  ...props
}: Omit<ImageProps, 'alt' | 'quality'> & { alt: string }) {
  return (
    <Image
      alt={alt}
      className={`crisp-img ${className ?? ''}`}
      quality={95}
      sizes={sizes}
      priority={priority}
      {...props}
    />
  )
}
