import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Order } from "@/types/orders";

interface CustomerDataTableCellViewerProps {
  item: Order;
}
export default function CustomerDataTableCellViewer({
  item,
}: CustomerDataTableCellViewerProps) {
  const customer = item.customer;

  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="siez-5 rounded-md bg-muted">
        <AvatarImage src={customer.avatar!} alt={customer.full_name} />
        <AvatarFallback>
          {customer.full_name.split(" ")[0].charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {customer.full_name}
    </div>
  );
}
