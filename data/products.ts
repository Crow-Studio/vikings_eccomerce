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

export const mockProducts: Product[] = [
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
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
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
    name: "Cordless Angle Grinder Tool 18V00",
    price: 12000,
    originalPrice: 14500,
    isNew: false,
    inStock: true,
    rating: 4.5,
    reviews: 85,
    sku: "VKG-GRN-002",
    category: "Power Tools",
    images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    ],
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
     images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    ],
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
  {
    id: "5",
    name: "Circular Saw 1600W",
    price: 8900,
    originalPrice: 10500,
    isNew: false,
    inStock: true,
    rating: 4.6,
    reviews: 78,
    sku: "VKG-SAW-005",
    category: "Power Tools",
     images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    ],
    features: [
      "1600W high-performance motor",
      "185mm carbide-tipped blade included",
      "Depth adjustment for versatile cuts",
      "Dust extraction port for clean work"
    ],
    specifications: {
      Power: "1600W",
      "Blade Diameter": "185mm",
      "Max Cutting Depth": "65mm",
      "No-load Speed": "5500 rpm",
      Weight: "3.8 kg"
    }
  },
  {
    id: "6",
    name: "Air Compressor 50L Tank",
    price: 18500,
    originalPrice: 21000,
    isNew: true,
    inStock: true,
    rating: 4.7,
    reviews: 92,
    sku: "VKG-CMP-006",
    category: "Pneumatic Tools",
     images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    ],
    features: [
      "50L steel tank for extended use",
      "Oil-free pump for low maintenance",
      "Pressure regulator with gauge",
      "Quick-connect air fittings"
    ],
    specifications: {
      "Tank Capacity": "50L",
      "Max Pressure": "8 bar",
      "Air Delivery": "250L/min",
      "Motor Power": "2.5HP",
      Weight: "35 kg"
    }
  },
  {
    id: "7",
    name: "Orbital Sander 300W",
    price: 4500,
    originalPrice: 5200,
    isNew: false,
    inStock: true,
    rating: 4.4,
    reviews: 156,
    sku: "VKG-SND-007",
    category: "Power Tools",
     images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    ],
    features: [
      "300W motor for smooth operation",
      "Orbital sanding action for fine finish",
      "Dust collection system included",
      "Comfortable grip with vibration control"
    ],
    specifications: {
      Power: "300W",
      "Pad Size": "115x230mm",
      "Orbit Diameter": "2.5mm",
      "Vibration Level": "3.5 m/s²",
      Weight: "1.8 kg"
    }
  },
  {
    id: "8",
    name: "Rotary Hammer 850W",
    price: 11200,
    originalPrice: 13500,
    isNew: true,
    inStock: true,
    rating: 4.8,
    reviews: 103,
    sku: "VKG-HAM-008",
    category: "Power Tools",
     images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    ],
    features: [
      "850W motor with SDS-plus chuck",
      "3-in-1 functionality: drill, hammer, chisel",
      "Anti-vibration system for comfort",
      "Depth stop for precise drilling"
    ],
    specifications: {
      Power: "850W",
      "Impact Energy": "3.2J",
      "Drilling Capacity": "26mm in concrete",
      "Impact Rate": "4000 bpm",
      Weight: "3.2 kg"
    }
  },
  {
    id: "9",
    name: "Pneumatic Nail Gun",
    price: 6800,
    originalPrice: 7900,
    isNew: false,
    inStock: true,
    rating: 4.5,
    reviews: 87,
    sku: "VKG-NAL-009",
    category: "Pneumatic Tools",
    images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    ],
    features: [
      "Accepts 15-50mm nails",
      "Sequential and contact firing modes",
      "Adjustable depth control",
      "Lightweight aluminum body"
    ],
    specifications: {
      "Nail Length": "15-50mm",
      "Air Pressure": "5-8 bar",
      "Magazine Capacity": "100 nails",
      "Air Consumption": "0.5L per shot",
      Weight: "1.9 kg"
    }
  },
  {
    id: "10",
    name: "Bench Grinder 375W",
    price: 5400,
    originalPrice: 6200,
    isNew: false,
    inStock: true,
    rating: 4.3,
    reviews: 134,
    sku: "VKG-BNG-010",
    category: "Workshop Equipment",
     images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    ],
    features: [
      "375W motor with dual grinding wheels",
      "Adjustable tool rests and eye shields",
      "Cast iron base for stability",
      "Spark guards for safety"
    ],
    specifications: {
      Power: "375W",
      "Wheel Size": "150mm",
      "No-load Speed": "2950 rpm",
      "Wheel Thickness": "20mm",
      Weight: "12 kg"
    }
  },
  {
    id: "11",
    name: "Hydraulic Floor Jack 3T",
    price: 8200,
    originalPrice: 9500,
    isNew: true,
    inStock: true,
    rating: 4.9,
    reviews: 76,
    sku: "VKG-JAK-011",
    category: "Automotive Tools",
     images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    ],
    features: [
      "3-ton lifting capacity",
      "Hydraulic system for smooth operation",
      "Safety bypass system",
      "Swivel casters for easy positioning"
    ],
    specifications: {
      "Lifting Capacity": "3 tons",
      "Min Height": "85mm",
      "Max Height": "385mm",
      "Lifting Range": "300mm",
      Weight: "28 kg"
    }
  },
  {
    id: "12",
    name: "Digital Multimeter ",
    price: 3200,
    originalPrice: 3800,
    isNew: false,
    inStock: true,
    rating: 4.6,
    reviews: 198,
    sku: "VKG-DMM-012",
    category: "Electrical Tools",
    images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    ],
    features: [
      "Auto-ranging for easy measurements",
      "True RMS for accurate AC readings",
      "Data hold and backlight functions",
      "Safety rated CAT III 600V"
    ],
    specifications: {
      "DC Voltage": "600V",
      "AC Voltage": "600V",
      "DC Current": "10A",
      "AC Current": "10A",
      "Display": "6000 counts"
    }
  }
];