'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '../../store';
import { deliveryFor, money, products, store, unitPrice } from '../../data';

const regions = ['Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Mbeya', 'Morogoro', 'Tanga', 'Zanzibar', 'Other'];

const payments = [
  { id: 'mpesa', name: 'M-Pesa', note: 'Vodacom · a payment prompt is sent to your phone', mobile: true },
  { id: 'tigo', name: 'Tigo Pesa (Mixx by Yas)', note: 'A payment prompt is sent to your phone', mobile: true },
  { id: 'airtel', name: 'Airtel Money', note: 'A payment prompt is sent to your phone', mobile: true },
  { id: 'cod', name: 'Cash on delivery', note: 'Pay the rider in cash or mobile money', mobile: false },
] as const;

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  phone: z.string().transform((v) => v.replace(/\s/g, '')).pipe(z.string().regex(/^(\+?255|0)\d{9}$/, 'Enter a Tanzanian number, e.g. 0712 345 678')),
  email: z.string().email('Enter a valid email').or(z.literal('')),
  address: z.string().min(5, 'Enter a street, house or landmark'),
  region: z.string().min(2),
  speed: z.enum(['delivery', 'pickup']),
  payment: z.enum(['mpesa', 'tigo', 'airtel', 'cod']),
});
type Form = z.infer<typeof schema>;

export default function Checkout() {
  const { items, clear } = useCart();
  const [done, setDone] = useState<Form | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { region: 'Dar es Salaam', speed: 'delivery', payment: 'mpesa', email: '' },
  });

  const lines = items.flatMap((i) => {
    const p = products.find((x) => x.id === i.productId);
    return p ? [{ i, p }] : [];
  });
  const subtotal = lines.reduce((a, { i, p }) => a + unitPrice(p) * i.quantity, 0);
  const speed = watch('speed');
  const payment = payments.find((m) => m.id === watch('payment')) ?? payments[0];
  const delivery = speed === 'pickup' ? 0 : deliveryFor(subtotal);
  const total = subtotal + delivery;

  if (done) {
    return (
      <div className="container page-wrap empty">
        <span className="eyebrow">DEMO CHECKOUT</span>
        <h1 className="page-title">Asante, {done.name.split(' ')[0]}.</h1>
        <p>This demonstration did not place a real order or collect payment.</p>
        <Link className="button" href="/shop">Back to the shop</Link>
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

  const field = (key: 'name' | 'phone' | 'email' | 'address', label: string, extra?: { full?: boolean; placeholder?: string; type?: string }) => (
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
        <form onSubmit={handleSubmit((data) => { clear(); setDone(data); })} noValidate>
          <h1 className="page-title">Delivery details</h1>
          <div className="demo-note">Demonstration checkout only. No real order is sent and no payment is processed.</div>
          <div className="field-grid">
            {field('name', 'Full name')}
            {field('phone', 'Phone (for delivery and payment)', { placeholder: '0712 345 678', type: 'tel' })}
            {field('address', 'Street, house or landmark', { full: true, placeholder: 'e.g. Mikocheni B, near the market' })}
            <label className="field">
              Region
              <select {...register('region')}>{regions.map((r) => <option key={r}>{r}</option>)}</select>
            </label>
            {field('email', 'Email (optional)', { type: 'email' })}
          </div>

          <fieldset className="choice-group">
            <legend>Delivery</legend>
            <label className="choice"><input type="radio" value="delivery" {...register('speed')} />
              <span><b>Home delivery · {deliveryFor(subtotal) ? money(deliveryFor(subtotal)) : 'Free'}</b><small>Same day in Dar es Salaam before 2pm, 2–4 days to other regions</small></span>
            </label>
            <label className="choice"><input type="radio" value="pickup" {...register('speed')} />
              <span><b>Pick up in showroom · Free</b><small>{store.showroom}</small></span>
            </label>
          </fieldset>

          <fieldset className="choice-group">
            <legend>Payment</legend>
            {payments.map((m) => (
              <label key={m.id} className="choice"><input type="radio" value={m.id} {...register('payment')} />
                <span><b>{m.name}</b><small>{m.note}</small></span>
              </label>
            ))}
          </fieldset>
          {payment.mobile && (
            <p className="info-note">After you place the order, a payment prompt from {payment.name} appears on your phone. Enter your PIN to pay. Nothing is charged until you confirm.</p>
          )}

          <button className="button add-wide" type="submit">
            {payment.mobile ? `Pay ${money(total)} with ${payment.name.split(' (')[0]}` : `Place order · ${money(total)}`}
          </button>
        </form>

        <aside className="order-summary">
          <h2>Your order</h2>
          {lines.map(({ i, p }) => (
            <div className="summary-line" key={`${i.productId}${i.size}${i.color}`}>
              <img src={p.image} alt="" />
              <span>{p.name}<small>{i.color} · {i.size} · ×{i.quantity}</small></span>
              <b>{money(unitPrice(p) * i.quantity)}</b>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="summary-row"><span>Delivery</span><span>{delivery ? money(delivery) : 'Free'}</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>{money(total)}</span></div>
        </aside>
      </div>
    </div>
  );
}
