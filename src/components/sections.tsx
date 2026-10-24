'use client';
import { useState } from 'react';
import { MessageCircle, RefreshCcw, Smartphone, Truck } from 'lucide-react';

export function TrustStrip() {
  const items = [
    { icon: Truck, title: 'Same-day delivery in Dar', text: 'Order before 2pm. Other regions in 2–4 days.' },
    { icon: Smartphone, title: 'Pay your way', text: 'M-Pesa, Tigo Pesa, Airtel Money or cash on delivery.' },
    { icon: RefreshCcw, title: '7-day easy exchanges', text: 'Wrong size? We collect it and swap it.' },
    { icon: MessageCircle, title: 'Order on WhatsApp', text: 'Chat with us for sizing and styling help.' },
  ];
  return (
    <section className="trust" aria-label="Why shop with us">
      <div className="trust-inner">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="trust-item">
            <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
            <div><b>{title}</b><p>{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <div>
          <h2>10% off your first order</h2>
          <p>New arrivals and private sales, by email or WhatsApp. No spam.</p>
        </div>
        {done ? (
          <p className="success" role="status">Thank you for joining us.</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
            <label htmlFor="newsletter-contact" className="sr-only">Email or WhatsApp number</label>
            <input id="newsletter-contact" placeholder="Email or WhatsApp number" required />
            <button className="button" type="submit">Join</button>
          </form>
        )}
      </div>
    </section>
  );
}
