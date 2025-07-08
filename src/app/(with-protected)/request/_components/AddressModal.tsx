// TODO: 추후 사용 or 삭제

// import { loadPostcodeScript } from "@/lib/utils/address.util";
// import { useEffect, useRef } from "react";
// import closeIcon from "@/assets/images/xIcon.svg";
// import Image from "next/image";

// export default function AddressModal({
//   type,
//   onComplete,
//   onClose,
// }: {
//   type: string | null;
//   onComplete: (addr: string) => void;
//   onClose: () => void;
// }) {
//   const elementRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     loadPostcodeScript().then(() => {
//       const postcode = new window.daum!.Postcode({
//         oncomplete: function (data) {
//           const fullAddress = data.address;
//           onComplete(fullAddress);
//           onClose();
//         },
//         width: "100%",
//         height: "100%",
//       });

//       postcode.embed(elementRef.current!);
//     });
//   }, []);

//   return (
//     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
//       <div className="relative w-full max-w-md h-[520px] bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-8">
//         <div className="flex justify-between mb-4 lg:mb-6">
//           <h2 className="text-lg font-bold lg:text-2xl">
//             {type === "from"
//               ? "출발지를 선택해주세요"
//               : "도착지를 선택해주세요"}
//           </h2>
//           <button onClick={onClose}>
//             <Image
//               src={closeIcon}
//               alt="모달 닫기"
//               className="w-6 aspect-square lg:w-8"
//             />
//           </button>
//         </div>
//         <div
//           ref={elementRef}
//           className="w-full h-[400px] rounded border overflow-hidden"
//         />
//       </div>
//     </div>
//   );
// }
