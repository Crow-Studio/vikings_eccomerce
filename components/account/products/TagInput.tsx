import { useState } from "react"

export default function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[]
  onChange: (val: string[]) => void
  placeholder?: string
}) {
  const [input, setInput] = useState("")

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInput("")
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="flex flex-wrap gap-1 border rounded p-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1"
        >
          {tag}
          <button type="button" onClick={() => removeTag(tag)}>
            ✕
          </button>
        </span>
      ))}
      <input
        className="flex-1 p-1 outline-none text-sm"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
