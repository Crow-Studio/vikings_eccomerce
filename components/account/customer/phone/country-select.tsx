import { Check, ChevronsUpDown, Phone } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import PhoneFlag from "./phone-flags";
type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
};
export default function CountrySelect({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const filteredOptions = options.filter((option) => option.value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="border-input bg-background text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 hover:bg-accent hover:text-foreground has-aria-invalid:border-destructive/60 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 relative inline-flex items-center justify-between self-stretch rounded-r-none border py-2 ps-3 pe-2 transition-[color,box-shadow] outline-none focus-within:z-10 focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50"
          disabled={disabled}
        >
          <div className="inline-flex items-center gap-1">
            {value ? (
              <PhoneFlag country={value} countryName={value} />
            ) : (
              <Phone />
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    if (option.value) {
                      onChange(option.value);
                    }
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {option.value && (
                      <PhoneFlag
                        country={option.value}
                        countryName={option.value}
                      />
                    )}
                    <span>{option.label}</span>
                    {option.value && (
                      <span className="text-muted-foreground text-sm">
                        +{RPNInput.getCountryCallingCode(option.value)}
                      </span>
                    )}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
