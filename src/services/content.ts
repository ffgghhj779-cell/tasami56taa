import {
  defaultFaqs,
  defaultProductOptions,
  defaultProducts,
  defaultTestimonials,
} from "@/src/data/defaults";
import { supabase, supabaseConfigured } from "@/src/lib/supabase";
import type {
  Faq,
  FaqCard,
  Product,
  ProductCard,
  Testimonial,
  TestimonialCard,
} from "@/src/types/database";

function mapProduct(row: Product): ProductCard {
  return {
    img: row.image_url,
    title: row.title,
    formValue: row.form_value,
    desc: row.description,
  };
}

function mapTestimonial(row: Testimonial): TestimonialCard {
  return {
    quote: row.quote,
    author: row.author,
    role: row.role,
  };
}

function mapFaq(row: Faq): FaqCard {
  return {
    q: row.question,
    a: row.answer,
  };
}

export async function fetchSiteContent() {
  if (!supabaseConfigured) {
    return {
      products: defaultProducts,
      testimonials: defaultTestimonials,
      faqs: defaultFaqs,
      productOptions: defaultProductOptions,
      fromCms: false,
    };
  }

  const [productsRes, testimonialsRes, faqsRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const products =
    productsRes.data && productsRes.data.length > 0
      ? productsRes.data.map(mapProduct)
      : defaultProducts;

  const testimonials =
    testimonialsRes.data && testimonialsRes.data.length > 0
      ? testimonialsRes.data.map(mapTestimonial)
      : defaultTestimonials;

  const faqs =
    faqsRes.data && faqsRes.data.length > 0
      ? faqsRes.data.map(mapFaq)
      : defaultFaqs;

  const formValues = Array.from(
    new Set(products.map((p) => p.formValue).filter(Boolean)),
  );
  const productOptions = [
    ...formValues,
    "جميع المنتجات (توريد شامل)",
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  return {
    products,
    testimonials,
    faqs,
    productOptions:
      productOptions.length > 1 ? productOptions : defaultProductOptions,
    fromCms: Boolean(
      (productsRes.data && productsRes.data.length) ||
        (testimonialsRes.data && testimonialsRes.data.length) ||
        (faqsRes.data && faqsRes.data.length),
    ),
  };
}

export async function listProductsAdmin() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function upsertProduct(
  row: Partial<Product> & {
    title: string;
    form_value: string;
    description: string;
    image_url: string;
  },
) {
  if (row.id) {
    const { error } = await supabase
      .from("products")
      .update({
        title: row.title,
        form_value: row.form_value,
        description: row.description,
        image_url: row.image_url,
        sort_order: row.sort_order ?? 0,
        is_active: row.is_active ?? true,
      })
      .eq("id", row.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("products").insert({
    title: row.title,
    form_value: row.form_value,
    description: row.description,
    image_url: row.image_url,
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active ?? true,
  });
  if (error) throw error;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function listTestimonialsAdmin() {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function upsertTestimonial(
  row: Partial<Testimonial> & {
    quote: string;
    author: string;
    role: string;
  },
) {
  if (row.id) {
    const { error } = await supabase
      .from("testimonials")
      .update({
        quote: row.quote,
        author: row.author,
        role: row.role,
        sort_order: row.sort_order ?? 0,
        is_active: row.is_active ?? true,
      })
      .eq("id", row.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("testimonials").insert({
    quote: row.quote,
    author: row.author,
    role: row.role,
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active ?? true,
  });
  if (error) throw error;
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

export async function listFaqsAdmin() {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function upsertFaq(
  row: Partial<Faq> & {
    question: string;
    answer: string;
  },
) {
  if (row.id) {
    const { error } = await supabase
      .from("faqs")
      .update({
        question: row.question,
        answer: row.answer,
        sort_order: row.sort_order ?? 0,
        is_active: row.is_active ?? true,
      })
      .eq("id", row.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("faqs").insert({
    question: row.question,
    answer: row.answer,
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active ?? true,
  });
  if (error) throw error;
}

export async function deleteFaq(id: string) {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
}
