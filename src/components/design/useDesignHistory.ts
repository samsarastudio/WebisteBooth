'use client'

import { useCallback, useState } from 'react'

export function useDesignHistory<T>(initial: T, maxSteps = 20) {
  const [present, setPresent] = useState(initial)
  const [past, setPast] = useState<T[]>([])
  const [future, setFuture] = useState<T[]>([])

  const push = useCallback(
    (next: T | ((prev: T) => T)) => {
      setPresent((prev) => {
        const value = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        setPast((p) => [...p.slice(-maxSteps + 1), prev])
        setFuture([])
        return value
      })
    },
    [maxSteps],
  )

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p
      const previous = p[p.length - 1]
      setPresent((current) => {
        setFuture((f) => [current, ...f])
        return previous
      })
      return p.slice(0, -1)
    })
  }, [])

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f
      const next = f[0]
      setPresent((current) => {
        setPast((p) => [...p, current])
        return next
      })
      return f.slice(1)
    })
  }, [])

  const reset = useCallback((value: T) => {
    setPast([])
    setFuture([])
    setPresent(value)
  }, [])

  return {
    state: present,
    setState: push,
    undo,
    redo,
    reset,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  }
}
