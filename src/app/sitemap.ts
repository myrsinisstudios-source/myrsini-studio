import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://myrsini-studios.gr'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/#apartments`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/#activities`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/#hiking`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
