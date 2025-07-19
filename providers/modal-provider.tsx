"use client";

import AddNewCategory from "@/modals/account/AddNewCategory";
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
    </div>
  );
}
