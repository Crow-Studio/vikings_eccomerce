import React from "react";
import SolarTShirtOutline from "../svgs/SolarTShirtOutline";
import { Separator } from "../ui/separator";
import StreamlinePayment10 from "../svgs/StreamlinePayment10";
import NewArrivals from "./NewArrivals";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <div className="grid rid-cols-1 md:grid-cols-2 gap-[6rem] p-5 sm:p-10">
      <div className="space-y-6 md:space-y-16">
        <h2 className="text-4xl xl:text-5xl text-balance">
          Our newest arrivals are here to help you look your best.
        </h2>
        <div className="grid gap-4 sm:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:h-10 gap-4">
            <div className="flex items-center gap-x-2">
              <SolarTShirtOutline className="self-start size-5 mt-1 font-medium flex-shrink-0" />
              <div className="self-start">
                <h3 className="uppercase font-semibold">Quality Materials</h3>
                <p className="text-muted-foreground text-sm">
                  Essentials crafted to elevate your everyday.
                </p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-full hidden sm:block" />
            <div className="flex items-center gap-x-4">
              <StreamlinePayment10 className="self-start size-5 mt-1 font-medium flex-shrink-0" />
              <div className="self-start">
                <h3 className="uppercase font-semibold">Secure Payment</h3>
                <p className="text-muted-foreground text-sm">
                  Guarantee 100% secure payment online on our website.
                </p>
              </div>
            </div>
          </div>
          <Link href="/" className="group cursor-pointer">
            <Button className="cursor-pointer">
              Browse our collection
              <div className="size-6 overflow-hidden rounded-full duration-500">
                <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                  <span className="flex size-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-right m-auto size-[14px]"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </span>
                  <span className="flex size-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-right m-auto size-[14px]"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </div>
      <NewArrivals />
    </div>
  );
}
