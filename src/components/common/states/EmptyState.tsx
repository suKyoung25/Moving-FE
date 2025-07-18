import Image from "next/image";
import emptyBlueFolderIcon from "@/assets/images/emptyBlueFolderIcon.svg";
export default function EmptyState({ message }: { message: string }) {
   return (
      <div className="flex flex-col items-center gap-6 lg:gap-8">
         <Image
            src={emptyBlueFolderIcon}
            alt="empty"
            width={110}
            height={82}
            className="lg:h-34 lg:w-46"
         />
         <p className="text-14-regular lg:text-20-regular text-gray-400">
            {message}
         </p>
      </div>
   );
}
