import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type ArrowButtonProps = {
  onClick: () => void;
  direction: "left" | "right";
};

export default function CarouselArrowButton({ onClick, direction }: ArrowButtonProps) {
  const isLeft = direction === "left";
  return (
    <button
      onClick={onClick}
      className={`
        hidden lg:flex justify-center items-center
        absolute top-1/2 -translate-y-1/2 z-10
        w-12 h-12 rounded-full bg-white border-1 border-gray-400
        [&_*]:text-primary-blue-300 [&_*]:w-5 [&_*]:h-5
        ${isLeft ? "-left-28" : "-right-28"}
      `}
    >
      {isLeft ? <FaChevronLeft /> : <FaChevronRight />}
    </button>
  );
}
