import React from "react";
import CloseIcon from "@/assets/images/xIcon.svg";
import Image from "next/image";
import { formatDateDiff } from "@/lib/utils";

interface NotificationType {
   id: string;
   content: string;
   isRead: boolean;
   createdAt: string;
   type: string;
}

const NotificationMocks: NotificationType[] = [
   {
      id: "noti1",
      content: "김코드 기사님의 소형이사 견적이 도착했어요.",
      isRead: false,
      createdAt: "2025-07-16T09:30:34.378Z",
      type: "NEW_ESTIMATE",
   },
   {
      id: "noti2",
      content: "김코드 기사님의 견적이 확정되었어요.",
      isRead: false,
      createdAt: "2025-07-15T11:30:34.378Z",
      type: "ESTIMATE_CONFIRMED",
   },
   {
      id: "noti3",
      content: "내일은 경기(일산) → 서울(영등포) 이사 예정일이에요.",
      isRead: false,
      createdAt: "2025-07-14T11:30:34.378Z",
      type: "MOVING_DAY",
   },
   {
      id: "noti4",
      content: "내일은 경기(일산) → 서울(영등포) 이사 예정일이에요.",
      isRead: false,
      createdAt: "2025-07-14T11:30:34.378Z",
      type: "MOVING_DAY",
   },
   {
      id: "noti4",
      content: "내일은 경기(일산) → 서울(영등포) 이사 예정일이에요.",
      isRead: false,
      createdAt: "2025-07-14T11:30:34.378Z",
      type: "MOVING_DAY",
   },
];

export default function NotificationModal({
   setIsNotificationModalOepn,
}: {
   setIsNotificationModalOepn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
   return (
      <div className="border-line-200 absolute top-10 -left-6 flex max-h-80 w-78 -translate-x-1/2 flex-col rounded-3xl border bg-white px-4 py-2.5 md:-left-8 lg:top-12 lg:-left-4 lg:max-h-88 lg:w-100">
         <div className="flex items-center justify-between py-3.5 pr-3 pl-4 lg:pl-6">
            <span className="font-bold lg:text-lg">알림</span>
            <button
               type="button"
               onClick={() => setIsNotificationModalOepn(false)}
            >
               <Image src={CloseIcon} alt="알림 닫기" className="h-6 w-6" />
            </button>
         </div>
         <ul className="h-full overflow-auto">
            {NotificationMocks.map((item, idx) => (
               <li
                  key={idx}
                  className={`border-b-line-200 space-y-1 px-4 py-3 font-medium max-lg:text-xs lg:px-6 lg:py-4 ${idx === NotificationMocks.length - 1 ? "" : "border-b-1"}`}
               >
                  <div className="line-clamp-2">{item.content}</div>
                  <div className="text-gray-300 lg:text-sm">
                     {formatDateDiff(item.createdAt)}
                  </div>
               </li>
            ))}
         </ul>
      </div>
   );
}
