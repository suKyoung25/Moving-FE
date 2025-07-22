import Pending from "@/components/domain/my-quotes/pages/Pending";
import Received from "@/components/domain/my-quotes/pages/Received";

// 내 견적 관리
export default async function Page({
   searchParams,
}: {
   searchParams: { [key: string]: string | string[] | undefined };
}) {
   const params = await searchParams;
   const path = params.path;

   if (path === "pending") {
      return <Pending />;
   } else if (path === "received") {
      return <Received />;
   }

   return null;
}
