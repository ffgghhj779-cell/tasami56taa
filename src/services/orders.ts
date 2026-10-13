import { supabase, supabaseConfigured } from "@/src/lib/supabase";
import type {
  CreateOrderPayload,
  Order,
  OrderItem,
  OrderStatus,
  OrderWithItems,
  PaymentStatus,
} from "@/src/types/database";

function makeOrderNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TS-${y}${m}${day}-${rand}`;
}

export type CreatedOrder = {
  id: string;
  order_number: string;
  total_sar: number;
  payment_status: PaymentStatus;
  payment_method: string;
  status: OrderStatus;
  payment_token?: string;
};

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<CreatedOrder> {
  if (!supabaseConfigured) {
    throw new Error("Supabase is not configured");
  }

  const items = payload.items.filter((i) => i.quantity > 0);
  if (!items.length) throw new Error("السلة فارغة");

  const orderNumber = makeOrderNumber();

  const { data, error } = await supabase.rpc("create_store_order", {
    p_order_number: orderNumber,
    p_user_id: payload.user_id ?? null,
    p_business_name: payload.business_name.trim(),
    p_phone: payload.phone.trim(),
    p_city: payload.city.trim(),
    p_address: (payload.address || "").trim(),
    p_notes: (payload.notes || "").trim(),
    p_payment_method: payload.payment_method || "later",
    p_items: items.map((i) => ({
      catalog_id: i.catalog_id,
      title: i.title,
      image_url: i.image_url,
      unit: i.unit,
      unit_price_sar: i.unit_price_sar,
      quantity: i.quantity,
    })),
  });

  if (error) throw error;

  const row = data as CreatedOrder;
  const created: CreatedOrder = {
    id: row.id,
    order_number: row.order_number || orderNumber,
    total_sar: Number(row.total_sar) || 0,
    payment_status: row.payment_status || "pending",
    payment_method: row.payment_method || payload.payment_method || "later",
    status: row.status || "new",
    payment_token: row.payment_token,
  };

  void notifyWebsiteOrder({
    ...created,
    business_name: payload.business_name.trim(),
    phone: payload.phone.trim(),
    city: payload.city.trim(),
    address: (payload.address || "").trim(),
    notes: (payload.notes || "").trim(),
    items: items.map((i) => ({
      catalog_id: i.catalog_id,
      title: i.title,
      quantity: i.quantity,
      unit_price_sar: i.unit_price_sar,
      line_total_sar: i.unit_price_sar * i.quantity,
    })),
  });

  return created;
}

const DEFAULT_NOTIFY_URL =
  "https://n8n.esteemmediaa.com/webhook/tasami-website-order";

async function notifyWebsiteOrder(body: Record<string, unknown>) {
  const url =
    (import.meta.env.VITE_ORDER_NOTIFY_URL as string | undefined)?.trim() ||
    DEFAULT_NOTIFY_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch (err) {
    console.warn("[order notify]", err);
  }
}

export async function listOrdersAdmin(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function getOrderWithItems(
  orderId: string,
): Promise<OrderWithItems | null> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw error;
  if (!order) return null;

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });
  if (itemsError) throw itemsError;

  return { ...(order as Order), items: (items ?? []) as OrderItem[] };
}

export async function listMyOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updatePaymentStatus(
  id: string,
  payment_status: PaymentStatus,
) {
  const { error } = await supabase
    .from("orders")
    .update({ payment_status })
    .eq("id", id);
  if (error) throw error;
}

export async function updateOrderAdminNotes(id: string, admin_notes: string) {
  const { error } = await supabase
    .from("orders")
    .update({ admin_notes })
    .eq("id", id);
  if (error) throw error;
}
