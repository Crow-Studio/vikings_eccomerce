import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { User } from "@/database/schema";
import { deleteUserAction } from "@/app/account/settings/action";

interface Props {
  user: User;
}

export default function DataTableActions({ user }: Props) {
  const { onOpen } = useModal();
  const router = useRouter();
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const userIds: string[] = [];

  const onDeleteUser = async () => {
    userIds.push(user.id);

    toast.promise(
      (async () => {
        setIsDeletingUser(true);
        const { message, errorMessage } = await deleteUserAction(userIds);
        if (errorMessage) throw new Error(errorMessage);
        return message;
      })(),
      {
        loading: "Deleting user...",
        success: "User deleted successfully!",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to delete user",
        finally() {
          setIsDeletingUser(false);
          router.refresh();
        },
        position: "top-center",
      }
    );
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
          disabled={isDeletingUser}
        >
          <Edit />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDeleteUser()}
          disabled={isDeletingUser}
          className="cursor-pointer"
        >
          <Trash />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
