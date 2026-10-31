'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageCircle } from 'lucide-react';
import { useCart, useCartDetails } from '../../store';
import { money, store, unitPrice, whatsappLink } from '../../data';
import { SummaryRows } from '../../components';

const regions = ['Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Mbeya', 'Morogoro', 'Tanga', 'Zanzibar', 'Other'];

const payments = [
  { id: 'mpesa', name: 'M-Pesa', note: 'Vodacom · pay after we confirm your order' },
  { id: 'tigo', name: 'Tigo Pesa (Mixx by Yas)', note: 'Pay after we confirm your order' },
  { id: 'airtel', name: 'Airtel Money', note: 'Pay after we confirm your order' },
  { id: 'cod', name: 'Cash on delivery', note: 'Pay the rider in cash or mobile money' },
] as const;

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  phone: z
    .string()
    .transform((v) => v.replace(/\s/g, ''))
    .pipe(z.string().regex(/^(\+?255|0)\d{9}$/, 'Enter a Tanzanian number, e.g. 0712 345 678')),
  email: z.string().email('Enter a valid email').or(z.literal('')),
  address: z.string().min(5, 'Enter a street, house or landmark'),
  region: z.string().min(2),
  speed: z.enum(['delivery', 'pickup']),
  payment: z.enum(['mpesa', 'tigo', 'airtel', 'cod']),
});
type Form = z.infer<typeof schema>;
type Confirmation = { name: string; link: string };

const paymentName = (id: Form['payment']) => payments.find((p) => p.id === id)?.name ?? payments[0].name;

export default function Checkout() {
  const { clear } = useCart();
  const { lines, subtotal, delivery } = useCartDetails();
  const [done, setDone] = useState<Confirmation | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { region: 'Dar es Salaam', speed: 'delivery', payment: 'mpesa', email: '' },
  });

  const speed = useWatch({ control, name: 'speed' });
  const paymentId = useWatch({ control, name: 'payment' });
  const payment = payments.find((m) => m.id === paymentId) ?? payments[0];
  const total = subtotal + (speed === 'pickup' ? 0 : delivery);

  const submitOrder = (data: Form) => {
    const orderDelivery = data.speed === 'pickup' ? 0 : delivery;
    const orderTotal = subtotal + orderDelivery;
    const items = lines
      .map(({ line, product }) => `- ${product.name} | ${line.color} | Size ${line.size} | Qty ${line.quantity} | ${money(unitPrice(product) * line.quantity)}`)
      .join('\n');

    const message = [
      'Hello Veenbreeze, I would like to place an order.',
      '',
      items,
      '',
      `Subtotal: ${money(subtotal)}`,
      `Delivery: ${orderDelivery ? money(orderDelivery) : 'Free'}`,
      `Total: ${money(orderTotal)}`,
      '',
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Region: ${data.region}`,
      `Address: ${data.address}`,
      `Fulfilment: ${data.speed === 'pickup' ? 'Showroom pickup' : 'Home delivery'}`,
      `Payment: ${paymentName(data.payment)}`,
      data.email ? `Email: ${data.email}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    clear();
    setDone({ name: data.name, link: whatsappLink(message) });
  };

  if (done) {
    return (
      <div className="container page-wrap empty">
        <span className="eyebrow">ORDER SUMMARY READY</span>
        <h1 className="page-title">Asante, {done.name.split(' ')[0]}.</h1>
        <p>
          Your order summary is ready. Send it to us on WhatsApp and we will confirm stock, delivery
          and payment. Nothing has been charged on this site.
        </p>
        <div className="hero-actions">
          <a className="button" href={done.link} target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> Send order on WhatsApp
          </a>
          <Link className="button button-outline" href="/shop">Continue shopping</Link>
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="container page-wrap empty">
        <h1 className="page-title">Your bag is empty.</h1>
        <Link className="button" href="/shop">Explore the collection</Link>
      </div>
    );
  }

  const field = (
    key: 'name' | 'phone' | 'email' | 'address',
    label: string,
    extra?: { full?: boolean; placeholder?: string; type?: string },
  ) => (
    <label className={`field ${extra?.full ? 'full' : ''}`}>
      {label}
      <input type={extra?.type ?? 'text'} placeholder={extra?.placeholder} {...register(key)} aria-invalid={!!errors[key]} />
      {errors[key] && <small role="alert" className="form-error">{errors[key]?.message}</small>}
    </label>
  );

  return (
    <div className="container page-wrap">
      <ol className="steps" aria-label="Checkout steps">
        <li><Link href="/cart">1 Bag</Link></li>
        <li aria-current="step">2 Delivery &amp; payment</li>
        <li>3 Confirmation</li>
      </ol>
      <div className="checkout-layout">
        <form onSubmit={handleSubmit(submitOrder)} noValidate>
          <h1 className="page-title">Delivery details</h1>
          <div className="field-grid">
            {field('name', 'Full name')}
            {field('phone', 'Phone (for delivery and payment)', { placeholder: '0712 345 678', type: 'tel' })}
            {field('address', 'Street, house or landmark', { full: true, placeholder: 'Mikocheni B, near the market' })}
            <label className="field">
              Region
              <select {...register('region')}>{regions.map((r) => <option key={r}>{r}</option>)}</select>
            </label>
            {field('email', 'Email (optional)', { type: 'email' })}
          </div>

          <fieldset className="choice-group">
            <legend>Delivery</legend>
            <label className="choice">
              <input type="radio" value="delivery" {...register('speed')} />
              <span>
                <b>Home delivery · {delivery ? money(delivery) : 'Free'}</b>
                <small>Same day in Dar es Salaam before 2 pm, 2–4 days to other regions</small>
              </span>
            </label>
            <label className="choice">
              <input type="radio" value="pickup" {...register('speed')} />
              <span>
                <b>Pick up in showroom · Free</b>
                <small>{store.showroom}</small>
              </span>
            </label>
          </fieldset>

          <fieldset className="choice-group">
            <legend>Payment</legend>
            {payments.map((m) => (
              <label key={m.id} className="choice">
                <input type="radio" value={m.id} {...register('payment')} />
                <span><b>{m.name}</b><small>{m.note}</small></span>
              </label>
            ))}
          </fieldset>

          <p className="info-note">
            We confirm every order on WhatsApp before payment. No card or mobile-money details are
            collected on this site.
          </p>

          <button className="button add-wide" type="submit">
            Request order · {money(total)}
          </button>
          <small className="checkout-note">
            Preferred payment: {payment.name}. You will confirm the final amount with us on WhatsApp.
          </small>
        </form>

        <aside className="order-summary">
          <h2>Your order</h2>
          {lines.map(({ line, product }) => (
            <div className="summary-line" key={`${line.productId}${line.size}${line.color}`}>
              <img src={product.image} alt="" />
              <span>{product.name}<small>{line.color} · {line.size} · ×{line.quantity}</small></span>
              <b>{money(unitPrice(product) * line.quantity)}</b>
            </div>
          ))}
          <SummaryRows subtotal={subtotal} delivery={speed === 'pickup' ? 0 : delivery} total={total} />
        </aside>
      </div>
    </div>
  );
}
