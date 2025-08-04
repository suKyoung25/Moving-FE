import ReceivedRequestDetail from "@/components/domain/received-requests/ReceivedRequestDetail";
import { notFound } from "next/navigation";

export default async function Page({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;

   if (!id) return notFound();

   return <ReceivedRequestDetail id={id} />;
}
