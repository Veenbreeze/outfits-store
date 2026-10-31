import type { Metadata } from 'next';
import './globals.css';
import { AnnouncementBar, Footer, Header, WhatsAppFab } from '../components';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: { default: 'Veenbreeze Fashion', template: '%s · Veenbreeze Fashion' },
  description:
    'Considered clothing from Dar es Salaam — breathable linen, relaxed tailoring and everyday staples delivered across Tanzania.',
  icons: { icon: `${basePath}/favicon.svg` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <AnnouncementBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
