import { kitchenerPage } from '@/lib/local-pages/cities'
import { makeLocalPage, makeLocalPageMetadata } from '@/lib/local-pages/make-route'

export const metadata = makeLocalPageMetadata(kitchenerPage)
export default makeLocalPage(kitchenerPage)
