import PageTitle from "@/components/layout/PageTitle";
import ReceivedRequestCardList from "@/components/received/ReceivedRequestCardList";

// 받은 요청
export default async function Page() {
   return (
      <div>
         <PageTitle title="받은 요청" />
         <ReceivedRequestCardList />
      </div>
   );
}
