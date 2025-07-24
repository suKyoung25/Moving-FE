import { Mover } from "@/lib/types";
import MoverProfile from "./MoverProfile";

export default function MainMoverCard({ mover }: { mover: Mover }) {
   return (
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:p-5">
         <div className="mb-3 flex gap-2 lg:mb-2">
            {mover.serviceType &&
               mover.serviceType.map((type: string) => (
                  <span
                     key={type}
                     className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 lg:px-3 lg:py-1 lg:text-sm"
                  >
                     {type}
                  </span>
               ))}
         </div>

         <p className="mb-3 text-sm font-semibold text-gray-700 lg:text-base xl:text-lg">
            고객님의 물품을 안전하게 운송해 드립니다.
         </p>

         <MoverProfile {...mover} />
      </div>
   );
}
