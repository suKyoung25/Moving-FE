"use client";

import { usePathname } from "next/navigation";

export default function Header({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const isRequestPage =
    pathname.startsWith("/request") ||
    pathname.startsWith("/reviews") ||
    pathname.startsWith("/favorite-movers") ||
    pathname.startsWith("/received-requests") ||
    pathname === "/my-quotes";

  const headerClass =
    "sticky top-0 left-0 z-50 bg-white border-b border-line-100";

  const commonContainerClass =
    "flex items-center max-w-[1400px] mx-auto px-6 md:px-16 lg:px-0";

  const containerClass = `
    ${commonContainerClass}
    ${isRequestPage ? "min-h-14 lg:min-h-22" : "h-14 lg:h-22"}
  `;

  return (
    <header className={headerClass}>
      <div className={containerClass}>
        {isRequestPage ? (
          <div className="flex flex-col w-full">
            <div>성경님 헤더</div>
            {children}
          </div>
        ) : (
          <div>성경님 헤더</div>
        )}
      </div>
    </header>
  );
}
