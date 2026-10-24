# Veenbreeze Fashion

A Next.js App Router demonstration storefront with shared catalog/cart data and a client-rendered Three.js boutique. Product inventory, prices, brand story, and contact details are sample content; the checkout does not submit an order or process payment.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Production commands: `npm run build`, then `npm start`. `npm run typecheck` runs TypeScript validation.

## Product assets

Product catalog is in `src/data.ts`; product photos are current remote Unsplash examples, not verified product photography. The virtual rack loads each product's same image URL as a texture on its hanging display, so catalog and boutique stay visually linked. Replace these URLs with owned or licensed optimized imagery before launch. Put licensed/custom GLB or glTF garments in `public/models/clothing/`, hangers in `public/models/hangers/`, and fixtures in `public/models/furniture/`; textures belong in `public/textures/`. Set a product's `modelUrl` to an existing `/models/clothing/...glb` asset. The boutique retains category-specific procedural meshes as loading fallbacks: T-shirts have a crew neckline and sleeve shape; button-up shirts have a collar, placket, buttons, chest pocket, and seam details. Other sample categories also have distinct silhouettes. These are 3D geometry placeholders rather than scanned or photorealistic garments; GLB loading and fabric texture maps are not yet connected. The asset folders contain no garment model files.

## Configuration and limitations

- Shared sample products power homepage, catalog, product pages, cart, checkout, and boutique.
- Cart persists in browser local storage. Checkout is a validation-enabled demo; it clears the local demo bag after submission but creates no real order. No payment credentials are collected.
- Inventory and prices are client-side examples, not authoritative. Production needs a secure backend for product/inventory/order totals and a server-side payment provider integration.
- Configure real business email, telephone, WhatsApp, policies, delivery rates, and company details before launch. The `.example` contact address is a deliberate placeholder.
- External fonts and sample Unsplash photography need network access. No AI assistant or messaging integration is connected.
- The 3D scene uses procedural architecture and category-specific sample garment geometry, not photorealistic clothing assets. Catalog shopping remains available without WebGL.

## Checks

`npm run typecheck` and `npm run build` are available. No automated interaction test suite is configured.
