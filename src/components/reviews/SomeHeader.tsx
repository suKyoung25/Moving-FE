import React, { Suspense } from "react";
import ReviewTabs from "./ReviewTabs";

export default function SomeHeader() {
  return (
    <Suspense fallback={null}>
      <ReviewTabs />
    </Suspense>
  );
}
