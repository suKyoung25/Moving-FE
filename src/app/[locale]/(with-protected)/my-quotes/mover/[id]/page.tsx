import { Suspense } from "react";
import { notFound } from "next/navigation";
import SentQuoteDetail from "@/components/domain/my-quotes/SentQuoteDetail";

export default async function Page({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;

   if (!id) return notFound();

   return <SentQuoteDetail id={id} />;
}
