import { MetadataRoute } from 'next'

export default function sitemapIndex(): Promise<MetadataRoute.Sitemap> | MetadataRoute.Sitemap {
  const baseUrl = 'https://vikings.co.ke'

  return [
    {
      url: `${baseUrl}/sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/products-sitemap.xml`,
      lastModified: new Date(),
    },
  ]
}
