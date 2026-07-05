import type { CollectionAfterChangeHook } from 'payload'

import { sendLeadResponseEmail } from '@/lib/email'

export const leadResponseAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  context,
}) => {
  if (context?.skipLeadResponse) return doc
  if (operation !== 'update') return doc
  if (!doc.sendResponse) return doc

  const message = String(doc.responseMessage || '').trim()
  if (!message) return doc

  await sendLeadResponseEmail({
    inquiryId: doc.inquiryId || String(doc.id),
    name: doc.name,
    email: doc.email,
    message,
    intent: doc.intent === 'quote' ? 'quote' : 'contact',
  })

  const now = new Date().toISOString()
  const nextStatus = doc.status === 'new' ? 'contacted' : doc.status

  await req.payload.update({
    collection: 'leads',
    id: doc.id,
    data: {
      sendResponse: false,
      responseMessage: '',
      lastRespondedAt: now,
      lastResponsePreview: message.slice(0, 500),
      status: nextStatus,
    },
    context: { skipLeadResponse: true },
    req,
  })

  return {
    ...doc,
    sendResponse: false,
    responseMessage: '',
    lastRespondedAt: now,
    lastResponsePreview: message.slice(0, 500),
    status: nextStatus,
  }
}
