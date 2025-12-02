"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import {
  generateEstimateNumber,
  calculateEstimateTotals,
} from "@/lib/services/pricing-service";

const estimateItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unit: z.string().default("piece"),
  unitPrice: z.coerce.number().positive("Price must be positive"),
  taxRate: z.coerce.number().min(0).max(100).default(18),
});

const estimateSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  validUntil: z.string().optional(),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  discountAmount: z.coerce.number().min(0).default(0),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  items: z.array(estimateItemSchema).min(1, "At least one item is required"),
});

export async function getEstimates() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const estimates = await prisma.estimate.findMany({
    include: {
      customer: true,
      user: true,
      _count: {
        select: { items: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return estimates;
}

export async function getEstimateById(id: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const estimate = await prisma.estimate.findUnique({
    where: { id },
    include: {
      customer: true,
      user: true,
      items: {
        include: {
          product: true,
        },
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  return estimate;
}

export async function createEstimate(data: z.infer<typeof estimateSchema>) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = estimateSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      details: validatedFields.error.flatten(),
    };
  }

  try {
    const { items, ...estimateData } = validatedFields.data;

    // Generate estimate number
    const lastEstimate = await prisma.estimate.findFirst({
      orderBy: { estimateNumber: "desc" },
    });
    const estimateNumber = generateEstimateNumber(
      lastEstimate?.estimateNumber || null
    );

    // Calculate totals
    const totals = calculateEstimateTotals(
      items,
      estimateData.discountPercent,
      estimateData.discountAmount
    );

    // Create estimate with items in transaction
    await prisma.$transaction(async (tx) => {
      const newEstimate = await tx.estimate.create({
        data: {
          estimateNumber,
          customerId: estimateData.customerId,
          userId: session.user.id,
          title: estimateData.title,
          description: estimateData.description,
          validUntil: estimateData.validUntil
            ? new Date(estimateData.validUntil)
            : null,
          status: "DRAFT",
          subtotal: totals.subtotal,
          discountPercent: estimateData.discountPercent,
          discountAmount: totals.discountAmount,
          taxAmount: totals.taxAmount,
          total: totals.total,
          notes: estimateData.notes,
          termsAndConditions: estimateData.termsAndConditions,
        },
      });

      // Create estimate items
      await tx.estimateItem.createMany({
        data: items.map((item, index) => {
          const itemSubtotal = item.quantity * item.unitPrice;
          const itemTax = (itemSubtotal * item.taxRate) / 100;
          const itemTotal = itemSubtotal + itemTax;

          return {
            estimateId: newEstimate.id,
            productId: item.productId || null,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            taxAmount: itemTax,
            lineTotal: itemTotal,
            displayOrder: index,
          };
        }),
      });
    });

    revalidatePath("/estimates");
    return { success: true }; // Don't return estimate object
  } catch (error) {
    console.error("Failed to create estimate:", error);
    return { error: "Failed to create estimate" };
  }
}

export async function updateEstimate(
  id: string,
  data: z.infer<typeof estimateSchema>
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = estimateSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    const { items, ...estimateData } = validatedFields.data;

    // Calculate totals
    const totals = calculateEstimateTotals(
      items,
      estimateData.discountPercent,
      estimateData.discountAmount
    );

    // Update estimate and replace items
    await prisma.$transaction(async (tx) => {
      // Delete existing items
      await tx.estimateItem.deleteMany({
        where: { estimateId: id },
      });

      // Update estimate
      await tx.estimate.update({
        where: { id },
        data: {
          customerId: estimateData.customerId,
          title: estimateData.title,
          description: estimateData.description,
          validUntil: estimateData.validUntil
            ? new Date(estimateData.validUntil)
            : null,
          subtotal: totals.subtotal,
          discountPercent: estimateData.discountPercent,
          discountAmount: totals.discountAmount,
          taxAmount: totals.taxAmount,
          total: totals.total,
          notes: estimateData.notes,
          termsAndConditions: estimateData.termsAndConditions,
        },
      });

      // Create new items
      await tx.estimateItem.createMany({
        data: items.map((item, index) => {
          const itemSubtotal = item.quantity * item.unitPrice;
          const itemTax = (itemSubtotal * item.taxRate) / 100;
          const itemTotal = itemSubtotal + itemTax;

          return {
            estimateId: id,
            productId: item.productId || null,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            taxAmount: itemTax,
            lineTotal: itemTotal,
            displayOrder: index,
          };
        }),
      });
    });

    revalidatePath("/estimates");
    revalidatePath(`/estimates/${id}`);
    return { success: true }; // Don't return estimate object
  } catch (error) {
    console.error("Failed to update estimate:", error);
    return { error: "Failed to update estimate" };
  }
}

export async function updateEstimateStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.estimate.update({
      where: { id },
      data: { status: status as any },
    });

    revalidatePath("/estimates");
    revalidatePath(`/estimates/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { error: "Failed to update status" };
  }
}

export async function deleteEstimate(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Delete estimate (items will be cascade deleted)
    await prisma.estimate.delete({
      where: { id },
    });

    revalidatePath("/estimates");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete estimate:", error);
    return { error: "Failed to delete estimate" };
  }
}
