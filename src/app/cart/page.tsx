'use client';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useCart, useCartDetails } from '../../store';
import { money, store, unitPrice } from '../../data';
import { SummaryRows } from '../../components';

export default function Cart() {
  const { remove, qty } = useCart();
  const { lines, subtotal, delivery, total } = useCartDetails();
  const toFree = Math.max(0, store.freeDeliveryFrom - subtotal);

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
              {toFree > 0
                ? <>Add <b>{money(toFree)}</b> more for free delivery in Dar es Salaam.</>
                : <>You have <b>free delivery</b> in Dar es Salaam.</>}
            </p>
            {lines.map(({ line, product }) => (
              <div className="cart-row" key={`${line.productId}-${line.size}-${line.color}`}>
                <Link href={`/products/${product.slug}`}><img src={product.image} alt={product.name} /></Link>
                <div>
                  <h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3>
                  <small>{line.color} · Size {line.size} · {money(unitPrice(product))}</small>
                  <button className="link-button remove" type="button" onClick={() => remove(line.productId, line.size, line.color)}>
                    <Trash2 size={14} aria-hidden="true" /> Remove
                  </button>
                </div>
                <input
                  aria-label={`Quantity for ${product.name}`}
                  type="number"
                  min={1}
                  max={product.stock}
                  value={line.quantity}
                  onChange={(e) => qty(line.productId, line.size, line.color, Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))}
                />
                <b>{money(unitPrice(product) * line.quantity)}</b>
              </div>
            ))}
            <p><Link className="text-link" href="/shop">Continue shopping</Link></p>
          </div>

          <aside className="order-summary">
            <h2>Summary</h2>
            <SummaryRows subtotal={subtotal} delivery={delivery} total={total} deliveryLabel="Delivery (Dar es Salaam)" />
            <Link className="button add-wide" href="/checkout">Continue to checkout</Link>
            <small>Pay with M-Pesa, Tigo Pesa, Airtel Money or cash on delivery.</small>
          </aside>
        </div>
      )}
    </div>
  );
}
