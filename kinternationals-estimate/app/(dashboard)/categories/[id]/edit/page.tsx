import { getCategoryById, getCategories } from "@/lib/actions/categories";
import { CategoryForm } from "@/components/categories/category-form";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [category, categories] = await Promise.all([
    getCategoryById(id),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <CategoryForm mode="edit" category={category} categories={categories} />
    </div>
  );
}
