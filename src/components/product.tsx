'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { money, products, store, unitPrice } from '../data';
import { useCart } from '../store';
import type { Product } from '../types';

export function Price({ p, className = 'price' }: { p: Product; className?: string }) {
  return (
    <span className={className}>
      {p.salePrice && <del>{money(p.price)}</del>}
      <span className={p.salePrice ? 'price-sale' : undefined}>{money(unitPrice(p))}</span>
    </span>
  );
}

function badgeFor(p: Product) {
  if (p.salePrice) return { label: 'Sale', sale: true };
  if (p.stock <= store.lowStockAt) return { label: `Only ${p.stock} left`, sale: false };
  if (p.newArrival) return { label: 'New', sale: false };
  return null;
}

export function ProductCard({ p }: { p: Product }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState('');
  const badge = badgeFor(p);
  const quickAdd = (size: string) => {
    add({ productId: p.id, size, color: p.colors[0].name, quantity: 1 });
    setAdded(size);
    setTimeout(() => setAdded(''), 1600);
  };
  return (
    <article className="product-card">
      <div className="product-photo">
        <Link href={`/products/${p.slug}`} tabIndex={-1} aria-hidden="true">
          <img src={p.image} alt="" loading="lazy" />
        </Link>
        {badge && <span className={badge.sale ? 'tag tag-sale' : 'tag'}>{badge.label}</span>}
        <div className="quick-add" aria-label={`Quick add ${p.name} in ${p.colors[0].name}`} role="group">
          {added ? (
            <span className="quick-added" role="status"><Check size={15} /> Added size {added}</span>
          ) : (
            <>
              <span>Quick add</span>
              <span className="quick-sizes">
                {p.sizes.map((s) => (
                  <button key={s} type="button" aria-label={`Add size ${s}`} onClick={() => quickAdd(s)}>{s}</button>
                ))}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="product-meta">
        <h3><Link href={`/products/${p.slug}`}>{p.name}</Link></h3>
        <Price p={p} />
      </div>
      <div className="product-sub">
        <span>{p.category}</span>
        <span className="swatches" aria-label={`${p.colors.length} colours`}>
          {p.colors.map((c) => <i key={c.name} title={c.name} style={{ background: c.hex }} />)}
        </span>
      </div>
    </article>
  );
}

export function ProductGrid({ items = products, columns = 4 }: { items?: Product[]; columns?: 3 | 4 }) {
  return (
    <div className={`product-grid cols-${columns}`}>
      {items.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}
