"use client";

import Pending from "@/components/my-quotes/pages/Pending";
import Received from "@/components/my-quotes/pages/Received";
import { useMyQuotes } from "@/context/MyQuotesContext";

export default function Page() {
  const { activeTab } = useMyQuotes();

  if (activeTab === "pending") {
    return <Pending />;
  } else if (activeTab === "received") {
    return <Received />;
  }

  return null;
}
