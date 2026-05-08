export const SITE_URL = "https://aioutsourcehub.com";

type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

export function pageBreadcrumbs(pageName: string, path: string) {
  return breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: pageName, path },
  ]);
}
