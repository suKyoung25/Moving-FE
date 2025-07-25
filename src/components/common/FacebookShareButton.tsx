"use client";

import Image from "next/image";
import shareFaceBookIcon from "@/assets/images/shareFaceBookIcon.svg";

export default function FacebookShareButton() {
   const handleClick = () => {
      const shareUrl = window.location.href;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

      const width = window.innerWidth;
      const height = window.innerHeight;

      window.open(
         facebookUrl,
         "_blank",
         `width=${width},height=${height},left=0,top=0`,
      );
   };

   return (
      <div className="relative h-10 w-10 lg:h-16 lg:w-16">
         <button onClick={handleClick}>
            <Image
               src={shareFaceBookIcon}
               alt="facebookIcon"
               className="h-full w-full"
            />
         </button>
      </div>
   );
}
