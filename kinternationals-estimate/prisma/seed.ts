import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kinternationals.com" },
    update: {},
    create: {
      email: "admin@kinternationals.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create categories
  const categories = [
    {
      name: "Cabinets",
      slug: "cabinets",
      description: "Kitchen cabinets and storage",
    },
    {
      name: "Countertops",
      slug: "countertops",
      description: "Kitchen countertops",
    },
    {
      name: "Hardware",
      slug: "hardware",
      description: "Handles, hinges, and fixtures",
    },
    {
      name: "Appliances",
      slug: "appliances",
      description: "Kitchen appliances",
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories created");

  // Create sample products
  const cabinetCategory = await prisma.category.findUnique({
    where: { slug: "cabinets" },
  });

  if (cabinetCategory) {
    await prisma.product.create({
      data: {
        sku: "CAB-001",
        name: "Base Cabinet 600mm",
        description: "Standard base cabinet with soft-close hinges",
        categoryId: cabinetCategory.id,
        unit: "piece",
        basePrice: 15000,
        costPrice: 10000,
        taxRate: 18,
        isActive: true,
      },
    });
    console.log("✅ Sample products created");
  }

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
