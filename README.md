# Veenbreeze Fashion

A static storefront for Veenbreeze Fashion, built with Next.js App Router, React 19, TypeScript, Tailwind CSS, Zustand and React Three Fiber. The catalogue, product pages, shopping bag, checkout request flow and virtual boutique all share one product dataset.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run typecheck   # TypeScript validation
npm run lint        # ESLint
npm run build       # static export into out/
npm start           # serve a production build locally
```

## How the store works

- Products, prices, sizes, colours and stock live in `src/data.ts`.
- The shopping bag persists in browser local storage through `src/store.ts`.
- Checkout validates the delivery details, then prepares an order summary and sends the customer to WhatsApp to confirm stock, delivery and payment. No payment is processed on the site.
- The virtual boutique is a client-rendered Three.js scene. Product photos are used as rack textures, with category-shaped procedural garments as loading fallbacks.
- Shared UI lives in `src/components/`; pages live in `src/app/`.

## Configuration

Store-wide settings are in the `store` object in `src/data.ts`. The two values that commonly change per deployment are read from build-time environment variables:

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number in international format, digits only | `255754123456` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact email | `hello@veenbreeze.co.tz` |

Set these as repository variables in GitHub (`Settings → Secrets and variables → Actions → Variables`) before deploying. For local development, put them in `.env.local`.

Product photos are remote Unsplash URLs. Replace them with owned or licensed images in `src/data.ts` before launch.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds the static export and publishes it with GitHub Actions.

1. Push the repository to GitHub.
2. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` or run the workflow manually.

The workflow uses `actions/configure-pages` to detect the correct base path automatically, so the site works both on project pages (`https://<user>.github.io/<repo>/`) and on custom domains. The build writes to `out/` and includes a `.nojekyll` marker so Next.js assets are served correctly.

## Checks

`npm run typecheck`, `npm run lint` and `npm run build` must pass before deployment. The workflow runs all three on every pull request and on every push to `main`.
