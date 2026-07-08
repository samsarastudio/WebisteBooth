import { stickerStationPage } from '@/lib/local-pages/events'
import { makeLocalPage, makeLocalPageMetadata } from '@/lib/local-pages/make-route'

export const metadata = makeLocalPageMetadata(stickerStationPage)
export default makeLocalPage(stickerStationPage)
