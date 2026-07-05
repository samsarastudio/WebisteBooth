'use client'

import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

export function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="card divide-y divide-border">
      {faqs.map((faq, i) => {
        const open = openIndex === i
        return (
          <div key={i} className="px-5 md:px-6">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="w-full py-5 flex items-center justify-between gap-4 text-left"
              aria-expanded={open}
            >
              <span className="font-medium pr-4">{faq.question}</span>
              {open ? (
                <Minus size={18} className="shrink-0 text-accent" />
              ) : (
                <Plus size={18} className="shrink-0 text-text-secondary" />
              )}
            </button>
            {open && (
              <p className="pb-5 text-text-secondary text-sm leading-relaxed">{faq.answer}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
