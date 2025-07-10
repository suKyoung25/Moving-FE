import Image, { StaticImageData } from "next/image";
import solidBoxIcon from "@/assets/images/solidBoxIcon.svg";
import solidHomeIcon from "@/assets/images/solidHomeIcon.svg";
import solidCompanyIcon from "@/assets/images/solidCompanyIcon.svg";
import solidDocumentIcon from "@/assets/images/solidDocumentIcon.svg";

type ChipType = "SMALL" | "HOME" | "OFFICE" | "DESIGNATED" | "PENDING" | "DONE";

const CHIP_CONFIG: Record<
  ChipType,
  { label: string; bg: string; text: string; icon?: string | StaticImageData }
> = {
  SMALL: {
    label: "소형이사",
    bg: "bg-primary-blue-100",
    text: "text-primary-blue-300",
    icon: solidBoxIcon,
  },
  HOME: {
    label: "가정이사",
    bg: "bg-primary-blue-100",
    text: "text-primary-blue-300",
    icon: solidHomeIcon,
  },
  OFFICE: {
    label: "사무실이사",
    bg: "bg-primary-blue-100",
    text: "text-primary-blue-300",
    icon: solidCompanyIcon,
  },
  DESIGNATED: {
    label: "지정 견적 요청",
    bg: "bg-secondary-red-100",
    text: "text-secondary-red-200",
    icon: solidDocumentIcon,
  },
  PENDING: {
    label: "견적 대기",
    bg: "bg-gray-100",
    text: "text-primary-blue-400",
    icon: undefined,
  },
    DONE: {
    label: "확정 견적",
    bg: "bg-gray-100",
    text: "text-primary-blue-400",
    icon: undefined,
  },
};

interface MoveChipProps {
  type: ChipType;
  mini?: boolean;
};

//.map((type) =>isChipType(type) ? <MoveChip key={type} type={type} mini={false} /> : null)
// isChipType으로 타입검증 하시고 type 프롭스 사용하시면 됩니다
// mini는 글자없는 칩사용하실 때 true로 프롭스 내려주면 사용 가능합니다
export default function MoveChip({ type, mini = false }: MoveChipProps) {
  const config = CHIP_CONFIG[type];

  return (
    <div
      className={`inline-flex items-center px-1 py-1 rounded-sm ${config.bg}`}
    >
      {config.icon && (
        <Image
          src={config.icon}
          alt={`${config.label} 아이콘`}
          className="w-5 h-5 lg:w-6 lg:h-6"
        />
      )}
      {!mini && (
        <span
          className={`${config.text} text-13-semibold lg:text-16-semibold ml-1`}
        >
          {config.label}
        </span>
      )}
    </div>
  );
}
