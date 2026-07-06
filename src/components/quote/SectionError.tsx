'use client'

export function SectionError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-4 py-3 rounded-lg mb-4"
    >
      {message}
    </p>
  )
}
