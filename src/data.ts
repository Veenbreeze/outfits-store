import type { Product } from './types';

const photo = (id: string, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const products: Product[] = [
  {
    id: 'vb-001', name: 'Linen Ease Shirt', slug: 'linen-ease-shirt', category: 'Shirts', audience: 'Men',
    description: 'A relaxed, breathable linen shirt with a softly structured collar and mother-of-pearl inspired buttons. Made for warm days and unhurried evenings.',
    fit: 'Relaxed fit. If you are between sizes, size down.',
    price: 78000, salePrice: 68000, sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Natural', hex: '#d8c7a7' }, { name: 'White', hex: '#eeeae1' }, { name: 'Olive', hex: '#69705a' }],
    stock: 18, image: photo('photo-1596755094514-f87e34085b2c'), featured: true, newArrival: true,
  },
  {
    id: 'vb-002', name: 'Everyday Cotton Tee', slug: 'everyday-cotton-tee', category: 'T-shirts', audience: 'Unisex',
    description: 'A substantial cotton jersey tee with a clean neckline and an easy, considered fit.',
    fit: 'Regular fit. True to size.',
    price: 42000, sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#242321' }, { name: 'White', hex: '#eae7df' }, { name: 'Clay', hex: '#aa705c' }],
    stock: 25, image: photo('photo-1521572163474-6864f9cf17ab'), featured: true,
  },
  {
    id: 'vb-003', name: 'Tailored Wide-Leg Trouser', slug: 'tailored-wide-leg-trouser', category: 'Trousers', audience: 'Women',
    description: 'Fluid, high-waisted tailoring with a clean front and an elegant full-length leg.',
    fit: 'High rise, full length. True to size.',
    price: 96000, sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Charcoal', hex: '#454542' }, { name: 'Sand', hex: '#b8a88d' }],
    stock: 12, image: photo('photo-1594633312681-425c7b97ccd1'), featured: true, newArrival: true,
  },
  {
    id: 'vb-004', name: 'Sundown Midi Dress', slug: 'sundown-midi-dress', category: 'Dresses', audience: 'Women',
    description: 'An effortless midi silhouette with gentle movement, adjustable straps, and a softly defined waist.',
    fit: 'Fitted at the waist, flowing skirt. Adjustable straps.',
    price: 119000, sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Terracotta', hex: '#ac6854' }, { name: 'Black', hex: '#282725' }],
    stock: 9, image: photo('photo-1595777457583-95e059d581b8'), featured: true,
  },
  {
    id: 'vb-005', name: 'Studio Utility Jacket', slug: 'studio-utility-jacket', category: 'Jackets', audience: 'Unisex',
    description: 'A light layer in tactile cotton twill, finished with considered seams and practical patch pockets.',
    fit: 'Boxy fit, made for layering. Size down for a closer fit.',
    price: 145000, sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Olive', hex: '#59624e' }, { name: 'Stone', hex: '#b9b09f' }],
    stock: 7, image: photo('photo-1591047139829-d91aecb6caea'), newArrival: true,
  },
  {
    id: 'vb-006', name: 'Weekend Knit Polo', slug: 'weekend-knit-polo', category: 'Shirts', audience: 'Men',
    description: 'A fine-gauge knit polo that brings texture and quiet polish to everyday dressing.',
    fit: 'Regular fit. True to size.',
    price: 89000, sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Cream', hex: '#ded6c8' }, { name: 'Espresso', hex: '#594a3c' }],
    stock: 14, image: photo('photo-1625698311031-f0dd15be5144'), newArrival: true,
  },
  {
    id: 'vb-007', name: 'Denim Straight Jean', slug: 'denim-straight-jean', category: 'Jeans', audience: 'Unisex',
    description: 'A versatile mid-rise straight jean with a soft, lived-in wash and durable construction.',
    fit: 'Mid rise, straight leg. Sized by waist in inches.',
    price: 105000, sizes: ['28', '30', '32', '34'],
    colors: [{ name: 'Indigo', hex: '#354760' }, { name: 'Washed black', hex: '#454440' }],
    stock: 11, image: photo('photo-1542272604-787c3835535d'),
  },
  {
    id: 'vb-008', name: 'Coastal Pleated Skirt', slug: 'coastal-pleated-skirt', category: 'Skirts', audience: 'Women',
    description: 'Light-catching pleats and an easy elasticated waist make this skirt a wardrobe favourite.',
    fit: 'Elasticated waist, midi length. True to size.',
    price: 92000, sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Black', hex: '#252422' }, { name: 'Ochre', hex: '#ad8952' }],
    stock: 8, image: photo('photo-1583496661160-fb5886a0aaaa'),
  },
  {
    id: 'vb-009', name: 'Hanger Cotton Tee', slug: 'hanger-cotton-tee', category: 'T-shirts', audience: 'Unisex',
    description: 'A clean cotton crew-neck tee with an easy everyday shape and a soft, considered finish.',
    fit: 'Regular fit. True to size.',
    price: 46000, sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'White', hex: '#eeeae1' }, { name: 'Black', hex: '#242321' }],
    stock: 20, image: photo('photo-1578932750355-5eb30ece487a'), featured: true, newArrival: true,
  },
];

export const categories = Array.from(new Set(products.map((p) => p.category)));

/** Pieces styled together in the homepage "Shop the look" section. */
export const lookIds = ['vb-001', 'vb-003', 'vb-005'];

export const store = {
  // Placeholders: replace with the business's real details before launch.
  whatsapp: '255000000000',
  email: 'hello@veenbreeze.example',
  showroom: 'Showroom address to be confirmed',
  hours: 'Opening hours to be confirmed',
  deliveryFee: 5000,
  freeDeliveryFrom: 150000,
  lowStockAt: 8,
};

export const unitPrice = (p: Product) => p.salePrice ?? p.price;

export const money = (n: number) =>
  new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(n);

export const deliveryFor = (subtotal: number) => (subtotal >= store.freeDeliveryFrom ? 0 : store.deliveryFee);

export const whatsappLink = (text: string) => `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(text)}`;
