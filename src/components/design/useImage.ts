'use client'

import { useEffect, useState } from 'react'

export function useImage(src: string, crossOrigin?: string): [HTMLImageElement | undefined, 'loading' | 'loaded' | 'failed'] {
  const [image, setImage] = useState<HTMLImageElement | undefined>()
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')

  useEffect(() => {
    if (!src) {
      setImage(undefined)
      setStatus('failed')
      return
    }

    setStatus('loading')
    const img = new window.Image()
    if (crossOrigin) img.crossOrigin = crossOrigin
    img.onload = () => {
      setImage(img)
      setStatus('loaded')
    }
    img.onerror = () => {
      setImage(undefined)
      setStatus('failed')
    }
    img.src = src
  }, [src, crossOrigin])

  return [image, status]
}
