"use client";

import { usePathname } from "next/navigation";
import React from "react";
import MyQuotesMenu from "../my-quotes/common/MyQuotesMenu";

const PathBased = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/my-quotes")) {
    return <MyQuotesMenu />;
  }

  return null;
};

export default PathBased;
