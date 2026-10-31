import Link from 'next/link';

export const metadata = { title: 'Our story' };

export default function About() {
  return (
    <div className="container page-wrap prose-page">
      <span className="eyebrow">OUR STORY</span>
      <h1 className="page-title">Clothes to live in. <i>Room to be yourself.</i></h1>
      <p className="page-intro">
        Veenbreeze Fashion is a concept boutique celebrating everyday personal style. Our collection
        brings together relaxed tailoring, natural textures, and pieces designed to be worn your way,
        in the warmth and colour of the coast.
      </p>
      <p className="page-intro">
        Based in Dar es Salaam, we curate pieces that work for real life — from early morning meetings
        to long evenings by the ocean. Every garment is chosen with care, comfort, and quiet confidence
        in mind.
      </p>
      <div className="hero-actions">
        <Link className="button" href="/shop">Discover the collection</Link>
        <Link className="button button-outline" href="/contact">Get in touch</Link>
      </div>
    </div>
  );
}
