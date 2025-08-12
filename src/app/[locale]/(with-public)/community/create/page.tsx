import CommunityButton from "@/components/domain/community/CommunityButton";

export default function page() {
   const placeholderText = `첫 번째 줄입니다
두 번째 줄입니다
세 번째 줄입니다`;
   return (
      <div>
         <form>
            <CommunityButton address="" text="등록" />
            <div className="flex flex-col">
               <input
                  type="text"
                  placeholder="제목을 입력해주세요."
                  className="border-b border-gray-100 py-5"
               />
               <textarea
                  placeholder={placeholderText}
                  className="h-90 resize-none py-5"
               />
            </div>
         </form>
      </div>
   );
}
