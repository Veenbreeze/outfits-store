'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Ruler } from 'lucide-react';
import { useCart } from '../../../store';
import { money, products, store, unitPrice, whatsappLink } from '../../../data';
import { Price, ProductGrid } from '../../../components';
import type { Product } from '../../../types';

export default function ProductDetail({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [notice, setNotice] = useState('');
  const [guideOpen, setGuideOpen] = useState(false);
  const add = useCart((s) => s.add);

  const savePct = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  const related = products.filter((x) => x.id !== product.id && x.category !== product.category).slice(0, 4);

  const addToBag = () => {
    if (!size) { setNotice('Choose a size first.'); return; }
    add({ productId: product.id, size, color, quantity: qty });
    setNotice('Added to your bag.');
  };

  const waText = `Hello Veenbreeze, I would like to order the ${product.name} (${color}${size ? `, size ${size}` : ''}) x${qty}.`;

  return (
    <div className="container page-wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="detail-layout">
        <figure className="detail-gallery">
          <img className="gallery-main" src={product.image} alt={`${product.name} in ${color}`} />
          <figcaption>Shown in {color}. Colours may vary slightly by screen.</figcaption>
        </figure>

        <div className="detail-copy">
          <span className="eyebrow">{product.category.toUpperCase()}{product.newArrival ? ' · NEW ARRIVAL' : ''}</span>
          <h1>{product.name}</h1>
          <div className="detail-price">
            <Price p={product} />
            {savePct > 0 && <span className="save">Save {savePct}%</span>}
          </div>

          <div className="option-label">Colour: <span>{color}</span></div>
          <div className="option-list">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                aria-label={c.name}
                aria-pressed={color === c.name}
                title={c.name}
                className={color === c.name ? 'swatch selected' : 'swatch'}
                style={{ background: c.hex }}
                onClick={() => setColor(c.name)}
              />
            ))}
          </div>

          <div className="option-label option-label-row">
            <span>Size: <span>{size || 'choose one'}</span></span>
            <button type="button" className="link-button" onClick={() => setGuideOpen(!guideOpen)} aria-expanded={guideOpen}>
              <Ruler size={14} aria-hidden="true" /> Size guide
            </button>
          </div>
          <div className="size-grid">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={size === s}
                className={size === s ? 'selected' : ''}
                onClick={() => { setSize(s); setNotice(''); }}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="fit-note">{product.fit}</p>

          {guideOpen && (
            <table className="size-table">
              <caption className="sr-only">Body measurements in centimetres</caption>
              <thead><tr><th scope="col">Size</th><th scope="col">Chest</th><th scope="col">Waist</th><th scope="col">Hip</th></tr></thead>
              <tbody>
                <tr><th scope="row">S</th><td>86–91</td><td>71–76</td><td>89–94</td></tr>
                <tr><th scope="row">M</th><td>94–99</td><td>79–84</td><td>97–102</td></tr>
                <tr><th scope="row">L</th><td>102–107</td><td>87–92</td><td>105–110</td></tr>
                <tr><th scope="row">XL</th><td>110–115</td><td>95–100</td><td>113–118</td></tr>
              </tbody>
            </table>
          )}

          <div className="qty-row">
            <label htmlFor="qty" className="option-label">Quantity</label>
            <input
              id="qty"
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))}
            />
          </div>

          <div className="buy-bar">
            <button className="button add-wide" type="button" onClick={addToBag}>
              {size ? `Add to bag · ${money(unitPrice(product) * qty)}` : 'Choose a size'}
            </button>
          </div>
          <a className="button button-outline add-wide" href={whatsappLink(waText)} target="_blank" rel="noreferrer">
            <MessageCircle size={17} /> Order on WhatsApp
          </a>

          {notice && (
            <p className={notice.startsWith('Added') ? 'success' : 'form-error'} role="status">
              {notice} {notice.startsWith('Added') && <Link href="/cart">View bag</Link>}
            </p>
          )}

          <div className="delivery-box">
            <div>
              <b>{product.stock > 0 ? 'In stock' : 'Currently unavailable'}</b>
              {product.stock > 0 && ` · ${product.stock <= store.lowStockAt ? `only ${product.stock} left` : `${product.stock} available`}`}
            </div>
            <div>Order before 2 pm for <b>same-day delivery</b> in Dar es Salaam · {money(store.deliveryFee)}, free over {money(store.freeDeliveryFrom)}</div>
            <div>Free 7-day size exchanges</div>
          </div>

          <div className="accordion">
            <details open><summary>Description</summary><p>{product.description}</p></details>
            <details>
              <summary>Fabric &amp; care</summary>
              <p>
                Designed for repeated wear in warm conditions. Machine wash cold on a gentle cycle,
                reshape and air dry. Do not tumble dry. Iron on a low setting if needed.
              </p>
            </details>
            <details>
              <summary>Delivery &amp; exchanges</summary>
              <p>
                Dar es Salaam same day or next day. Arusha, Mwanza, Dodoma and Zanzibar in 2–4 days.
                Exchange any size within 7 days — we collect and swap at no extra charge.
              </p>
            </details>
          </div>

          <Link href="/virtual-store" className="text-link">View in the virtual boutique</Link>
        </div>
      </div>

      <section className="section related">
        <div className="section-heading">
          <h2>Complete the look</h2>
          <Link className="text-link" href="/shop">Shop all</Link>
        </div>
        <ProductGrid items={related} />
      </section>
    </div>
  );
}
