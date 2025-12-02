"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  displayOrder: z.coerce.number().default(0),
});

export async function getCategories() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      parent: true,
      _count: {
        select: { products: true, children: true },
      },
    },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });

  return categories;
}

export async function getCategoryById(id: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: true,
      products: {
        where: { isActive: true },
        take: 10,
      },
    },
  });

  return category;
}

export async function createCategory(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    parentId: formData.get("parentId") || null,
    displayOrder: formData.get("displayOrder") || 0,
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      details: validatedFields.error.flatten(),
    };
  }

  try {
    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug: validatedFields.data.slug },
    });

    if (existing) {
      return { error: "A category with this slug already exists" };
    }

    const category = await prisma.category.create({
      data: validatedFields.data,
    });

    revalidatePath("/categories");
    revalidatePath("/products");
    return { success: true, category };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    parentId: formData.get("parentId") || null,
    displayOrder: formData.get("displayOrder") || 0,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath("/categories");
    revalidatePath("/products");
    return { success: true, category };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (category && category._count.products > 0) {
      return { error: "Cannot delete category with products" };
    }

    // Soft delete
    await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { error: "Failed to delete category" };
  }
}
