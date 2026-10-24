'use client';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useCart } from '../../store';
import { deliveryFor, money, products, store, unitPrice } from '../../data';

export default function Cart() {
  const { items, remove, qty } = useCart();
  const lines = items.flatMap((i) => {
    const p = products.find((x) => x.id === i.productId);
    return p ? [{ i, p }] : [];
  });
  const subtotal = lines.reduce((a, { i, p }) => a + unitPrice(p) * i.quantity, 0);
  const delivery = deliveryFor(subtotal);
  const toFree = store.freeDeliveryFrom - subtotal;

  return (
    <div className="container page-wrap">
      <span className="eyebrow">YOUR SELECTION</span>
      <h1 className="page-title">Shopping bag</h1>
      {!lines.length ? (
        <div className="empty">
          <p>Your bag is waiting for something lovely.</p>
          <Link className="button" href="/shop">Explore the collection</Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <div>
            <p className="free-progress" role="status">
              {toFree > 0 ? <>Add <b>{money(toFree)}</b> more for free delivery in Dar es Salaam.</> : <>You have <b>free delivery</b> in Dar es Salaam.</>}
            </p>
            {lines.map(({ i, p }) => (
              <div className="cart-row" key={`${i.productId}-${i.size}-${i.color}`}>
                <Link href={`/products/${p.slug}`}><img src={p.image} alt={p.name} /></Link>
                <div>
                  <h3><Link href={`/products/${p.slug}`}>{p.name}</Link></h3>
                  <small>{i.color} · Size {i.size} · {money(unitPrice(p))}</small>
                  <button className="link-button remove" type="button" onClick={() => remove(i.productId, i.size, i.color)}>
                    <Trash2 size={14} aria-hidden="true" /> Remove
                  </button>
                </div>
                <input aria-label={`Quantity for ${p.name}`} type="number" min={1} max={p.stock} value={i.quantity}
                  onChange={(e) => qty(i.productId, i.size, i.color, Math.max(1, Math.min(p.stock, Number(e.target.value) || 1)))} />
                <b>{money(unitPrice(p) * i.quantity)}</b>
              </div>
            ))}
            <p><Link className="text-link" href="/shop">Continue shopping</Link></p>
          </div>
          <aside className="order-summary">
            <h2>Summary</h2>
            <div className="summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="summary-row"><span>Delivery (Dar es Salaam)</span><span>{delivery ? money(delivery) : 'Free'}</span></div>
            <div className="summary-row summary-total"><span>Total</span><span>{money(subtotal + delivery)}</span></div>
            <Link className="button add-wide" href="/checkout">Continue to checkout</Link>
            <small>Pay with M-Pesa, Tigo Pesa, Airtel Money or cash on delivery. Demo order only.</small>
          </aside>
        </div>
      )}
    </div>
  );
}
