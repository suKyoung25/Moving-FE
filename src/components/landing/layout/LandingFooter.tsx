import Link from "next/link";
import { AiOutlineYoutube, AiOutlineInstagram, AiOutlineFacebook } from "react-icons/ai";

export default function LandingFooter() {
    return (
        <footer className="bg-gray-700 text-white">
            <div className="max-w-6xl mx-auto px-8 py-16 flex flex-col gap-8 lg:px-0">
                <div>
                    <div className="flex flex-col gap-3 mb-6">
                        <Link href="/support" className="text-16-semibold text-18-bold">고객센터 바로가기 &gt;</Link>
                        <div>
                            <div className="flex gap-2">
                                <span className="text-gray-400">운영시간</span>
                                <span className="text-16-semibold">09:00~18:00</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-gray-400">점심시간</span>
                                <span className="text-16-semibold">11:50~13:00</span>
                            </div>
                        </div>
                        <span className="text-12-regular md:text-14-regular">
                            이사 견적 신청은 사이트를 통해서만 접수 가능합니다.<br />
                            서비스 기타 문의 사항은 이메일로 문의해 주시면 빠르게 답변드리겠습니다.
                        </span>
                    </div>
                    <div className="[&_*]:w-8 [&_*]:h-8 flex gap-4">
                        <button><AiOutlineYoutube /></button>
                        <button><AiOutlineInstagram /></button>
                        <button><AiOutlineFacebook /></button>
                    </div>
                </div>
                <div className="flex flex-col gap-3 text-12-regular md:text-14-regular  md:w-3/5">
                    <p className="text-justify">
                        무빙은 다양한 이사 견적을 제공하며, 다양한 문제로부터 고객 및 기사님을 보호합니다.
                        다만 거래의 직접적인 당사자가 아닌 중개 플랫폼으로, 개별 서비스에 대한 계약 체결 및
                        이로 인한 사고에 대한 책음은 파트너와 소비자에게 있습니다.
                        무빙은 고객과 기사의 분쟁이 발생할 경우, 분쟁 해결을 위해 중재 또는 조정을
                        진행할 수 있습니다. 감사합니다.
                    </p>
                    <span className="text-gray-400">Copyright Ⓒ MOVING Inc. All Rights Reserved.</span>
                </div>
            </div>
        </footer>
    )
}