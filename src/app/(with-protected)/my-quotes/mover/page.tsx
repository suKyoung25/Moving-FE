import { getSentEstimates } from "@/lib/api/my-quotes/getSentEstimates";

// 내 견적 관리
export default async function Page() {
   const data = await getSentEstimates();

   console.log("Data : ", data);

   return (
      <div>
         <h1>내 견적 관리</h1>
         {data.length === 0 ? (
            <p>보낸 견적이 없습니다.</p>
         ) : (
            <p>보낸 견적이 도착했습니다.</p>
         )}
      </div>
   );
}
