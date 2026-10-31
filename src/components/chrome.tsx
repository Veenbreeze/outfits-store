'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, MessageCircle, Search, ShoppingBag, X } from 'lucide-react';
import { footerHelpLinks, footerShopLinks, money, navLinks, store, whatsappLink } from '../data';
import { useCart } from '../store';

export function AnnouncementBar() {
  return (
    <div className="announcement">
      <span>Free delivery in Dar es Salaam on orders over {money(store.freeDeliveryFrom)}</span>
      <span className="announcement-dot" aria-hidden="true">·</span>
      <span>Pay with M-Pesa, Tigo Pesa, Airtel Money or cash on delivery</span>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const count = useCart((s) => s.items.reduce((a, b) => a + b.quantity, 0));
  return (
    <header className="header">
      <div className="header-inner">
        <button className="icon-button menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav aria-label="Main" className={open ? 'nav active' : 'nav'} onClick={() => setOpen(false)}>
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href} className={l.sale ? 'nav-sale' : undefined}>{l.label}</Link>
          ))}
          <Link href="/virtual-store" className="nav-extra">Virtual boutique</Link>
        </nav>
        <Link className="brand" href="/">
          VEENBREEZE<span>FASHION · DAR ES SALAAM</span>
        </Link>
        <div className="head-actions">
          <Link className="icon-button" aria-label="Search the collection" href="/shop"><Search size={20} /></Link>
          <Link aria-label={`Shopping bag, ${count} items`} href="/cart" className="bag">
            <ShoppingBag size={20} />
            <span>{count}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function WhatsAppFab() {
  return (
    <a className="wa-fab" href={whatsappLink('Hello Veenbreeze, I have a question about an order.')} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp">
      <MessageCircle size={24} />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="brand light" href="/">VEENBREEZE<span>FASHION</span></Link>
          <p>Considered clothing from Dar es Salaam, delivered across Tanzania.</p>
          <a className="button button-outline-light" href={whatsappLink('Hello Veenbreeze!')} target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
        <div className="footer-col">
          <b>Shop</b>
          {footerShopLinks.map((l) => <Link key={l.label} href={l.href}>{l.label}</Link>)}
        </div>
        <div className="footer-col">
          <b>Help</b>
          {footerHelpLinks.map((l) => <Link key={l.label} href={l.href}>{l.label}</Link>)}
        </div>
        <div className="footer-col">
          <b>Visit</b>
          <p>{store.showroom}</p>
          <p>{store.hours}</p>
          <a href={`mailto:${store.email}`}>{store.email}</a>
          <Link href="/about">Our story</Link>
        </div>
      </div>
      <div className="footer-base">
        <span>© 2026 Veenbreeze Fashion.</span>
      </div>
    </footer>
  );
}
