import { waterlooPage } from '@/lib/local-pages/cities'
import { makeLocalPage, makeLocalPageMetadata } from '@/lib/local-pages/make-route'

export const metadata = makeLocalPageMetadata(waterlooPage)
export default makeLocalPage(waterlooPage)
