import fs from "fs";
const text = fs.readFileSync("src/data/catalog.ts", "utf8");
const catIds = new Set([
  "poultry", "fresh_produce", "frozen_veg_fruit", "frozen_fries", "oils_sauces_tuna",
  "fresh_juices", "rice_pulses", "eggs", "frozen_meat", "dates", "dairy", "beverages", "water", "ready_frozen",
]);
const products = [];
const re = /\{\s*\n\s*id:\s*"([^"]+)",[\s\S]*?\n\s*title:\s*"([^"]+)"/g;
let m;
while ((m = re.exec(text))) {
  if (!catIds.has(m[1])) products.push({ id: m[1], title: m[2] });
}
console.log(JSON.stringify(products, null, 2));