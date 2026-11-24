import fs from "fs";

const files = [
  "src/app/cart/page.tsx",
  "src/app/checkout/page.tsx",
  "src/app/wishlist/page.tsx",
  "src/app/order-confirmation/page.tsx",
  "src/app/about/page.tsx",
  "src/app/contact/page.tsx",
  "src/app/delivery-returns/page.tsx",
  "src/app/product/[slug]/product-page-client.tsx",
  "src/components/contact/contact-form.tsx",
];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, "utf8");
  s = s.replaceAll("font-serif", "font-display");
  s = s.replaceAll('variant="gold"', 'variant="default"');
  s = s.replaceAll("focus-visible:ring-gold", "focus-visible:ring-pink");
  fs.writeFileSync(f, s);
  console.log("patched", f);
}
