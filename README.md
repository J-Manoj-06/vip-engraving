# Vip Arts — Wooden Engraving Crafts (Frontend)

Elegant, nature-inspired, handcrafted wooden engraving website. Built with semantic HTML, modern CSS, and vanilla JavaScript.

## Preview locally
- Option 1: Double-click `index.html` to open in your browser (no build step required).
- Option 2 (optional, if modules or CORS are ever needed): run a static server in this folder.
  - Node: `npx http-server -p 8080` then open `http://localhost:8080`

## File structure
```
vip_arts/
  index.html
  assets/
    css/
      main.css
    js/
      products.js   ← dummy products data (edit here)
      app.js        ← all interactions/UI logic
    img/           ← SVG placeholders (logo, textures, team)
    icons/         ← social + WhatsApp icons
    data/
      products.json (reference copy of product data; not required by app)
```

## WhatsApp setup (required)
- Open `assets/js/app.js` and edit the top variable:
  ```js
  const WHATSAPP_NUMBER = "919876543210"; // change to your number
  ```
- Format: international digits only (no `+` or spaces). Example: `91xxxxxxxxxx`.

### WhatsApp behavior
- Product details show a prominent "Contact on WhatsApp" button.
- Prefilled message template:
  `Hello, I am interested in the PRODUCT_NAME (SKU: PRODUCT_SKU, Price: ₹PRODUCT_PRICE). I want to know more about size/material/availability. My preferred delivery city is CITY.`
- Selected options (size/material) are appended. A simple product link is included.
- Opens `https://wa.me/NUMBER?text=ENCODED_MESSAGE` in a new tab. If no client is available, the message is copied and a toast is shown.

## Edit products
- Primary source: `assets/js/products.js` → update, add or remove objects in the `PRODUCTS` array.
- Each product supports:
  ```js
  {
    id, sku, name, category, price,
    shortDesc, fullDesc,
    mediaType: 'image' | 'video',
    mediaUrl, mediaPreview,
    mediaGallery: [urls...],
    sizeOptions: [..], materialOptions: [..],
    productLink
  }
  ```
- Categories used by filters: `wall-art`, `keychain`, `name-plate`, `custom`.
- Optional reference: `assets/data/products.json` mirrors the same data in JSON.

## Replace media
- Replace SVG placeholders in `assets/img/` with your own images as needed.
- For product and gallery media, use your own URLs or host static files in `assets/` and update `mediaUrl`/`mediaGallery`.
- Videos in examples use Pexels CDN. You can replace them with your own MP4/WebM files.

## Styling
- Theme variables are defined in `assets/css/main.css` under `:root` and `body[data-theme="light"]`.
- Use the theme toggle (🌗) to switch themes; choice persists to `localStorage`.

## Performance
- Images use `loading="lazy"` + progressive loading (tiny preview → full image via `data-src`).
- Minimal JS, no frameworks; GSAP is optional for a subtle hero parallax.
- Minify: You can minify/concatenate CSS/JS with any tool (esbuild, Terser, cssnano). Example:
  - CSS: `npx cssnano assets/css/main.css assets/css/main.min.css`
  - JS: `npx terser assets/js/app.js -o assets/js/app.min.js -c -m`
  - Then in `index.html`, replace links to use the `.min` files.

## Accessibility
- Semantic landmarks (`header`, `main`, `section`, `footer`).
- Alt text for media, keyboard focus states, skip link, ARIA labels.
- Product cards open/close with Enter/Space, close with Esc. Gallery/lightbox supports arrows + Esc.

## Features checklist
- Home hero with animated headline and parallax
- About timeline reveal + team card tilt
- Shop grid with image/video support, hover overlay, expand details inline, filters/search/sort, pagination, WhatsApp CTA
- Custom order form with validation, preview uploads, WhatsApp-confirm modal, optional localStorage demo
- Gallery masonry grid + lightbox modal
- Testimonials carousel (auto + manual, pause on hover)
- Contact form + social links + map embed
- Sticky header with active nav links, smooth scroll, theme toggle (persisted)

## Attributions
- Placeholder images: Unsplash (`https://unsplash.com`) — replace in production.
- Placeholder videos: Pexels Videos (`https://www.pexels.com/videos/`) — replace in production.
- Icons are simple SVGs created for this demo.

## Business API note
If/when you move to WhatsApp Business API, replace `https://wa.me/NUMBER?text=` with your provider’s API endpoint while keeping the same `encodeURIComponent(message)` pattern. 