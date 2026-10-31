import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { money, store, whatsappLink } from '../../data';

export const metadata = { title: 'Contact & help' };

export default function Contact() {
  return (
    <div className="container page-wrap prose-page">
      <span className="eyebrow">WE&apos;RE HERE</span>
      <h1 className="page-title">A note, a question, <i>a little hello.</i></h1>
      <p className="page-intro">
        The fastest way to reach us is WhatsApp. We help with sizing, styling, and orders seven days
        a week. You can also drop us an email and we will get back to you within one business day.
      </p>
      <div className="hero-actions">
        <a className="button" href={whatsappLink('Hello Veenbreeze!')} target="_blank" rel="noreferrer">
          <MessageCircle size={16} /> Chat on WhatsApp
        </a>
        <a className="button button-outline" href={`mailto:${store.email}`}>Email {store.email}</a>
      </div>

      <div className="help-grid">
        <section id="delivery">
          <h2>Delivery &amp; rates</h2>
          <p>
            Dar es Salaam: same day when you order before 2 pm, otherwise next day.{' '}
            {money(store.deliveryFee)}, free on orders over {money(store.freeDeliveryFrom)}.
          </p>
          <p>Arusha, Dodoma, Mwanza, Zanzibar and other regions: 2–4 days. Rates confirmed at checkout.</p>
        </section>

        <section id="exchanges">
          <h2>Exchanges &amp; returns</h2>
          <p>Exchange any unworn piece within 7 days. Message us on WhatsApp and we will arrange a collection.</p>
        </section>

        <section id="sizes">
          <h2>Size guide</h2>
          <p>
            Each product page lists a fit note and body measurements. Not sure? Send us your height
            and usual size on WhatsApp and we will advise the best fit.
          </p>
        </section>

        <section>
          <h2>Visit us</h2>
          <p>{store.showroom}<br />{store.hours}</p>
        </section>
      </div>

      <Link className="text-link" href="/shop">Shop the collection</Link>
    </div>
  );
}
