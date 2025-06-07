import React from "react";
import DeliriumSvgIcon from "../svgs/DeliriumSvgIcon";
import SolarMagniferOutline from "../svgs/SolarMagniferOutline";
import SolarCartLarge2Outline from "../svgs/SolarCartLarge2Outline";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Link from "next/link";
import SolarBagHeartOutline from "../svgs/SolarBagHeartOutline";

export default function Header() {
  return (
    <header className="px-2 md:px-5 xl:px-10 py-3 flex items-center justify-between">
      <h2 className="hidden md:block text-sm text-muted-foreground">
        Free shipping and 30 days return
      </h2>
      <div className="flex items-center gap-1.5">
        <DeliriumSvgIcon className="w-7 h-auto" />
        <h1 className="text-xl font-semibold text-[#353535] dark:text-white">Delirium</h1>
      </div>
      <div className="flex h-5 items-center space-x-2 md:space-x-3 text-sm">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full cursor-pointer"
        >
          <SolarMagniferOutline />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full cursor-pointer"
        >
          <SolarCartLarge2Outline />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full cursor-pointer"
        >
          <SolarBagHeartOutline />
        </Button>
        <Separator orientation="vertical" />
        <Link href="/signin">Sign in</Link>
      </div>
    </header>
  );
}
