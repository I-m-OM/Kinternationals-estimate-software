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
      description: "Kitchen cabinets (dimensions calculated)",
    },
    {
      name: "Shutters",
      slug: "shutters",
      description: "Shutter materials (price per sqft)",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Kitchen accessories (unit price)",
    },
    {
      name: "Hardware",
      slug: "hardware",
      description: "Hardware items (unit price)",
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

  // Add sample shutter materials
  const shutterCategory = await prisma.category.findUnique({
    where: { slug: "shutters" },
  });

  if (shutterCategory) {
    const shutterMaterials = [
      {
        sku: "SHUT-001",
        name: "Laminate MR+ HDHMR",
        description: "Matt laminate finish on HDHMR board",
        basePrice: 850,
      },
      {
        sku: "SHUT-002",
        name: "Laminate Glossy HDHMR",
        description: "Glossy laminate finish on HDHMR board",
        basePrice: 900,
      },
      {
        sku: "SHUT-003",
        name: "Acrylic Finish",
        description: "High gloss acrylic finish",
        basePrice: 1200,
      },
    ];

    for (const shutter of shutterMaterials) {
      await prisma.product.upsert({
        where: { sku: shutter.sku },
        update: {},
        create: {
          sku: shutter.sku,
          name: shutter.name,
          description: shutter.description,
          categoryId: shutterCategory.id,
          unit: "sqft",
          basePrice: shutter.basePrice,
          taxRate: 18,
          isActive: true,
          images: [],
        },
      });
    }
    console.log("✅ Sample shutter materials created");
  }

  // Add sample cabinet types
  const cabinetCategory = await prisma.category.findUnique({
    where: { slug: "cabinets" },
  });

  if (cabinetCategory) {
    const cabinetTypes = [
      {
        sku: "CAB-TALL",
        name: "Tall Carcass (HDHMR)",
        description: "Full height cabinet",
      },
      { sku: "CAB-BASE", name: "Base Cabinet", description: "Lower cabinet" },
      { sku: "CAB-TOP", name: "Top Cabinet", description: "Upper cabinet" },
      {
        sku: "CAB-SHELF",
        name: "Wooden Shelf (HDHMR)",
        description: "Open shelf",
      },
    ];

    for (const cabinet of cabinetTypes) {
      await prisma.product.upsert({
        where: { sku: cabinet.sku },
        update: {},
        create: {
          sku: cabinet.sku,
          name: cabinet.name,
          description: cabinet.description,
          categoryId: cabinetCategory.id,
          unit: "piece",
          basePrice: 0, // Not used for cabinets
          taxRate: 18,
          isActive: true,
          images: [],
        },
      });
    }
    console.log("✅ Sample cabinet types created");
  }

  // Add sample accessories
  const accessoryCategory = await prisma.category.findUnique({
    where: { slug: "accessories" },
  });

  if (accessoryCategory) {
    const accessories = [
      {
        sku: "ACC-001",
        name: "PVC Cutlery Haf (Hafele)",
        size: "900mm",
        price: 2500,
      },
      {
        sku: "ACC-002",
        name: "Matrix Box Premium Rectangle",
        size: '8"',
        price: 1800,
      },
      {
        sku: "ACC-003",
        name: "Matrix Box Premium (Hafele)",
        size: '4"',
        price: 1200,
      },
      {
        sku: "ACC-004",
        name: "Glass Pullout (Evershine)",
        size: "200mm",
        price: 5500,
      },
      {
        sku: "ACC-005",
        name: "Glass Pantry 12 basket (Evershine)",
        size: "450mm",
        price: 18500,
      },
      { sku: "ACC-006", name: "GTPT (K Intl)", size: "900mm", price: 3500 },
      {
        sku: "ACC-007",
        name: "Detergent Holder (K Intl)",
        size: "Standard",
        price: 800,
      },
      {
        sku: "ACC-008",
        name: "Bin Holder (K Intl)",
        size: "Standard",
        price: 1200,
      },
    ];

    for (const acc of accessories) {
      await prisma.product.upsert({
        where: { sku: acc.sku },
        update: {},
        create: {
          sku: acc.sku,
          name: acc.name,
          description: `Size: ${acc.size}`,
          categoryId: accessoryCategory.id,
          unit: "piece",
          basePrice: acc.price,
          taxRate: 18,
          isActive: true,
          images: [],
        },
      });
    }
    console.log("✅ Sample accessories created");
  }

  // Add sample hardware
  const hardwareCategory = await prisma.category.findUnique({
    where: { slug: "hardware" },
  });

  if (hardwareCategory) {
    const hardware = [
      {
        sku: "HW-001",
        name: "Aluminium Profile (Evershine)",
        description: "Standard profile",
        price: 150,
      },
      {
        sku: "HW-002",
        name: "Cabinet Handle",
        description: "Stainless steel handle",
        price: 250,
      },
      {
        sku: "HW-003",
        name: "Soft Close Hinge",
        description: "Premium soft close",
        price: 180,
      },
      {
        sku: "HW-004",
        name: "Drawer Channel",
        description: "Telescopic channel",
        price: 350,
      },
    ];

    for (const hw of hardware) {
      await prisma.product.upsert({
        where: { sku: hw.sku },
        update: {},
        create: {
          sku: hw.sku,
          name: hw.name,
          description: hw.description,
          categoryId: hardwareCategory.id,
          unit: "piece",
          basePrice: hw.price,
          taxRate: 18,
          isActive: true,
          images: [],
        },
      });
    }
    console.log("✅ Sample hardware created");
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
