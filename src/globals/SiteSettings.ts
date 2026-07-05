import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
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
              defaultValue: '(416) 555-1234',
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
              defaultValue: 'Custom 3D-Printed Frames',
            },
            {
              name: 'heroTitle',
              type: 'text',
              defaultValue: 'Souvenirs Your Guests Will Actually Keep',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              defaultValue:
                'Translucent 3D-printed frames with personalized details and dye-sublimation prints that last forever. Every package includes 3 hours of coverage, excluding setup.',
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
