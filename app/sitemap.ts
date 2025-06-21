// Lokasi: app/sitemap.ts

import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://streamhib.com' // Ganti dengan domain Anda jika berbeda

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
        url: `${baseUrl}/cookies`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
    },
    {
        url: `${baseUrl}/tutorial`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    },
  ]
}
