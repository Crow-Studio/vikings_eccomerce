"use client";

import AddNewCategory from "@/modals/account/AddNewCategory";
import EditCustomer from "@/modals/account/customers/EditCustomer";
import NewCustomer from "@/modals/account/customers/NewCustomer";
import CreateOrder from "@/modals/account/orders/CreateOrder";
import Signout from "@/modals/Signout";
import { useEffect, useState } from "react";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <Signout />
      <AddNewCategory />
      <NewCustomer />
      <EditCustomer />
      <CreateOrder />
    </div>
  );
}
