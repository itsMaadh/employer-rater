export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Employer Watcher",
  description: "View and manage employers for Maldives Pension Office.",
  mainNav: [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Reports",
      href: "/reports",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
