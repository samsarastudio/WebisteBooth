export type LeadFormState = {
  ok: boolean
  error?: string
  inquiryId?: string
}

const FALLBACK_ERROR = 'Something went wrong. Please try again.'

function readLeadResponse(data: unknown): LeadFormState {
  if (!data || typeof data !== 'object') {
    return { ok: false, error: FALLBACK_ERROR }
  }

  const body = data as LeadFormState & { errors?: { message?: string }[] }
  if (typeof body.ok === 'boolean') {
    return {
      ok: body.ok,
      error: body.ok ? undefined : body.error || FALLBACK_ERROR,
      inquiryId: body.inquiryId,
    }
  }

  const payloadErr = body.errors?.map((item) => item.message).filter(Boolean).join(' ')
  return { ok: false, error: payloadErr || FALLBACK_ERROR }
}

/** Posts an enquiry. Falls back to /api/leads if this build is still on the old route. */
export async function postLeadForm(form: HTMLFormElement): Promise<LeadFormState> {
  const send = (url: string) => fetch(url, { method: 'POST', body: new FormData(form) })

  try {
    let res = await send('/api/submit-lead')
    if (res.status === 404 || res.status === 405) {
      res = await send('/api/leads')
    }

    const data = await res.json().catch(() => null)
    return readLeadResponse(data)
  } catch {
    return { ok: false, error: FALLBACK_ERROR }
  }
}
