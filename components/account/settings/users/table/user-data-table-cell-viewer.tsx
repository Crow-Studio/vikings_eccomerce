import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/database/schema";

interface UserDataTableCellViewerProps {
  item: User;
}
export default function UserDataTableCellViewer({
  item,
}: UserDataTableCellViewerProps) {
  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="siez-5 rounded-md bg-muted">
        <AvatarImage src={item.avatar!} alt={item.username} />
        <AvatarFallback>
          {item.username.split(" ")[0].charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {item.username}
    </div>
  );
}
