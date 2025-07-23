import ShareButtons from "./ShareButton";
import LineDivider from "./LineDivider";

export default function ShareSection() {
   return (
      <div className="p-4 lg:p-5">
         <p className="mb-4 text-base font-medium text-gray-900">
            나만 알기엔 아쉬운 기사님인가요?
         </p>
         <ShareButtons />
         <div className="pt-5 lg:hidden">
            <LineDivider />
         </div>
      </div>
   );
}
