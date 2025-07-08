"use client";

import Pending from "@/components/my-quotes/pages/Pending";
import Received from "@/components/my-quotes/pages/Received";
import { useMyQuotes } from "@/lib/hooks/useMyQuotes";

export default function MyQuotes() {
  const { activeTab } = useMyQuotes();

  if (activeTab === "pending") {
    return <Pending />;
  } else if (activeTab === "received") {
    return <Received />;
  }

  return null;
}
