'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Grid2X2 } from 'lucide-react';

const Boutique = dynamic(() => import('../../boutique'), {
  ssr: false,
  loading: () => <div className="scene-frame scene-loading">Preparing the virtual boutique…</div>,
});

export default function VirtualStore() {
  const [fallback, setFallback] = useState(false);
  return (
    <div className="virtual-page">
      <div className="virtual-head">
        <div>
          <span className="eyebrow">VEENBREEZE EXPERIENCE</span>
          <h1>Virtual boutique</h1>
        </div>
        <div className="virtual-links">
          <Link className="text-link" href="/shop"><Grid2X2 size={15} /> Shop grid</Link>
          <Link className="text-link" href="/"><ArrowLeft size={15} /> Exit</Link>
        </div>
      </div>

      {fallback ? (
        <div className="page-wrap">
          <p>The 3D experience could not start on this device. Continue shopping in the product catalogue.</p>
          <Link className="button" href="/shop">Shop the collection</Link>
        </div>
      ) : (
        <Boutique onFallback={() => setFallback(true)} />
      )}

      <p className="store-caption">Drag to look around · click a garment to view its details.</p>
    </div>
  );
}
