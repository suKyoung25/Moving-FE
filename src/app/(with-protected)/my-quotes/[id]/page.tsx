import Image from "next/image";
import shareLink from "@/assets/images/shareLinkIcon.svg";
import shareKakao from "@/assets/images/shareKakaoIcon.svg";
import shareFacebook from "@/assets/images/shareFaceBookIcon.svg";
import QuotaionInfo from "@/components/my-quotes/common/QuotaionInfo";
import SolidButton from "@/components/common/buttons/SolidButton";
import likeIcon from "@/assets/images/likeFilledIcon.svg";
import PageTitle from "@/components/layout/PageTitle";
import MoverProfileClient from "@/components/my-quotes/common/MoverProfileClient";

// 견적 관리 상세
export default async function Page() {
  return (
    <div>
      <PageTitle title="견적 상세" />
      <div className="flex item justify-between">
        <section className="w-full flex flex-col items gap-6 mt-2 mb-27 lg:max-w-238.5 lg:mt-6 lg:gap-10">
          <article className="bg-white border border-line-100 rounded-2xl px-3.5 py-4 lg:px-6 lg:py-5">
            <MoverProfileClient />
          </article>
          <hr className="h-px bg-line-100 border-0" />
          <article>
            <p className="text-16-semibold mb-4 lg:text-24-semibold">견적가</p>
            <p className="text-20-bold lg:text-32-bold">180,000원</p>
          </article>
          <hr className="h-px bg-line-100 border-0" />
          <article className="lg:hidden">
            <p className="text-14-semibold mb-4 md:text-16-semibold">
              견적서 공유하기
            </p>
            <div className="flex items-center gap-4">
              <Image src={shareLink} alt="링크 공유" width={40} height={40} />
              <Image
                src={shareKakao}
                alt="카카오 공유"
                width={40}
                height={40}
              />
              <Image
                src={shareFacebook}
                alt="페이스북 공유 공유"
                width={40}
                height={40}
              />
            </div>
          </article>
          <hr className="h-px bg-line-100 border-0 lg:hidden" />
          <QuotaionInfo />
        </section>
        <div
          style={{ boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.16)" }}
          className="fixed bottom-0 left-0 w-full px-6 py-2.5 flex items-center gap-2 bg-white md:px-16 lg:hidden"
        >
          <div className="w-13.5 h-13.5 flex-shrink-0 border border-line-200 rounded-2xl flex items-center justify-center cursor-pointer">
            <Image src={likeIcon} alt="좋아요 버튼" width={24} height={24} />
          </div>
          <SolidButton>견적 확정하기</SolidButton>
        </div>
        <div className="hidden lg:block w-82">
          <SolidButton>견적 확정하기</SolidButton>
          <hr className="h-px bg-line-100 border-0 my-10" />
          <article>
            <p className="text-14-semibold mb-4 md:text-16-semibold lg:text-20-semibold">
              견적서 공유하기
            </p>
            <div className="flex items-center gap-4">
              <Image src={shareLink} alt="링크 공유" width={64} height={64} />
              <Image
                src={shareKakao}
                alt="카카오 공유"
                width={64}
                height={64}
              />
              <Image
                src={shareFacebook}
                alt="페이스북 공유 공유"
                width={64}
                height={64}
              />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
