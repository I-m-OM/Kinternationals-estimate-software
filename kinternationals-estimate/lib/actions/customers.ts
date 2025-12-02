"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default("India"),
  notes: z.string().optional(),
});

export async function getCustomers() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const customers = await prisma.customer.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { estimates: true },
      },
    },
  });

  return customers;
}

export async function getCustomerById(id: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      estimates: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  return customer;
}

export async function createCustomer(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
    country: formData.get("country") || "India",
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      details: validatedFields.error.flatten(),
    };
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        ...validatedFields.data,
        createdById: session.user.id,
      },
    });

    revalidatePath("/customers");
    return { success: true, customer };
  } catch (error) {
    console.error("Failed to create customer:", error);
    return { error: "Failed to create customer" };
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
    country: formData.get("country") || "India",
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath("/customers");
    revalidatePath(`/customers/${id}`);
    return { success: true, customer };
  } catch (error) {
    console.error("Failed to update customer:", error);
    return { error: "Failed to update customer" };
  }
}

export async function deleteCustomer(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Soft delete
    await prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/customers");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return { error: "Failed to delete customer" };
  }
}
