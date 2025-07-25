export default function ShareButtons() {
   const handleLinkCopy = () => {
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다!");
   };

   const handleKakaoShare = () => {
      alert("카카오톡 공유");
   };

   const handleFacebookShare = () => {
      alert("페이스북 공유");
   };

   return (
      <div className="flex gap-3">
         {/* 링크 복사 */}
         <button
            onClick={handleLinkCopy}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            title="링크 복사"
         >
            <span className="text-gray-600">🔗</span>
         </button>

         {/* 카카오톡 */}
         <button
            onClick={handleKakaoShare}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 transition-colors hover:bg-yellow-500"
            title="카카오톡 공유"
         >
            <span className="text-xs font-bold text-gray-900">K</span>
         </button>

         {/* 페이스북 */}
         <button
            onClick={handleFacebookShare}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 transition-colors hover:bg-blue-700"
            title="페이스북 공유"
         >
            <span className="text-xs font-bold text-white">f</span>
         </button>
      </div>
   );
}
