<<<<<<< HEAD
export default function Page() {
   return <>Page</>;
=======
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

   return (
      <Suspense fallback={<div>잠시만 기다려 주세요...</div>}>
         <SentQuoteDetail id={id} />
      </Suspense>
   );
>>>>>>> 559b5f421498632aef4ac725f509f42bb6a57a6f
}
