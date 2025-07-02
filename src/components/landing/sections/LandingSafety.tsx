import { LiaShippingFastSolid } from "react-icons/lia";
import { VscFeedback } from "react-icons/vsc";
import InfoStatCard from "../common/InfoStatCard";
import BenefitCard from "../common/BenefitCard";

export default function LandingSafety() {
    return (
        <div className="max-w-6xl mx-auto px-8 pt-16 pb-20 lg:px-0 lg:py-40">
            <div className="md:flex md:items-center md:justify-around md:gap-7 lg:justify-between lg:gap-32">
                <div className="flex flex-col items-center md:items-start">
                    <h2 className="text-24-semibold text-center mb-4 md:text-5xl md:font-bold md:leading-14 md:text-start md:whitespace-nowrap">무빙과 함께라면<br />안심할 수 있습니다</h2>
                    <span className="text-12-regular mb-10 text-gray-400 md:mb-4">2025년 {new Date().getMonth() + 1}월 기준</span>
                    <div className="flex flex-col gap-2.5 md:gap-5">
                        <InfoStatCard
                            icon={<LiaShippingFastSolid className="w-3/4 h-3/4" />}
                            title="누적 기사님 수"
                            value="2,459"
                        />
                        <InfoStatCard
                            icon={<VscFeedback className="w-3/4 h-3/4" />}
                            title="서비스 이용 만족도"
                            value="4.8점"
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-2.5 md:gap-7 lg:flex-row lg:gap-7">
                    <BenefitCard
                        boxColor='bg-[#f2f3ff]'
                        image="https://www.zimssa.com/assets/images/img_safe_reservation.svg"
                        title="안심+"
                        desc="
                            기사님 예약 확정 시, 자동 적용되는 안심+를
                            통해 이사 현장에서 발생하는 다양한 사고/분쟁에 대한
                            보상을 받으실 수 있습니다.
                        "
                    />
                    <BenefitCard
                        boxColor='bg-[#fbf8dd]'
                        image="https://www.zimssa.com/assets/images/img_partner_policy.svg"
                        title="파트너 정책"
                        desc="
                        기사님들의 철저한 리뷰관리로
                        더욱 더 믿고 맡길 수 있도록 항상 고객을 위해 최선을
                        다하는 파트너가 될 수 있도록 노력하겠습니다.
                    "
                    />
                </div>
            </div>
        </div>
    )
}