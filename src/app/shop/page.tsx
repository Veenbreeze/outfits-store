'use client';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { categories, products, unitPrice } from '../../data';
import { ProductGrid } from '../../components';

const audiences = ['All', 'Women', 'Men'];
const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
const allColors = Array.from(new Set(products.flatMap((p) => p.colors.map((c) => c.name)))).sort();

function ShopView({ params }: { params: URLSearchParams }) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState(params.get('category') ?? 'All');
  const [audience, setAudience] = useState(params.get('audience') ?? 'All');
  const [size, setSize] = useState('All');
  const [color, setColor] = useState('All');
  const [saleOnly, setSaleOnly] = useState(params.get('sale') === '1');
  const [sort, setSort] = useState(params.get('sort') ?? 'featured');

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products
      .filter((p) =>
        (category === 'All' || p.category === category) &&
        (audience === 'All' || p.audience === audience || p.audience === 'Unisex') &&
        (size === 'All' || p.sizes.includes(size)) &&
        (color === 'All' || p.colors.some((c) => c.name === color)) &&
        (!saleOnly || p.salePrice !== undefined) &&
        (!needle || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(needle)))
      .sort((a, b) => {
        if (sort === 'price-low') return unitPrice(a) - unitPrice(b);
        if (sort === 'price-high') return unitPrice(b) - unitPrice(a);
        if (sort === 'newest') return Number(!!b.newArrival) - Number(!!a.newArrival);
        return Number(!!b.featured) - Number(!!a.featured);
      });
  }, [q, category, audience, size, color, saleOnly, sort]);

  const reset = () => { setQ(''); setCategory('All'); setAudience('All'); setSize('All'); setColor('All'); setSaleOnly(false); };

  return (
    <div className="container page-wrap">
      <span className="eyebrow">THE COLLECTION</span>
      <h1 className="page-title">{saleOnly ? 'Sale' : category !== 'All' ? category : 'Shop everything'}</h1>

      <div className="chip-row" role="group" aria-label="Category">
        {['All', ...categories].map((c) => (
          <button key={c} type="button" className={category === c ? 'chip active' : 'chip'} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>
        ))}
        <button type="button" className={saleOnly ? 'chip chip-sale active' : 'chip chip-sale'} aria-pressed={saleOnly} onClick={() => setSaleOnly(!saleOnly)}>Sale</button>
      </div>

      <div className="shop-tools">
        <label className="search-field">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search products</span>
          <input placeholder="Search by name or category" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label><span className="sr-only">For</span>
          <select value={audience} onChange={(e) => setAudience(e.target.value)}>
            {audiences.map((a) => <option key={a} value={a}>{a === 'All' ? 'Women & men' : a}</option>)}
          </select>
        </label>
        <label><span className="sr-only">Size</span>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="All">All sizes</option>
            {allSizes.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label><span className="sr-only">Colour</span>
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="All">All colours</option>
            {allColors.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="sort-field"><span className="sr-only">Sort products</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Sort: Featured</option>
            <option value="newest">Sort: Newest</option>
            <option value="price-low">Sort: Price, low to high</option>
            <option value="price-high">Sort: Price, high to low</option>
          </select>
        </label>
      </div>

      <p className="result-count" role="status">{list.length} {list.length === 1 ? 'piece' : 'pieces'}</p>
      {list.length ? (
        <ProductGrid items={list} />
      ) : (
        <div className="empty">
          <p>No pieces match those filters.</p>
          <button type="button" className="button" onClick={reset}>Clear filters</button>
        </div>
      )}
    </div>
  );
}

// Re-mount when the URL changes so header links like "Women" or "Sale" reset the filters.
function ShopRoute() {
  const params = useSearchParams();
  return <ShopView key={params.toString()} params={new URLSearchParams(params.toString())} />;
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="container page-wrap" />}>
      <ShopRoute />
    </Suspense>
  );
}
