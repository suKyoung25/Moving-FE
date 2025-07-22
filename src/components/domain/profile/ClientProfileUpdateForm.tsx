// import React, { useState } from "react";
// import ProfileFieldButton from "./ProfileFieldButton";
// import ClientProfileTitle from "./ClientProfileTitle";
// import SolidButton from "../common/buttons/SolidButton";
// import { moveType, regions } from "@/constants";

// export default function ClientProfileUpdateForm() {
//      const [selectedServices, setSelectedServices] = useState<string[]>([]);
//      const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

//    return (
//       <form>
//          {/* 이용 서비스 */}
//          <section>
//             <ClientProfileTitle type="서비스" />

//             {moveType.map((service) => (
//                <ProfileFieldButton
//                   category="서비스"
//                   name="serviceType"
//                   key={service}
//                   value={service}
//                   isSelected={selectedServices.includes(service)}
//                   onClick={() => handleServiceToggle(service)}
//                >
//                   {service}
//                </ProfileFieldButton>
//             ))}
//          </section>

//          <hr className="border-line-100 mb-5 lg:mb-8" />

//          {/* 내가 사는 지역 */}
//          <section className="mb-8 lg:mb-14">
//             <ClientProfileTitle type="지역" />

//             <div className="grid w-70 grid-cols-5 gap-x-2 gap-y-3 lg:w-104 lg:gap-x-3.5 lg:gap-y-4.5">
//                {regions.map((region) => (
//                   <ProfileFieldButton
//                      category="지역"
//                      name="livingArea"
//                      key={region}
//                      value={region}
//                      isSelected={selectedRegions.includes(region)}
//                      onClick={() => handleRegionToggle(region)}
//                   >
//                      {region}
//                   </ProfileFieldButton>
//                ))}
//             </div>
//          </section>

//          {/* 제출 버튼 */}
//          <SolidButton type="submit" disabled={isDisabled}>
//             {isPending ? "로딩 중..." : "수정하기"}
//          </SolidButton>
//       </form>
//    );
// }
