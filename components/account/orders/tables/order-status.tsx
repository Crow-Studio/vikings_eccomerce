import { Badge } from "@/components/ui/badge";
import { OrderStatus as IOrderStatus } from "@/database/schema";
import { Order, statusConfig } from "@/types/orders";

interface Props {
  order: Order;
}

export default function OrderStatus({ order }: Props) {
  const status = order.status as IOrderStatus;
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} flex items-center gap-1 w-fit`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
