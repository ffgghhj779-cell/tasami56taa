import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getPurchasableProduct,
  type PurchasableProduct,
} from "@/src/data/storePricing";

export type CartLine = {
  catalogId: string;
  title: string;
  imageUrl: string;
  unit: string;
  unitPriceSar: number;
  minQty: number;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  addProduct: (product: PurchasableProduct, qty?: number) => void;
  addById: (catalogId: string, qty?: number) => void;
  setQuantity: (catalogId: string, quantity: number) => void;
  removeItem: (catalogId: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "tasami_cart_v1";
const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() =>
    typeof window === "undefined" ? [] : loadCart(),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addProduct = useCallback((product: PurchasableProduct, qty?: number) => {
    // Always add 1 unit per click (minQty is wholesale guidance, not forced on add)
    const addQty = Math.max(1, qty ?? 1);
    setItems((prev) => {
      const existing = prev.find((l) => l.catalogId === product.id);
      if (existing) {
        return prev.map((l) =>
          l.catalogId === product.id
            ? { ...l, quantity: l.quantity + addQty }
            : l,
        );
      }
      return [
        ...prev,
        {
          catalogId: product.id,
          title: product.title,
          imageUrl: product.img,
          unit: product.unit,
          unitPriceSar: product.priceSar,
          minQty: 1,
          quantity: addQty,
        },
      ];
    });
  }, []);

  const addById = useCallback(
    (catalogId: string, qty?: number) => {
      const product = getPurchasableProduct(catalogId);
      if (!product) return;
      addProduct(product, qty);
    },
    [addProduct],
  );

  const setQuantity = useCallback((catalogId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((l) => {
          if (l.catalogId !== catalogId) return l;
          const next = Math.max(1, Math.floor(quantity));
          return { ...l, quantity: next };
        })
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((catalogId: string) => {
    setItems((prev) => prev.filter((l) => l.catalogId !== catalogId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((sum, l) => sum + l.quantity, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((sum, l) => sum + l.unitPriceSar * l.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      addProduct,
      addById,
      setQuantity,
      removeItem,
      clear,
    }),
    [items, count, subtotal, addProduct, addById, setQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
