'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createEstimate, updateEstimate } from '@/lib/actions/estimates'
import { calculateCabinetArea, formatCurrency } from '@/lib/services/pricing-service'

interface Customer {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  basePrice: any
  taxRate: any
  category: {
    id: string
    name: string
    slug: string
  }
}

interface EstimateItem {
  id: string // temporary ID for UI
  productId?: string
  description: string
  itemType: 'CABINET' | 'SHUTTER' | 'ACCESSORY' | 'HARDWARE'
  
  // For cabinets
  height?: number
  width?: number
  depth?: number
  
  // For shutters/endpanels
  area?: number
  
  // For accessories/hardware
  quantity: number
  unitPrice: number
  
  taxRate: number
  lineTotal: number
}

interface ExistingEstimate {
  id: string
  customerId: string
  title: string
  description: string | null
  shutterMaterialId: string | null
  discountPercent: any
  notes: string | null
  items: Array<{
    productId: string | null
    description: string
    quantity: any
    unitPrice: any
    taxRate: any
    height?: any
    width?: any
    depth?: any
    area?: any
  }>
}

interface EstimateFormProps {
  customers: Customer[]
  products: Product[]
  shutterMaterials: Product[]
  mode?: 'create' | 'edit'
  estimate?: ExistingEstimate
}

export function EstimateForm({ 
  customers, 
  products, 
  shutterMaterials,
  mode = 'create',
  estimate 
}: EstimateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Basic Info
  const [customerId, setCustomerId] = useState(estimate?.customerId || "");
  const [title, setTitle] = useState(estimate?.title || "");
  const [description, setDescription] = useState(estimate?.description || "");
  const [shutterMaterialId, setShutterMaterialId] = useState(
    estimate?.shutterMaterialId || ""
  );
  const [shutterRate, setShutterRate] = useState(0);

  // Step 2: Items
  const [items, setItems] = useState<EstimateItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Step 3: Discounts
  const [discountPercent, setDiscountPercent] = useState(
    estimate ? Number(estimate.discountPercent) : 0
  );
  const [notes, setNotes] = useState(estimate?.notes || "");

  // Add item form state
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Item form fields
  const [itemDescription, setItemDescription] = useState("");
  const [itemHeight, setItemHeight] = useState("");
  const [itemWidth, setItemWidth] = useState("");
  const [itemDepth, setItemDepth] = useState("");
  const [itemArea, setItemArea] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");

  // Load existing items in edit mode
  useEffect(() => {
    if (mode === "edit" && estimate) {
      // Set shutter rate
      if (estimate.shutterMaterialId) {
        const shutter = shutterMaterials.find(
          (s) => s.id === estimate.shutterMaterialId
        );
        if (shutter) {
          setShutterRate(Number(shutter.basePrice));
        }
      }

      // Convert existing items to UI format
      const loadedItems: EstimateItem[] = estimate.items.map((item, index) => {
        const product =
          products.find((p) => p.id === item.productId) ||
          shutterMaterials.find((p) => p.id === item.productId);

        let itemType: EstimateItem["itemType"] = "ACCESSORY";
        if (product) {
          const slug = product.category.slug;
          if (slug === "cabinets") itemType = "CABINET";
          else if (slug === "shutters") itemType = "SHUTTER";
          else if (slug === "accessories") itemType = "ACCESSORY";
          else itemType = "HARDWARE";
        }

        return {
          id: `existing-${index}`,
          productId: item.productId || undefined,
          description: item.description,
          itemType,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          taxRate: Number(item.taxRate),
          lineTotal: Number(item.quantity) * Number(item.unitPrice),
          height: item.height ? Number(item.height) : undefined,
          width: item.width ? Number(item.width) : undefined,
          depth: item.depth ? Number(item.depth) : undefined,
          area: item.area ? Number(item.area) : undefined,
        };
      });

      setItems(loadedItems);
    }
  }, [mode, estimate, products, shutterMaterials]);

  // Handle shutter material selection
  function handleShutterChange(productId: string) {
    setShutterMaterialId(productId);
    const shutter = shutterMaterials.find((p) => p.id === productId);
    if (shutter) {
      setShutterRate(Number(shutter.basePrice));
    }
  }

  // Handle product selection
  function handleProductSelect(productId: string) {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
    if (product) {
      setItemDescription(product.name);
    }
  }

  // Calculate item total based on type
  function calculateItemTotal(): number {
    if (!selectedProduct) return 0;

    const categorySlug = selectedProduct.category.slug;

    if (categorySlug === "cabinets") {
      if (!itemHeight || !itemWidth || !itemDepth || !shutterRate) return 0;
      const area = calculateCabinetArea(
        Number(itemHeight),
        Number(itemWidth),
        Number(itemDepth)
      );
      return area * shutterRate;
    } else if (categorySlug === "shutters") {
      if (!itemArea || !shutterRate) return 0;
      return Number(itemArea) * shutterRate;
    } else {
      if (!itemQuantity || !selectedProduct.basePrice) return 0;
      return Number(itemQuantity) * Number(selectedProduct.basePrice);
    }
  }

  // Add item to list
  function handleAddItem() {
    if (!selectedProduct) {
      alert("Please select a product");
      return;
    }

    const categorySlug = selectedProduct.category.slug;
    let itemType: EstimateItem["itemType"];

    if (categorySlug === "cabinets") itemType = "CABINET";
    else if (categorySlug === "shutters") itemType = "SHUTTER";
    else if (categorySlug === "accessories") itemType = "ACCESSORY";
    else itemType = "HARDWARE";

    const lineTotal = calculateItemTotal();
    const taxRate = Number(selectedProduct.taxRate);

    const newItem: EstimateItem = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      description: itemDescription,
      itemType,
      quantity: Number(itemQuantity),
      unitPrice: lineTotal / Number(itemQuantity),
      taxRate,
      lineTotal,
    };

    if (itemType === "CABINET") {
      newItem.height = Number(itemHeight);
      newItem.width = Number(itemWidth);
      newItem.depth = Number(itemDepth);
    } else if (itemType === "SHUTTER") {
      newItem.area = Number(itemArea);
    }

    setItems([...items, newItem]);

    // Reset form
    setShowAddItem(false);
    setSelectedProduct(null);
    setSelectedCategory("");
    setItemDescription("");
    setItemHeight("");
    setItemWidth("");
    setItemDepth("");
    setItemArea("");
    setItemQuantity("1");
  }

  // Remove item
  function handleRemoveItem(id: string) {
    setItems(items.filter((item) => item.id !== id));
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = items.reduce((sum, item) => {
    const itemSubtotal = item.lineTotal / (1 + item.taxRate / 100);
    const discountRatio = subtotalAfterDiscount / subtotal;
    return sum + (itemSubtotal * discountRatio * item.taxRate) / 100;
  }, 0);
  const total = subtotalAfterDiscount + taxAmount;

  // Submit form
  async function handleSubmit() {
    if (!customerId || !title || !shutterMaterialId) {
      setError("Please fill in all required fields");
      return;
    }

    if (items.length === 0) {
      setError("Please add at least one item");
      return;
    }

    setLoading(true);
    setError("");

    const estimateData = {
      customerId,
      title,
      description,
      discountPercent,
      discountAmount: 0,
      notes,
      termsAndConditions: "",
      items: items.map((item) => ({
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        unit: "piece",
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
      })),
    };

    const result =
      mode === "create"
        ? await createEstimate(estimateData as any)
        : await updateEstimate(estimate!.id, estimateData as any);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      if (mode === "edit") {
        router.push(`/estimates/${estimate!.id}`);
      } else {
        router.push("/estimates");
      }
      router.refresh();
    }
  }

  const categories = Array.from(new Set(products.map((p) => p.category.slug)))
    .map((slug) => products.find((p) => p.category.slug === slug)?.category)
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer *</Label>
              <select
                id="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                required
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Estimate Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Kitchen Renovation - Villa Project"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Project details..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shutterMaterial">Shutter Material *</Label>
              <select
                id="shutterMaterial"
                value={shutterMaterialId}
                onChange={(e) => handleShutterChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                required
              >
                <option value="">Select shutter material</option>
                {shutterMaterials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name} -{" "}
                    {formatCurrency(Number(material.basePrice))}/sqft
                  </option>
                ))}
              </select>
              {shutterRate > 0 && (
                <p className="text-sm text-gray-600">
                  Selected rate: {formatCurrency(shutterRate)}/sqft
                </p>
              )}
            </div>

            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!customerId || !title || !shutterMaterialId}
            >
              Next: Add Items
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Add Items */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Step 2: Add Items</CardTitle>
                <Button onClick={() => setShowAddItem(true)}>+ Add Item</Button>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No items added yet
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-600">
                          {item.itemType === "CABINET" &&
                            item.height &&
                            item.width &&
                            item.depth &&
                            `${item.height}×${item.width}×${item.depth}mm`}
                          {item.itemType === "SHUTTER" &&
                            item.area &&
                            `${item.area} sqft`}
                          {(item.itemType === "ACCESSORY" ||
                            item.itemType === "HARDWARE") &&
                            `Qty: ${item.quantity}`}
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-medium">
                          {formatCurrency(item.lineTotal)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Tax: {item.taxRate}%
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Item Modal */}
          {showAddItem && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedProduct(null);
                    }}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat!.id} value={cat!.slug}>
                        {cat!.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory && (
                  <div className="space-y-2">
                    <Label>Product *</Label>
                    <select
                      value={selectedProduct?.id || ""}
                      onChange={(e) => handleProductSelect(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="">Select product</option>
                      {products
                        .filter((p) => p.category.slug === selectedCategory)
                        .map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {selectedProduct && (
                  <>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        placeholder="Item description"
                      />
                    </div>

                    {/* Cabinet Fields */}
                    {selectedProduct.category.slug === "cabinets" && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Height (mm) *</Label>
                          <Input
                            type="number"
                            value={itemHeight}
                            onChange={(e) => setItemHeight(e.target.value)}
                            placeholder="2020"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Width (mm) *</Label>
                          <Input
                            type="number"
                            value={itemWidth}
                            onChange={(e) => setItemWidth(e.target.value)}
                            placeholder="600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Depth (mm) *</Label>
                          <Input
                            type="number"
                            value={itemDepth}
                            onChange={(e) => setItemDepth(e.target.value)}
                            placeholder="560"
                          />
                        </div>
                      </div>
                    )}

                    {/* Shutter Fields */}
                    {selectedProduct.category.slug === "shutters" && (
                      <div className="space-y-2">
                        <Label>Area (sqft) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={itemArea}
                          onChange={(e) => setItemArea(e.target.value)}
                          placeholder="81"
                        />
                      </div>
                    )}

                    {/* Accessory/Hardware Fields */}
                    {(selectedProduct.category.slug === "accessories" ||
                      selectedProduct.category.slug === "hardware") && (
                      <div className="space-y-2">
                        <Label>Quantity *</Label>
                        <Input
                          type="number"
                          value={itemQuantity}
                          onChange={(e) => setItemQuantity(e.target.value)}
                          placeholder="1"
                        />
                        <p className="text-sm text-gray-600">
                          Unit Price:{" "}
                          {formatCurrency(Number(selectedProduct.basePrice))}
                        </p>
                      </div>
                    )}

                    <div className="p-3 bg-blue-50 rounded">
                      <p className="text-sm font-medium">
                        Estimated Total: {formatCurrency(calculateItemTotal())}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleAddItem}>Add Item</Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddItem(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={items.length === 0}
            >
              Next: Review & Submit
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Review & Submit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Customer</p>
                  <p className="font-medium">
                    {customers.find((c) => c.id === customerId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Shutter Material</p>
                  <p className="font-medium">
                    {
                      shutterMaterials.find((s) => s.id === shutterMaterialId)
                        ?.name
                    }
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Title</p>
                <p className="font-medium">{title}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm mb-2">
                  Items ({items.length})
                </p>
                <div className="space-y-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.description}</span>
                      <span>{formatCurrency(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="space-y-2">
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>

                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Internal Notes</Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  placeholder="Any internal notes..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading
                  ? mode === "edit"
                    ? "Updating..."
                    : "Creating..."
                  : mode === "edit"
                  ? "Update Estimate"
                  : "Create Estimate"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}