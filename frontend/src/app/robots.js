/**
 * Dynamic Robots Configuration for VEYNCORE
 * Serves /robots.txt dynamically with canonical domain and disallows private admin/api paths
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/account/*',
          '/api/*',
        ],
      },
    ],
    sitemap: 'https://veyncore.in/sitemap.xml',
    host: 'https://veyncore.in',
  };
}
