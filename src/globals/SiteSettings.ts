import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact & Hero',
          fields: [
            {
              name: 'phone',
              type: 'text',
              admin: {
                description: 'Optional. Leave blank to hide phone on the contact page (email-only enquiries).',
              },
            },
            {
              name: 'email',
              type: 'email',
              defaultValue: 'frameflix@inmoment.com',
            },
            {
              name: 'serviceArea',
              type: 'text',
              defaultValue: 'Kitchener, Cambridge, Waterloo, Guelph & beyond',
            },
            {
              name: 'heroEyebrow',
              type: 'text',
              defaultValue: 'FrameFlix by InMoment',
            },
            {
              name: 'heroTitle',
              type: 'text',
              defaultValue: 'A photo booth experience your guests take home',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              defaultValue:
                'Guests receive their event photo inside a personalized keepsake frame, up to the frame quantity included in your package—or watch custom stickers print and cut live at your event.',
            },
            {
              name: 'trustBadges',
              type: 'array',
              admin: {
                description: 'Shown in the home trust bar when that section is enabled.',
              },
              fields: [
                { name: 'icon', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
            {
              name: 'testimonials',
              type: 'array',
              admin: {
                description: 'Only shown when “Show testimonials” is enabled.',
              },
              fields: [
                { name: 'text', type: 'textarea', required: true },
                { name: 'author', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Pages',
          fields: [
            {
              name: 'showAboutPage',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show About page',
            },
            {
              name: 'showPackagesPage',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Frames / Packages page',
            },
            {
              name: 'showStickersPage',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Stickers page',
            },
            {
              name: 'showGalleryPage',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Gallery page',
            },
            {
              name: 'showBlogPage',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Blog page',
            },
            {
              name: 'showFaqPage',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show FAQ page',
            },
            {
              name: 'showContactPage',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Contact page',
            },
            {
              name: 'showQuotePage',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Quote page',
            },
            {
              name: 'showDesignPage',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Design Studio page',
            },
          ],
        },
        {
          label: 'Home sections',
          fields: [
            {
              name: 'showTrustBar',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show trust bar',
            },
            {
              name: 'showStylesSection',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show frame styles section',
            },
            {
              name: 'showProductStory',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show product story section',
            },
            {
              name: 'showHowItWorks',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show how it works',
            },
            {
              name: 'showPackagesSection',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show packages section',
            },
            {
              name: 'showEventOrganisersSection',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show event organisers section',
            },
            {
              name: 'eventOrganisersTitle',
              type: 'text',
              defaultValue: 'We would love to be part of your success stories',
              admin: {
                condition: (_, siblingData) => siblingData?.showEventOrganisersSection,
              },
            },
            {
              name: 'eventOrganisersBody',
              type: 'textarea',
              defaultValue:
                'Partner with FrameFlix for weddings, corporate activations, and milestone events — branded keepsakes your guests share long after the night ends.',
              admin: {
                condition: (_, siblingData) => siblingData?.showEventOrganisersSection,
              },
            },
            {
              name: 'showLifestyleBanner',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show lifestyle / CTA banner',
            },
            {
              name: 'showGalleryPreview',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show gallery preview',
            },
            {
              name: 'showBlogPreview',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show blog preview on home',
            },
            {
              name: 'showTestimonials',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show testimonials',
              admin: {
                description: 'Keep off until you have real reviews to publish.',
              },
            },
            {
              name: 'showFinalCta',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show final CTA',
            },
            {
              name: 'showFrameCountOnHome',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show frame quantities on home',
              admin: {
                description: 'Usually leave off — quantities are better on Packages / Quote.',
              },
            },
            {
              name: 'showPricing',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show pricing on the website',
              admin: {
                description:
                  'When off, package price ranges are hidden. Leads still request a custom quote.',
              },
            },
          ],
        },
      ],
    },
  ],
}
