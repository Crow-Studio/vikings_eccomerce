import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Customer } from "@/types/customers";

interface CustomerDataTableCellViewerProps {
  item: Customer;
}
export default function CustomerDataTableCellViewer({
  item,
}: CustomerDataTableCellViewerProps) {
  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="siez-5 rounded-md bg-muted">
        <AvatarImage src={item.avatar!} alt={item.full_name} />
        <AvatarFallback>
          {item.full_name.split(" ")[0].charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {item.full_name}
    </div>
  );
}
