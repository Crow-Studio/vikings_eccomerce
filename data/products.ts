interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  isNew: boolean;
  inStock: boolean;
  rating: number;
  reviews: number;
  sku: string;
  category: string;
  images: string[];
  features: string[];
  specifications: { [key: string]: string };
}

export  const mockProducts: Product[] = [
  {
    id: "1",
    name: "Heavy Duty Impact Drill 1000W",
    price: 7500,
    originalPrice: 9000,
    isNew: true,
    inStock: true,
    rating: 4.8,
    reviews: 120,
    sku: "VKG-DRL-001",
    category: "Power Tools",
    images: [
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
    features: [
      "Powerful 1000W motor for tough jobs",
      "Variable speed control for precision",
      "Ergonomic design for comfortable use",
      "Durable construction for long lifespan",
    ],
    specifications: {
      Power: "1000W",
      "No-load Speed": "0-3000 rpm",
      "Impact Rate": "0-48000 bpm",
      "Chuck Size": "13mm",
      Weight: "2.5 kg",
    },
  },
  {
    id: "2",
    name: "Cordless Angle Grinder 18V",
    price: 12000,
    originalPrice: 14500,
    isNew: false,
    inStock: true,
    rating: 4.5,
    reviews: 85,
    sku: "VKG-GRN-002",
    category: "Power Tools",
    images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
    features: [
      "18V Li-ion battery for cordless operation",
      "Compact and lightweight design",
      "Spindle lock for quick disc changes",
      "Safety guard for user protection",
    ],
    specifications: {
      Voltage: "18V",
      "Disc Diameter": "115mm",
      "No-load Speed": "8500 rpm",
      Weight: "2.0 kg",
    },
  },
  {
    id: "3",
    name: "Professional Welding Machine 200A",
    price: 25000,
    originalPrice: 28000,
    isNew: true,
    inStock: true,
    rating: 4.9,
    reviews: 60,
    sku: "VKG-WLD-003",
    category: "Welding Equipment",
    images: ["/placeholder.svg?height=200&width=200"],
    features: [
      "200A output for heavy-duty welding",
      "IGBT inverter technology for stable arc",
      "Overload protection for safety",
      "Portable design with carry handle",
    ],
    specifications: {
      "Output Current": "20-200A",
      "Input Voltage": "220V",
      "Duty Cycle": "60%",
      Weight: "8 kg",
    },
  },
  {
    id: "4",
    name: "Electric Chainsaw 2200W",
    price: 9800,
    originalPrice: 11000,
    isNew: false,
    inStock: true,
    rating: 4.7,
    reviews: 95,
    sku: "VKG-CHN-004",
    category: "Garden Tools",
    images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
    features: [
      "Powerful 2200W motor",
      "Automatic chain lubrication",
      "Tool-free chain tensioning",
      "Safety brake for immediate stop",
    ],
    specifications: {
      Power: "2200W",
      "Bar Length": "40cm",
      "Chain Speed": "13.5 m/s",
      Weight: "4.5 kg",
    },
  },
]
