import { birthdayPage } from '@/lib/local-pages/events'
import { makeLocalPage, makeLocalPageMetadata } from '@/lib/local-pages/make-route'

export const metadata = makeLocalPageMetadata(birthdayPage)
export default makeLocalPage(birthdayPage)
