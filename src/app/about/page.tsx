import Link from 'next/link';

export const metadata = { title: 'Our story' };

export default function About() {
  return (
    <div className="container page-wrap prose-page">
      <span className="eyebrow">OUR STORY</span>
      <h1 className="page-title">Clothes to live in. <i>Room to be yourself.</i></h1>
      <p className="page-intro">Veenbreeze Fashion is a concept boutique celebrating everyday personal style. Our collection brings together relaxed tailoring, natural textures, and pieces designed to be worn your way, in the warmth and colour of the coast.</p>
      <p className="page-intro">This storefront is a working demonstration. Product descriptions and inventory are sample content and do not represent a verified operating retailer.</p>
      <Link className="button" href="/shop">Discover the collection</Link>
    </div>
  );
}
