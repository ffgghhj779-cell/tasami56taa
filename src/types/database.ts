export type QuoteStatus = "new" | "contacted" | "quoted" | "closed" | "spam";

export type QuoteRequest = {
  id: string;
  business: string;
  phone: string;
  city: string;
  product: string;
  quantity: string;
  status: QuoteStatus;
  notes: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type QuoteRequestInsert = {
  business: string;
  phone: string;
  city: string;
  product: string;
  quantity: string;
  user_id?: string | null;
};

export type Product = {
  id: string;
  title: string;
  form_value: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  full_name: string;
  role: "admin" | "staff" | "customer";
  created_at: string;
  updated_at: string;
};

export type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "awaiting_transfer"
  | "paid"
  | "failed"
  | "refunded";

export type PaymentMethod = "later" | "bank_transfer" | "card";

export type Order = {
  id: string;
  order_number: string;
  user_id: string | null;
  business_name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal_sar: number;
  total_sar: number;
  currency: string;
  admin_notes: string | null;
  payment_token?: string;
  moyasar_payment_id?: string | null;
  paid_at?: string | null;
  payment_raw?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  catalog_id: string;
  title: string;
  image_url: string;
  unit: string;
  unit_price_sar: number;
  quantity: number;
  line_total_sar: number;
  created_at: string;
};

export type OrderWithItems = Order & { items: OrderItem[] };

export type CreateOrderPayload = {
  business_name: string;
  phone: string;
  city: string;
  address?: string;
  notes?: string;
  payment_method?: PaymentMethod;
  user_id?: string | null;
  items: Array<{
    catalog_id: string;
    title: string;
    image_url: string;
    unit: string;
    unit_price_sar: number;
    quantity: number;
  }>;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name?: string;
          role?: "admin" | "staff" | "customer";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, "id">>;
        Relationships: [];
      };
      quote_requests: {
        Row: QuoteRequest;
        Insert: QuoteRequestInsert & {
          id?: string;
          status?: QuoteStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<QuoteRequest>;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Product>;
        Relationships: [];
      };
      testimonials: {
        Row: Testimonial;
        Insert: Omit<Testimonial, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Testimonial>;
        Relationships: [];
      };
      faqs: {
        Row: Faq;
        Insert: Omit<Faq, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Faq>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at" | "order_number"> & {
          id?: string;
          order_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Order>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<OrderItem>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_store_order: {
        Args: {
          p_order_number: string;
          p_user_id: string | null;
          p_business_name: string;
          p_phone: string;
          p_city: string;
          p_address: string;
          p_notes: string;
          p_payment_method: string;
          p_items: Array<{
            catalog_id: string;
            title: string;
            image_url: string;
            unit: string;
            unit_price_sar: number;
            quantity: number;
          }>;
        };
        Returns: {
          id: string;
          order_number: string;
          total_sar: number;
          payment_status: string;
          payment_method: string;
          status: string;
          payment_token: string;
        };
      };
      get_order_for_payment: {
        Args: { p_token: string };
        Returns: {
          id: string;
          order_number: string;
          total_sar: number;
          currency: string;
          payment_status: string;
          payment_method: string;
          business_name: string;
          moyasar_payment_id: string | null;
          paid_at: string | null;
        } | null;
      };
      attach_moyasar_payment: {
        Args: { p_token: string; p_payment_id: string };
        Returns: {
          id: string;
          order_number: string;
          moyasar_payment_id: string;
          payment_status: string;
        };
      };
      mark_order_paid_by_moyasar: {
        Args: {
          p_payment_id: string;
          p_amount_halalas: number;
          p_currency?: string;
          p_raw?: Record<string, unknown>;
        };
        Returns: {
          id: string;
          order_number: string;
          payment_status: string;
          status: string;
          paid_at: string;
          total_sar: number;
        };
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

/** UI shapes used by the marketing site */
export type ProductCard = {
  img: string;
  title: string;
  formValue: string;
  desc: string;
};

export type TestimonialCard = {
  quote: string;
  author: string;
  role: string;
};

export type FaqCard = {
  q: string;
  a: string;
};
