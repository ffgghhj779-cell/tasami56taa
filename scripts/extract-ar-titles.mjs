import fs from 'fs'

const text = fs.readFileSync('src/data/catalog.ts', 'utf8')
const products = []
const re = /\{\s*\n\s*id:\s*"([^"]+)",[\s\S]*?\n\s*title:\s*"([^"]+)"/g
let m
while ((m = re.exec(text))) products.push({ id: m[1], ar: m[2] })
console.log('count', products.length)
fs.writeFileSync('scripts/_ar-titles.json', JSON.stringify(products, null, 2))
