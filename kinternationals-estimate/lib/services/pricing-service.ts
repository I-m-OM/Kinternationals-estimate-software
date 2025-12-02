/**
 * Pricing Service
 * Handles all pricing calculations for estimates
 */

export interface EstimateItemCalculation {
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
  taxAmount: number;
}

export interface EstimateTotals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

/**
 * Calculate totals for a single estimate item
 */
export function calculateLineItem(
  quantity: number,
  unitPrice: number,
  taxRate: number
): EstimateItemCalculation {
  const subtotal = quantity * unitPrice;
  const taxAmount = (subtotal * taxRate) / 100;
  const lineTotal = subtotal + taxAmount;

  return {
    quantity,
    unitPrice,
    taxRate,
    taxAmount: Math.round(taxAmount * 100) / 100, // Round to 2 decimals
    lineTotal: Math.round(lineTotal * 100) / 100,
  };
}

/**
 * Calculate estimate totals from line items
 */
export function calculateEstimateTotals(
  items: Array<{
    quantity: number;
    unitPrice: number;
    taxRate: number;
  }>,
  discountPercent: number = 0,
  discountAmount: number = 0
): EstimateTotals {
  // Calculate subtotal from all items
  const subtotal = items.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice;
  }, 0);

  // Calculate discount (either percentage or fixed amount)
  let discount = 0;
  if (discountPercent > 0) {
    discount = (subtotal * discountPercent) / 100;
  } else if (discountAmount > 0) {
    discount = discountAmount;
  }

  // Calculate subtotal after discount
  const subtotalAfterDiscount = subtotal - discount;

  // Calculate tax on each item (after discount is proportionally applied)
  const discountRatio = subtotalAfterDiscount / subtotal;
  const taxAmount = items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const itemSubtotalAfterDiscount = itemSubtotal * discountRatio;
    const itemTax = (itemSubtotalAfterDiscount * item.taxRate) / 100;
    return sum + itemTax;
  }, 0);

  // Calculate final total
  const total = subtotalAfterDiscount + taxAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Generate next estimate number
 * Format: EST-YYYY-NNNN (e.g., EST-2025-0001)
 */
export function generateEstimateNumber(lastNumber: string | null): string {
  const year = new Date().getFullYear();
  const prefix = `EST-${year}-`;

  if (!lastNumber || !lastNumber.startsWith(prefix)) {
    return `${prefix}0001`;
  }

  // Extract number and increment
  const lastNumStr = lastNumber.split("-")[2];
  const nextNum = parseInt(lastNumStr, 10) + 1;
  return `${prefix}${nextNum.toString().padStart(4, "0")}`;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate profit margin
 */
export function calculateMargin(
  sellingPrice: number,
  costPrice: number
): number {
  if (costPrice === 0) return 0;
  return ((sellingPrice - costPrice) / sellingPrice) * 100;
}

/**
 * Calculate surface area for cabinet (all 6 faces)
 * Input: dimensions in mm
 * Output: area in sqft
 */
export function calculateCabinetArea(
  height: number,
  width: number,
  depth: number
): number {
  // Convert mm to inches (1 inch = 25.4 mm)
  const h = height / 25.4;
  const w = width / 25.4;
  const d = depth / 25.4;

  // Surface area = 2(hw + wd + hd)
  const areaInSquareInches = 2 * (h * w + w * d + h * d);

  // Convert to sqft (1 sqft = 144 sq inches)
  const areaInSqft = areaInSquareInches / 144;

  return Math.round(areaInSqft * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate price for different item types
 */
export function calculateItemPrice(
  itemType: "CABINET" | "SHUTTER" | "ACCESSORY" | "HARDWARE",
  data: {
    // For cabinets
    height?: number;
    width?: number;
    depth?: number;
    shutterRate?: number;

    // For shutters/endpanels
    area?: number;

    // For accessories/hardware
    quantity?: number;
    unitPrice?: number;
  }
): number {
  switch (itemType) {
    case "CABINET":
      if (!data.height || !data.width || !data.depth || !data.shutterRate) {
        throw new Error("Missing cabinet dimensions or shutter rate");
      }
      const area = calculateCabinetArea(data.height, data.width, data.depth);
      return area * data.shutterRate;

    case "SHUTTER":
      if (!data.area || !data.shutterRate) {
        throw new Error("Missing area or shutter rate");
      }
      return data.area * data.shutterRate;

    case "ACCESSORY":
    case "HARDWARE":
      if (!data.quantity || !data.unitPrice) {
        throw new Error("Missing quantity or unit price");
      }
      return data.quantity * data.unitPrice;

    default:
      throw new Error("Invalid item type");
  }
}
