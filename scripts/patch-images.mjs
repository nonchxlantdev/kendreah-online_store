import fs from "fs";

const path = "src/data/products.ts";
let s = fs.readFileSync(path, "utf8");

s = s.replace(
  /const u = \(id: string, w = 900, h = 1200\) =>\n  `https:\/\/images\.unsplash\.com\/photo-\$\{id\}\?auto=format&fit=crop&w=\$\{w\}&h=\$\{h\}&q=80`;/,
  "const img = (file: string) => `/products/${file}`;"
);

const flat = [
  "floral-1.jpg",
  "floral-2.jpg",
  "twopiece-1.jpg",
  "twopiece-2.jpg",
  "polo-1.jpg",
  "polo-2.jpg",
  "jeans-1.jpg",
  "jeans-2.jpg",
  "blouse-1.jpg",
  "blouse-2.jpg",
  "kids-1.jpg",
  "kids-2.jpg",
  "tee-1.jpg",
  "tee-2.jpg",
  "linen-1.jpg",
  "linen-2.jpg",
  "sandals-1.jpg",
  "sandals-2.jpg",
  "sneakers-1.jpg",
  "sneakers-2.jpg",
  "loafers-1.jpg",
  "loafers-2.jpg",
  "heels-1.jpg",
  "heels-2.jpg",
  "school-1.jpg",
  "school-2.jpg",
  "walk-1.jpg",
  "walk-2.jpg",
  "slip-1.jpg",
  "slip-2.jpg",
  "dress-1.jpg",
  "dress-2.jpg",
  "airfryer-1.jpg",
  "airfryer-2.jpg",
  "blender-1.jpg",
  "blender-2.jpg",
  "kettle-1.jpg",
  "kettle-2.jpg",
  "iron-1.jpg",
  "iron-2.jpg",
  "fan-1.jpg",
  "fan-2.jpg",
  "rice-1.jpg",
  "rice-2.jpg",
  "mixer-1.jpg",
  "mixer-2.jpg",
  "toaster-1.jpg",
  "toaster-2.jpg",
].map((f) => `img("${f}")`);

const calls = [...s.matchAll(/u\("[^"]+"(?:,\s*\d+)?(?:,\s*\d+)?\)/g)];
console.log("u calls", calls.length, "replacements", flat.length);

let i = 0;
s = s.replace(/u\("[^"]+"(?:,\s*\d+)?(?:,\s*\d+)?\)/g, () => flat[i++]);
fs.writeFileSync(path, s);
console.log("patched", i);
