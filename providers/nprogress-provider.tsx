"use client";

import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect, useRef } from "react";

NProgress.configure({
  showSpinner: false,
  speed: 500,
  minimum: 0.3,
  trickleSpeed: 200,
});

export default function NprogressProvider() {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    if (pathnameRef.current !== pathname) {
      NProgress.start();

      const timer = setTimeout(() => {
        NProgress.done();
      }, 1000);

      const completeProgress = () => {
        clearTimeout(timer);
        NProgress.done();
      };

      completeProgress();

      pathnameRef.current = pathname;
    }

    return () => {
      NProgress.done();
    };
  }, [pathname]);

  useEffect(() => {
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (...args) => {
      NProgress.start();
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      NProgress.start();
      return originalReplace.apply(router, args);
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router]);

  return null;
}
