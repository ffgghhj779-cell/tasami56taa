import { Link } from "react-router-dom";
import SiteFrame from "@/src/components/SiteFrame";
import { catalogCategories, catalogProducts, type CatalogCategoryId } from "@/src/data/catalog";

const restaurantCategories: CatalogCategoryId[] = [
  "poultry",
  "frozen_fries",
  "eggs",
  "fresh_produce",
  "frozen_veg_fruit",
  "oils_sauces_tuna",
  "rice_pulses",
  "ready_frozen",
  "frozen_meat",
  "dairy",
];

const marketCategories: CatalogCategoryId[] = [
  "eggs",
  "rice_pulses",
  "fresh_produce",
  "oils_sauces_tuna",
  "dairy",
  "dates",
  "beverages",
  "water",
  "poultry",
];

function CategoryList({ ids }: { ids: CatalogCategoryId[] }) {
  const items = catalogCategories.filter((category) => ids.includes(category.id));
  return (
    <ul className="grid sm:grid-cols-2 gap-3">
      {items.map((category) => {
        const count = catalogProducts.filter((product) => product.category === category.id).length;
        return (
          <li key={category.id} className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-lg font-black text-[#0A182D]">{category.title}</h2>
            <p className="text-sm text-slate-500 mt-1">{count} منتج في الكتالوج</p>
            <Link to={`/products/${category.slug}`} className="inline-block mt-3 text-sm font-bold text-[#15803D]">
              اعرض المنتجات
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function RestaurantsPage() {
  return (
    <SiteFrame
      title="تسامي الوطنية | توريد للمطاعم والفنادق"
      description="توريد دواجن وبطاطس وبيض ومنتجات غذائية بالجملة للمطاعم والكافيهات والفنادق. السعر عند الطلب."
      heading="توريد غذائي بالجملة للمطاعم"
      lead="هذه الصفحة للمطاعم والكافيهات والمخابز والفنادق والتموين. المنتجات المعروضة هي الموجودة في الكتالوج، والسعر يُرسل بعد مراجعة الكمية والمدينة."
      whatsappText="السلام عليكم، أريد عرض سعر لتوريد مطعم أو فندق"
    >
      <CategoryList ids={restaurantCategories} />
      <p className="mt-8 text-slate-600 leading-relaxed">
        التوصيل المبرد يُحدد مع فريق المبيعات حسب المدينة والكمية. تفاصيل ذلك في{" "}
        <Link to="/delivery" className="font-bold text-[#0E2A47]">
          صفحة التوصيل
        </Link>
        .
      </p>
    </SiteFrame>
  );
}

export function MarketsPage() {
  return (
    <SiteFrame
      title="تسامي الوطنية | توريد للأسواق والبقالات"
      description="توريد جملة للأسواق والبقالات: بيض، أرز، خضار، ألبان، ومياه. السعر عند الطلب."
      heading="توريد جملة للأسواق والبقالات"
      lead="هذه الصفحة للأسواق والبقالات. نعرض الأقسام الموجودة فعلًا في الكتالوج، ونرسل عرض السعر بعد تحديد الأصناف والكمية."
      whatsappText="السلام عليكم، أريد عرض سعر لتوريد سوق أو بقالة"
    >
      <CategoryList ids={marketCategories} />
      <p className="mt-8 text-slate-600 leading-relaxed">
        للمطاعم والفنادق راجع{" "}
        <Link to="/restaurants" className="font-bold text-[#0E2A47]">
          صفحة المطاعم
        </Link>
        .
      </p>
    </SiteFrame>
  );
}

export function DeliveryPage() {
  return (
    <SiteFrame
      title="تسامي الوطنية | التوصيل المبرد"
      description="التوصيل المبرد من مؤسسة تسامي الوطنية يُحدد حسب المدينة والكمية مع فريق المبيعات."
      heading="التوصيل المبرد"
      lead="المنتجات التي تحتاج تبريدًا تُنقل بتوصيل مبرد. مواعيد الاستلام ومدة الوصول تختلف حسب المدينة والكمية، لذلك لا ننشر قائمة مدن أو وقتًا ثابتًا قبل تأكيدها مع فريق المبيعات."
      whatsappText="السلام عليكم، أريد معرفة توصيل مبرد إلى مدينتي"
    >
      <div className="rounded-2xl border border-slate-200 p-6 space-y-3 text-slate-700 leading-relaxed">
        <h2 className="text-xl font-black text-[#0A182D]">ماذا نؤكد قبل التوصيل</h2>
        <p>المدينة، نوع المنتجات، والكمية التقريبية.</p>
        <p>بعدها يرسل الفريق إذا كانت المدينة ضمن التوصيل الحالي، وموعد الاستلام المناسب.</p>
        <h2 className="text-xl font-black text-[#0A182D] pt-4">عنوان المنشأة</h2>
        <p>ينبع، حي الحدائق، شارع الملك عبدالعزيز ابن عبدالرحمن سعود، مبنى 2452، الرمز البريدي 46429.</p>
        <p>العنوان المختصر YADB2452. هذا عنوان السجل، وليس قائمة مدن التوصيل.</p>
      </div>
    </SiteFrame>
  );
}
