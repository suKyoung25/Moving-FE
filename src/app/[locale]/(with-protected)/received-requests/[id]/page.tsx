import ReceivedRequestDetail from "@/components/domain/received-requests/ReceivedRequestDetail";
import { notFound } from "next/navigation";

export default async function ReceivedRequestDetailPage({
   params,
}: {
   params: Promise<{ id: string; locale: string }>;
}) {
   const { id, locale } = await params;

   if (!id) return notFound();

   return <ReceivedRequestDetail id={id} locale={locale} />;
}
