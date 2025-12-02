"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const productSchema = z.object({
  sku: z.string().min(2, "SKU is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  unit: z.string().default("piece"),
  basePrice: z.coerce.number().positive("Price must be positive"),
  costPrice: z.coerce.number().positive().optional().nullable(),
  taxRate: z.coerce.number().min(0).max(100).default(18),
  stockQuantity: z.coerce.number().int().optional().nullable(),
});

export async function getProducts() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return products;
}

export async function getProductById(id: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  return product;
}

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = productSchema.safeParse({
    sku: formData.get("sku"),
    name: formData.get("name"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    unit: formData.get("unit") || "piece",
    basePrice: formData.get("basePrice"),
    costPrice: formData.get("costPrice") || null,
    taxRate: formData.get("taxRate") || 18,
    stockQuantity: formData.get("stockQuantity") || null,
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      details: validatedFields.error.flatten(),
    };
  }

  try {
    // Check if SKU already exists
    const existing = await prisma.product.findUnique({
      where: { sku: validatedFields.data.sku },
    });

    if (existing) {
      return { error: "A product with this SKU already exists" };
    }

    const product = await prisma.product.create({
      data: {
        ...validatedFields.data,
        images: [], // Empty array for now
      },
    });

    revalidatePath("/products");
    return { success: true, product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = productSchema.safeParse({
    sku: formData.get("sku"),
    name: formData.get("name"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    unit: formData.get("unit") || "piece",
    basePrice: formData.get("basePrice"),
    costPrice: formData.get("costPrice") || null,
    taxRate: formData.get("taxRate") || 18,
    stockQuantity: formData.get("stockQuantity") || null,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return { success: true, product };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Soft delete
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { error: "Failed to delete product" };
  }
}
