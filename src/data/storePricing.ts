import {
  catalogProducts,
  type CatalogCategoryId,
  type CatalogProduct,
} from "@/src/data/catalog";

export type StorePrice = {
  priceSar: number;
  unit: string;
  minQty: number;
};

/** Default wholesale guide prices by category (SAR). Admin can override later via CMS. */
const categoryDefaults: Record<
  CatalogCategoryId,
  { priceSar: number; unit: string; minQty: number }
> = {
  poultry: { priceSar: 22, unit: "كيلو", minQty: 10 },
  fresh_produce: { priceSar: 8, unit: "كيلو", minQty: 20 },
  frozen_veg_fruit: { priceSar: 12, unit: "كيس", minQty: 10 },
  frozen_fries: { priceSar: 45, unit: "كيس", minQty: 10 },
  oils_sauces_tuna: { priceSar: 35, unit: "كرتون", minQty: 5 },
  fresh_juices: { priceSar: 18, unit: "كرتون", minQty: 5 },
  rice_pulses: { priceSar: 55, unit: "كيس", minQty: 5 },
  eggs: { priceSar: 16, unit: "كرتونة", minQty: 20 },
  frozen_meat: { priceSar: 28, unit: "كيلو", minQty: 10 },
  dates: { priceSar: 40, unit: "كيلو", minQty: 5 },
  dairy: { priceSar: 25, unit: "كيلو", minQty: 5 },
  beverages: { priceSar: 120, unit: "كرتون", minQty: 3 },
  water: { priceSar: 18, unit: "كرتون", minQty: 10 },
  ready_frozen: { priceSar: 48, unit: "كرتون", minQty: 5 },
};

/** Optional per-SKU overrides */
const overrides: Partial<Record<string, StorePrice>> = {
  "p-breast-rahan": { priceSar: 26, unit: "كيلو", minQty: 10 },
};

export type PurchasableProduct = CatalogProduct & StorePrice;

export function getStorePrice(product: CatalogProduct): StorePrice {
  return (
    overrides[product.id] || {
      ...categoryDefaults[product.category],
    }
  );
}

export function getPurchasableProduct(id: string): PurchasableProduct | null {
  const base = catalogProducts.find((p) => p.id === id);
  if (!base) return null;
  return { ...base, ...getStorePrice(base) };
}

export function listPurchasableProducts(): PurchasableProduct[] {
  return catalogProducts.map((p) => ({ ...p, ...getStorePrice(p) }));
}

export function formatSar(amount: number) {
  return `${amount.toLocaleString("ar-SA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ر.س`;
}
