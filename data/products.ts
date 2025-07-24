import type { Product } from "@/types/products"

export const mockProducts: Product[] = [
  {
    id: "4B0KfwuGXBDy",
    name: "Black Diamond Stone Half-Finger Leather Gloves",
    price: "4500.00",
    description:
      "A half-finger leather glove for dexterity-crucial climbing activities such as belaying, aid climbing and jugging.\n" +
      "\n" +
      "- Goat leather\n" +
      "- Reinforced leather palm and knuckle patches with Kevlar stitching\n" +
      "- Hook-and-loop cuff closure",
    visibility: "active",
    category_id: "fO0YxZPd-3np",
    has_variants: true,
    created_at: "2025-07-20T10:51:22.931Z",
    updated_at: "2025-07-20T10:51:22.863Z",
    category: {
      id: "fO0YxZPd-3np",
      name: "Safety & Security",
      created_at: "2025-07-20T09:17:42.660Z",
    },
    images: [
      {
        id: "nx16a315N7Ns",
        product_id: "4B0KfwuGXBDy",
        url: "https://res.cloudinary.com/dfa1yoc1v/image/upload/v1753008685/tesbnyggdtvvfqvlui6x.jpg",
        created_at: "2025-07-20T10:51:26.353Z",
        updated_at: "2025-07-20T10:51:26.283Z",
      },
      {
        id: "img-2",
        product_id: "4B0KfwuGXBDy",
        url: "/placeholder.svg?height=600&width=600",
        created_at: "2025-07-20T10:51:26.353Z",
        updated_at: "2025-07-20T10:51:26.283Z",
      },
      {
        id: "img-3",
        product_id: "4B0KfwuGXBDy",
        url: "/placeholder.svg?height=600&width=600",
        created_at: "2025-07-20T10:51:26.353Z",
        updated_at: "2025-07-20T10:51:26.283Z",
      },
    ],
    variants: [
      {
        id: "CU5HrpJzBILv",
        product_id: "4B0KfwuGXBDy",
        title: "Size",
        generatedVariants: [
          { id: "size-s", variant_id: "CU5HrpJzBILv", name: "Small", value: "S" },
          { id: "size-m", variant_id: "CU5HrpJzBILv", name: "Medium", value: "M" },
          { id: "size-l", variant_id: "CU5HrpJzBILv", name: "Large", value: "L" },
        ],
      },
      {
        id: "color-variant",
        product_id: "4B0KfwuGXBDy",
        title: "Color",
        generatedVariants: [
          { id: "color-black", variant_id: "color-variant", name: "Black", value: "#000000" },
          { id: "color-tan", variant_id: "color-variant", name: "Tan", value: "#D2B48C" },
        ],
      },
      {
        id: "material-variant",
        product_id: "4B0KfwuGXBDy",
        title: "Material",
        generatedVariants: [
          { id: "material-leather", variant_id: "material-variant", name: "Leather", value: "Leather" },
          { id: "material-synthetic", variant_id: "material-variant", name: "Synthetic", value: "Synthetic" },
        ],
      },
    ],
  },
  {
    id: "another-product-id",
    name: "Safety Harness Pro",
    price: "12000.00",
    description: "Professional grade safety harness for industrial use.",
    visibility: "active",
    category_id: "fO0YxZPd-3np", // Same category for related products
    has_variants: false,
    created_at: "2025-07-20T11:00:00.000Z",
    updated_at: "2025-07-20T11:00:00.000Z",
    category: {
      id: "fO0YxZPd-3np",
      name: "Safety & Security",
      created_at: "2025-07-20T09:17:42.660Z",
    },
    images: [
      {
        id: "img-2",
        product_id: "another-product-id",
        url: "/placeholder.svg?height=200&width=200",
        created_at: "2025-07-20T11:00:00.000Z",
        updated_at: "2025-07-20T11:00:00.000Z",
      },
    ],
    variants: [],
  },
  {
    id: "third-product-id",
    name: "Hiking Backpack 50L",
    price: "7500.00",
    description: "Durable and spacious backpack for multi-day hikes.",
    visibility: "active",
    category_id: "new-category-id",
    has_variants: true,
    created_at: "2025-07-20T11:05:00.000Z",
    updated_at: "2025-07-20T11:05:00.000Z",
    category: {
      id: "new-category-id",
      name: "Outdoor Gear",
      created_at: "2025-07-20T11:04:00.000Z",
    },
    images: [
      {
        id: "img-3",
        product_id: "third-product-id",
        url: "/placeholder.svg?height=200&width=200",
        created_at: "2025-07-20T11:05:00.000Z",
        updated_at: "2025-07-20T11:05:00.000Z",
      },
    ],
    variants: [
      {
        id: "backpack-color",
        product_id: "third-product-id",
        title: "Color",
        generatedVariants: [
          { id: "bp-color-blue", variant_id: "backpack-color", name: "Blue", value: "#0000FF" },
          { id: "bp-color-green", variant_id: "backpack-color", name: "Green", value: "#008000" },
        ],
      },
    ],
  },
  {
    id: "fourth-product-id",
    name: "First Aid Kit - Compact",
    price: "3000.00",
    description: "Essential first aid supplies for emergencies.",
    visibility: "active",
    category_id: "fO0YxZPd-3np",
    has_variants: false,
    created_at: "2025-07-20T11:10:00.000Z",
    updated_at: "2025-07-20T11:10:00.000Z",
    category: {
      id: "fO0YxZPd-3np",
      name: "Safety & Security",
      created_at: "2025-07-20T09:17:42.660Z",
    },
    images: [
      {
        id: "img-4",
        product_id: "fourth-product-id",
        url: "/placeholder.svg?height=200&width=200",
        created_at: "2025-07-20T11:10:00.000Z",
        updated_at: "2025-07-20T11:10:00.000Z",
      },
    ],
    variants: [],
  },
]
