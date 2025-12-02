import { CategoryForm } from "@/components/categories/category-form";
import { getCategories } from "@/lib/actions/categories";

export default async function NewCategoryPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-4xl">
      <CategoryForm mode="create" categories={categories} />
    </div>
  );
}
