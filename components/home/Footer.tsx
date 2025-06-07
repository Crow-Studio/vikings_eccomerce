"use client";

import React from "react";
import DeliriumSvgIcon from "../svgs/DeliriumSvgIcon";
import SolarMailboxOutline from "../svgs/SolarMailboxOutline";
import SolarPhoneOutline from "../svgs/SolarPhoneOutline";
import ToggleTheme from "../global/ToggleTheme";

export default function Footer() {
  return (
    <div className="p-10 space-y-5">
      <div className="flex flex-col md:flex-row gap-4 items-center md:justify-between">
        <div className="flex items-center gap-1.5 self-center">
          <DeliriumSvgIcon className="w-9 h-auto" />
          <h1 className="text-2xl font-semibold text-[#353535]">Delirium</h1>
        </div>
        <div className="grid gap-1 md:self-start text-center md:text-start">
          <h4 className="text-lg text-semibold"> Contact Info </h4>
          <div className="space-y-1 flex flex-col items-center md:items-start text-muted-foreground">
            <a
              href="tel:+254768879348"
              rel="noopener noreferrer"
              className="flex items-center gap-x-2"
            >
              <SolarPhoneOutline className="w-5 h-auto" />
              <p> +254 768879348 </p>
            </a>
            <a
              href="mailto:hello@thecodingmontana.com"
              rel="noopener noreferrer"
              className="flex items-center gap-x-2"
            >
              <SolarMailboxOutline className="w-5 h-auto" />
              <p> hello@delirium.com </p>
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 md:flex-row items-center md:justify-between">
        <p className="text-muted-foreground">
          Copyright © {new Date().getFullYear()} Delirium.
        </p>
        <div className="flex items-center gap-x-1">
          <p>All rights reserved.</p>
          <ToggleTheme />
        </div>
      </div>
    </div>
  );
}
