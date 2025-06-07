import React, { useId } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export default function Filters() {
  const id = useId();
  const categories = [
    "Body & Bath Essential",
    "Perfumes & Body Fragrances",
    "Skin Care",
    "Jewelry",
    "Sunglasses",
    "Pouch",
    "Lipcare",
    "Bags",
    "Hair Accessories",
    "Travel Kits",
    "Key Holders",
    "Belts",
    "Hats",
    "Coats",
  ];

  return (
    <div className="space-y-3">
      <h4 className="font-semibold">Categories</h4>
      <div className="grid gap-3">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center gap-2">
            <Checkbox id={`${id}-${index}`} />
            <Label htmlFor={`${id}-${index}`}>{category}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
