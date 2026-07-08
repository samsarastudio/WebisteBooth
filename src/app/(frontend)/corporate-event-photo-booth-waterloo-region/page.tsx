import { corporatePage } from '@/lib/local-pages/events'
import { makeLocalPage, makeLocalPageMetadata } from '@/lib/local-pages/make-route'

export const metadata = makeLocalPageMetadata(corporatePage)
export default makeLocalPage(corporatePage)
