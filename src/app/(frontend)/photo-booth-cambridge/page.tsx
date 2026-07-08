import { cambridgePage } from '@/lib/local-pages/cities'
import { makeLocalPage, makeLocalPageMetadata } from '@/lib/local-pages/make-route'

export const metadata = makeLocalPageMetadata(cambridgePage)
export default makeLocalPage(cambridgePage)
