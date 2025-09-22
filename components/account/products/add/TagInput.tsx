import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TagInputProps } from "@/types";
import { X } from "lucide-react";
import { useState } from "react";
export default function TagInput({
  tags,
  onChange,
  placeholder,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const addTag = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onChange([...tags, trimmedValue]);
    }
    setInputValue("");
  };
  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeTag(index)}
            />
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}
