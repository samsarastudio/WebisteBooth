import { guelphPage } from '@/lib/local-pages/cities'
import { makeLocalPage, makeLocalPageMetadata } from '@/lib/local-pages/make-route'

export const metadata = makeLocalPageMetadata(guelphPage)
export default makeLocalPage(guelphPage)
