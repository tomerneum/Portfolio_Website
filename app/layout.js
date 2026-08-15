import Nav from '../components/Nav.js';
import Footer from '../components/Footer.js';
import { site } from '../site.config.js';
import './globals.css';

export const metadata = {
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: site.statement,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.statement,
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#0d0d0d',
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
