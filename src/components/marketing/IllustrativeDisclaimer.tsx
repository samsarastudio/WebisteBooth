export function IllustrativeDisclaimer({ className = '' }: { className?: string }) {
  return (
    <p
      className={`text-xs text-text-secondary leading-relaxed max-w-2xl mx-auto text-center ${className}`}
    >
      Images are for illustrative purposes only. Real sample images can be provided when you request
      a quote. Our custom design capabilities go far beyond what is shown here.
    </p>
  )
}
