import Nav from '../components/Nav.js';
import Footer from '../components/Footer.js';
import { site } from '../site.config.js';
import './globals.css';

export const metadata = {
  // Without this, Next emits relative URLs in Open Graph tags and most
  // link-preview scrapers silently drop them.
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: site.statement,
  alternates: { canonical: '/' },
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.statement,
    url: site.url,
    siteName: site.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.role}`,
    description: site.statement,
  },
};

export const viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
