import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { categories, lookIds, money, products, unitPrice } from '../data';
import { Newsletter, ProductGrid, TrustStrip } from '../components';

const categoryImage = (category: string) => products.find((p) => p.category === category)!.image;

export default function Home() {
  const newIn = products.filter((p) => p.newArrival).slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const look = lookIds.map((id) => products.find((p) => p.id === id)!);
  const lookTotal = look.reduce((a, p) => a + unitPrice(p), 0);

  return (
    <>
      <section className="hero">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=90" alt="" />
        <div className="hero-shade" />
        <div className="container hero-copy">
          <span className="eyebrow">THE NEW SEASON · 2026</span>
          <h1>Wear what <i>moves you.</i></h1>
          <p>Breathable linen, relaxed tailoring and everyday staples, cut for warm days on the coast.</p>
          <div className="hero-actions">
            <Link className="button button-light" href="/shop?sort=newest">Shop the new season</Link>
            <Link className="button button-outline-light" href="/virtual-store">Enter the virtual boutique</Link>
          </div>
        </div>
      </section>

      <section className="container section" id="collections">
        <div className="section-heading">
          <h2>Shop by category</h2>
          <Link className="text-link" href="/shop">View everything</Link>
        </div>
        <div className="category-grid">
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c).length;
            return (
              <Link key={c} href={`/shop?category=${encodeURIComponent(c)}`} className="category-tile">
                <div className="category-photo"><img src={categoryImage(c)} alt="" loading="lazy" /></div>
                <div className="category-label"><span>{c}</span><small>{count} {count === 1 ? 'style' : 'styles'}</small></div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">JUST LANDED</span>
            <h2>New in this week</h2>
          </div>
          <Link className="text-link" href="/shop?sort=newest">Shop new arrivals</Link>
        </div>
        <ProductGrid items={newIn} />
      </section>

      <section className="container section look">
        <div className="look-photo">
          <img src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1600&q=85" alt="Softly tailored neutral outfit" loading="lazy" />
        </div>
        <div className="look-copy">
          <span className="eyebrow">SHOP THE LOOK</span>
          <h2>Sundown in <i>linen.</i></h2>
          <p>One easy outfit for evenings by the ocean. Pick the pieces you love, or take the whole look.</p>
          <ul className="look-list">
            {look.map((p) => (
              <li key={p.id}>
                <img src={p.image} alt="" loading="lazy" />
                <div><b>{p.name}</b><small>{money(unitPrice(p))}</small></div>
                <Link className="text-link" href={`/products/${p.slug}`}>View</Link>
              </li>
            ))}
          </ul>
          <p className="look-total">The full look · {money(lookTotal)}</p>
        </div>
      </section>

      <TrustStrip />

      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE VEENBREEZE EDIT</span>
            <h2>Pieces with a point of view</h2>
          </div>
          <Link className="text-link" href="/shop">Shop all</Link>
        </div>
        <ProductGrid items={featured} />
      </section>

      <section className="boutique-promo">
        <div className="container boutique-inner">
          <div>
            <span className="eyebrow eyebrow-light">STEP INSIDE</span>
            <h2>The virtual <i>boutique.</i></h2>
            <p>Walk the rails in 3D, turn a garment around, and add it to your bag without leaving the room.</p>
            <Link href="/virtual-store" className="button button-light">Enter the boutique <ArrowUpRight size={16} /></Link>
          </div>
          <div className="boutique-photo">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80" alt="" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="container section story" id="story">
        <div className="story-image">
          <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=85" alt="Contemporary fashion portrait" loading="lazy" />
        </div>
        <div className="story-copy">
          <span className="eyebrow">OUR STORY</span>
          <h2>Style should feel <i>like your own.</i></h2>
          <p>Veenbreeze is a fashion house shaped by the colour, rhythm, and ease of everyday life on the coast. We believe getting dressed can be a small act of self-expression.</p>
          <Link className="text-link" href="/about">Read our story</Link>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
