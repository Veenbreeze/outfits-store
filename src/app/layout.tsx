import type { Metadata } from 'next';
import './globals.css';
import { AnnouncementBar, Footer, Header, WhatsAppFab } from '../components';

export const metadata: Metadata = {
  title: { default: 'Veenbreeze Fashion', template: '%s · Veenbreeze Fashion' },
  description: 'Considered clothing from Dar es Salaam. Pay with M-Pesa, Tigo Pesa, Airtel Money or cash on delivery.',
  icons: { icon: '/favicon.svg' },
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
