'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { site } from '../site.config.js';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close the panel whenever navigation happens.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock the page behind the open panel, and allow Esc to dismiss it.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Only the home page puts a fullscreen video behind the bar; everywhere else
  // it sits on the page background and needs dark text from the start.
  const overHero = pathname === '/';

  return (
    <>
      <header
        className={[
          'nav',
          overHero ? '' : 'nav--plain',
          scrolled ? 'nav--scrolled' : '',
          open ? 'nav--open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Link href="/" className="nav__logo" aria-label={`${site.name} — home`}>
          <span className="nav__mark" aria-hidden="true">
            TN
          </span>
          <span className="nav__wordmark">{site.name}</span>
        </Link>

        <nav className="nav__inline" aria-label="Primary">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname.startsWith(item.href) ? 'is-active' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="nav__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="nav-panel"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
        </button>
      </header>

      <div id="nav-panel" className={`navPanel ${open ? 'navPanel--open' : ''}`} hidden={!open}>
        <nav aria-label="Menu">
          {site.nav.map((item, i) => (
            <Link key={item.href} href={item.href} style={{ transitionDelay: `${60 + i * 45}ms` }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <a className="navPanel__mail" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>
    </>
  );
}
