import { Navigate, useParams } from "react-router-dom";
import SiteFrame from "@/src/components/SiteFrame";
import ProductsCatalog from "@/src/pages/ProductsCatalog";
import { categoryBySlug, catalogProducts } from "@/src/data/catalog";

export default function CategoryPage() {
  const { slug } = useParams();
  const category = categoryBySlug(slug);
  if (!category) return <Navigate to="/#products" replace />;
  const count = catalogProducts.filter((product) => product.category === category.id).length;

  return (
    <SiteFrame
      title={`تسامي الوطنية | ${category.heading}`}
      description={`${category.heading} من مؤسسة تسامي الوطنية. ${count} منتج في الكتالوج، والسعر عند الطلب.`}
      heading={category.heading}
      lead={`${category.subtitle}. العدد الظاهر هو المتوفر في الكتالوج الآن، وعرض السعر يُرسل بعد تحديد الكمية والمدينة.`}
      whatsappText={`السلام عليكم، أريد عرض سعر لقسم: ${category.title}`}
    >
      <ProductsCatalog lockedCategory={category.id} />
    </SiteFrame>
  );
}
