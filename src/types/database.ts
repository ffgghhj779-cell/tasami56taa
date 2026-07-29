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
  created_at: string;
  updated_at: string;
};

export type QuoteRequestInsert = {
  business: string;
  phone: string;
  city: string;
  product: string;
  quantity: string;
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
  role: "admin" | "staff";
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name?: string;
          role?: "admin" | "staff";
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
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
