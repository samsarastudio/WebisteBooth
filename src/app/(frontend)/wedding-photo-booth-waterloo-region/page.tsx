import { weddingPage } from '@/lib/local-pages/events'
import { makeLocalPage, makeLocalPageMetadata } from '@/lib/local-pages/make-route'

export const metadata = makeLocalPageMetadata(weddingPage)
export default makeLocalPage(weddingPage)
