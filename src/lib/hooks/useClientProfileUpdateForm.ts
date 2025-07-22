// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { signUpFormSchema } from "../schemas";

// export default function useClientProfileUpdateForm() {
//    // ✅ 상태 모음
//    const router = useRouter();
//    const { getUser } = useAuth();
//    const [selectedServices, setSelectedServices] = useState<string[]>([]);
//    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
//    const [isLoading, setIsLoading] = useState(false);

//    // ✅ 이용 서비스 선택
//    const handleServiceToggle = (service: string) => {
//       setSelectedServices((prev) => {
//          const isSelected = prev.includes(service);

//          return isSelected
//             ? prev.filter((s) => s !== service)
//             : [...prev, service];
//       });
//    };

//    // ✅ 내가 사는 지역 선택
//    const handleRegionToggle = (region: string) => {
//       setSelectedRegions((prev) => {
//          const isSelected = prev.includes(region);

//          return isSelected
//             ? prev.filter((r) => r !== region)
//             : [...prev, region];
//       });
//    };

//    // ✅ react-hook-form
//    const {
//       register,
//       handleSubmit,
//       setError,
//       formState: { errors, isValid },
//    } = useForm({
//       mode: "onChange",
//       resolver: zodResolver(signUpFormSchema),
//    });

//    // ✅ 버튼 활성화 여부: 나중에 이미지 조건도 넣어야 함

//    // ✅ 보낼 자료

//    // ✅ api 호출하고 프로필 생성 성공하면 mover-search로 이동: 이미지 부분 수정해야 함

//    return {
//       register,
//       errors,
//       isValid,
//       isLoading,
//       selectedServices,
//       selectedRegions,
//       handleServiceToggle,
//       handleRegionToggle,
//    };
// }
