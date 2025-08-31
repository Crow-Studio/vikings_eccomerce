import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DBProduct } from "@/types";
interface ProductDataTableCellViewerProps {
  item: DBProduct;
}
export default function ProductDataTableCellViewer({
  item,
}: ProductDataTableCellViewerProps) {
  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="siez-5 rounded-md bg-muted">
        <AvatarImage
          src={item.images[0].url}
          alt={`${item.name.toLowerCase()}_${item.images[0].id}`}
        />
        <AvatarFallback>{item.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      {item.name}
    </div>
  );
}
