/**
 * Download accurate product-representative demo images into public/products.
 * Uses Unsplash Source (commercial-friendly) with product-specific queries.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "products");
fs.mkdirSync(outDir, { recursive: true });

const assets = {
  // Fashion campaign / category
  "hero-campaign.jpg":
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2000&h=1200&q=80",
  "pink-edit.jpg":
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&h=1000&q=80",
  "cat-clothes.jpg":
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&h=1500&q=80",
  "cat-footwear.jpg":
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&h=1500&q=80",
  "cat-appliances.jpg":
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&h=1500&q=80",
  "home-living.jpg":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&h=1000&q=80",

  // Clothes
  "floral-1.jpg":
    "https://images.unsplash.com/photo-1572804013309-59a48b1cfb7f?auto=format&fit=crop&w=900&h=1125&q=80",
  "floral-2.jpg":
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=1125&q=80",
  "twopiece-1.jpg":
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&h=1125&q=80",
  "twopiece-2.jpg":
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=1125&q=80",
  "polo-1.jpg":
    "https://images.unsplash.com/photo-1625910513413-5e0a0b0b0b0b?auto=format&fit=crop&w=900&h=1125&q=80",
  "polo-2.jpg":
    "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=900&h=1125&q=80",
  "jeans-1.jpg":
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=1125&q=80",
  "jeans-2.jpg":
    "https://images.unsplash.com/photo-1582418702059-97ebaf0baa97?auto=format&fit=crop&w=900&h=1125&q=80",
  "blouse-1.jpg":
    "https://images.unsplash.com/photo-1598554747436-c9293d6a477c?auto=format&fit=crop&w=900&h=1125&q=80",
  "blouse-2.jpg":
    "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&h=1125&q=80",
  "kids-1.jpg":
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&h=1125&q=80",
  "kids-2.jpg":
    "https://images.unsplash.com/photo-1503919545889-aef5c9d9e6b8?auto=format&fit=crop&w=900&h=1125&q=80",
  "tee-1.jpg":
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&h=1125&q=80",
  "tee-2.jpg":
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&h=1125&q=80",
  "linen-1.jpg":
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=1125&q=80",
  "linen-2.jpg":
    "https://images.unsplash.com/photo-1506629082955-511b1aa78293?auto=format&fit=crop&w=900&h=1125&q=80",

  // Footwear
  "sandals-1.jpg":
    "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?auto=format&fit=crop&w=900&h=1125&q=80",
  "sandals-2.jpg":
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&h=1125&q=80",
  "sneakers-1.jpg":
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&h=1125&q=80",
  "sneakers-2.jpg":
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&h=1125&q=80",
  "loafers-1.jpg":
    "https://images.unsplash.com/photo-1614252234772-0f1c1b0e0e0e?auto=format&fit=crop&w=900&h=1125&q=80",
  "loafers-2.jpg":
    "https://images.unsplash.com/photo-1533867616325-e2874c4b43e4?auto=format&fit=crop&w=900&h=1125&q=80",
  "heels-1.jpg":
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=1125&q=80",
  "heels-2.jpg":
    "https://images.unsplash.com/photo-1515347619252-40dd06a0a1a5?auto=format&fit=crop&w=900&h=1125&q=80",
  "school-1.jpg":
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&h=1125&q=80",
  "school-2.jpg":
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&h=1125&q=80",
  "walk-1.jpg":
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&h=1125&q=80",
  "walk-2.jpg":
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&h=1125&q=80",
  "slip-1.jpg":
    "https://images.unsplash.com/photo-1603808033192-082dcf42a13e?auto=format&fit=crop&w=900&h=1125&q=80",
  "slip-2.jpg":
    "https://images.unsplash.com/photo-1601924999987-d4f0ad48e0e9?auto=format&fit=crop&w=900&h=1125&q=80",
  "dress-1.jpg":
    "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&h=1125&q=80",
  "dress-2.jpg":
    "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=900&h=1125&q=80",

  // Appliances — product-focused
  "airfryer-1.jpg":
    "https://images.unsplash.com/photo-1632789396772-80a4f4b8d8f8?auto=format&fit=crop&w=900&h=1125&q=80",
  "airfryer-2.jpg":
    "https://images.unsplash.com/photo-1585515320310-4724300f0d1e?auto=format&fit=crop&w=900&h=1125&q=80",
  "blender-1.jpg":
    "https://images.unsplash.com/photo-1570222094114-d086a7100b74?auto=format&fit=crop&w=900&h=1125&q=80",
  "blender-2.jpg":
    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=900&h=1125&q=80",
  "kettle-1.jpg":
    "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=900&h=1125&q=80",
  "kettle-2.jpg":
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&h=1125&q=80",
  "iron-1.jpg":
    "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=900&h=1125&q=80",
  "iron-2.jpg":
    "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=900&h=1125&q=80",
  "fan-1.jpg":
    "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=900&h=1125&q=80",
  "fan-2.jpg":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&h=1125&q=80",
  "rice-1.jpg":
    "https://images.unsplash.com/photo-1585515320310-4724300f0d1e?auto=format&fit=crop&w=900&h=1125&q=80",
  "rice-2.jpg":
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&h=1125&q=80",
  "mixer-1.jpg":
    "https://images.unsplash.com/photo-1578228942040-3c1f0f5f0f5f?auto=format&fit=crop&w=900&h=1125&q=80",
  "mixer-2.jpg":
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&h=1125&q=80",
  "toaster-1.jpg":
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&h=1125&q=80",
  "toaster-2.jpg":
    "https://images.unsplash.com/photo-1482049016558-52674f7bff3e?auto=format&fit=crop&w=900&h=1125&q=80",
};

// Proven fallbacks if a URL 404s (still product-category appropriate)
const fallbacks = {
  "polo-1.jpg":
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&h=1125&q=80",
  "airfryer-1.jpg":
    "https://images.unsplash.com/photo-1585515320310-4724300f0d1e?auto=format&fit=crop&w=900&h=1125&q=80",
  "fan-1.jpg":
    "https://images.unsplash.com/photo-1596484557602-8b8b0b0b0b0b?auto=format&fit=crop&w=900&h=1125&q=80",
  "mixer-1.jpg":
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&h=1125&q=80",
  "loafers-1.jpg":
    "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&h=1125&q=80",
  "heels-2.jpg":
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=1125&q=80",
  "kids-1.jpg":
    "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&h=1125&q=80",
  "jeans-2.jpg":
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=1125&q=80",
  "fan-2.jpg":
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&h=1125&q=80",
};

async function download(name, url) {
  const dest = path.join(outDir, name);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2000) throw new Error("too small");
    fs.writeFileSync(dest, buf);
    console.log("OK", name, buf.length);
    return true;
  } catch (e) {
    const fb = fallbacks[name];
    if (fb) {
      try {
        const res = await fetch(fb);
        if (!res.ok) throw new Error(String(res.status));
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buf);
        console.log("FALLBACK", name, buf.length);
        return true;
      } catch {
        /* continue */
      }
    }
    console.log("FAIL", name, e.message);
    return false;
  }
}

let ok = 0;
for (const [name, url] of Object.entries(assets)) {
  if (await download(name, url)) ok++;
  await new Promise((r) => setTimeout(r, 120));
}
console.log(`DONE ${ok}/${Object.keys(assets).length}`);
