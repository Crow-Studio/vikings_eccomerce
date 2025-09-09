import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { User } from "@/database/schema";

interface Props {
  user: User;
}

export default function DataTableActions({ user }: Props) {
  const { onOpen } = useModal();

  const onDeleteUser = async () => {
    onOpen('deleteUser', {
      user,
    })
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onOpen("editUser")}
          className="cursor-pointer"
        >
          <Edit />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDeleteUser()}
          className="cursor-pointer"
        >
          <Trash />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
