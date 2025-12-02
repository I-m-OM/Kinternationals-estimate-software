-- AlterTable
ALTER TABLE "estimate_items" ADD COLUMN     "area" DECIMAL(10,2),
ADD COLUMN     "depth" DECIMAL(10,2),
ADD COLUMN     "height" DECIMAL(10,2),
ADD COLUMN     "itemType" TEXT NOT NULL DEFAULT 'PRODUCT',
ADD COLUMN     "shutterMaterialId" TEXT,
ADD COLUMN     "width" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "estimates" ADD COLUMN     "shutterMaterialId" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "pricingType" TEXT NOT NULL DEFAULT 'UNIT';

-- AddForeignKey
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_shutterMaterialId_fkey" FOREIGN KEY ("shutterMaterialId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimate_items" ADD CONSTRAINT "estimate_items_shutterMaterialId_fkey" FOREIGN KEY ("shutterMaterialId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
