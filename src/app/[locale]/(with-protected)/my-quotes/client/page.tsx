<<<<<<< HEAD
export default function Page() {
   return (
      <>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
         <h1>동해물과 백두산이</h1>
      </>
   );
=======
import Pending from "@/components/domain/my-quotes/Pending";
import Received from "@/components/domain/my-quotes/Received";

type PageProps = {
   searchParams: Promise<{ tab?: string }>;
};

// 내 견적 관리
export default async function Page({ searchParams }: PageProps) {
   const { tab } = await searchParams;
   const activeTab = tab === "2" ? "2" : "1";

   if (activeTab === "1") {
      return <Pending />;
   } else if (activeTab === "2") {
      return <Received />;
   }
>>>>>>> 81d22fa89286e4d8d7a6d771417cad7f7e78c781
}
