import Lottie from "lottie-react";
import animationData from "@/components/animations/paper-plane.json";

export default function PaperPlane({ active }: { active: boolean }) {
   return (
      <Lottie
         animationData={animationData}
         loop={true} // 무한반복
         autoplay={active} // 자동재생
         style={{ width: 50, height: 48 }}
         className="flex"
      />
   );
}
