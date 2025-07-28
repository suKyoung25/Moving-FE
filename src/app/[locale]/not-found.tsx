import Image from "next/image";
import Link from "next/link";
import earth from '@/assets/images/earthIcon.png'
import oopsMover from '@/assets/images/oopsMover.png'
import oopsTruchMover from '@/assets/images/oopsTruchMoverIcon.png'
import star from '@/assets/images/starIcon.png'
import otherLogo from '@/assets/images/otherLogo.png'

export default function NotFound() {
    return (
        <div className="fixed w-full min-h-screen h-full overflow-hidden bg-primary-blue-600 ">
            <div className="absolute left-3 top-4 md:left-10 md:top-10">
                <Image
                    src={otherLogo}
                    alt="logo"
                    width={80}
                    className="md:w-28"
                />
            </div>
            <div className="absolute top-36 -right-8 md:right-1/12 lg:right-45">
                <Image
                    src={earth}
                    alt="earth"
                    width={150}
                    height={150}
                    className="md:w-48 md:h-48 lg:w-60 lg:h-60"
                />
            </div>
            <div className="absolute -bottom-4 -left-4 md:hidden">
                <Image
                    src={oopsMover}
                    alt="mover"
                    width={180}
                />
            </div>
            <div className="hidden md:block absolute bottom-0 -left-28">
                <Image
                    src={oopsTruchMover}
                    alt="truchMover"
                    width={600}
                    className="lg:w-[750px]"
                />
            </div>
            <div>
                <Image
                    src={star}
                    alt="star"
                    width={40}
                    className="absolute top-1/4 left-1/6 md:w-13 md:top-1/6 md:left-1/5 lg:w-14 lg:left-1/3"
                />
                <Image
                    src={star}
                    alt="star"
                    width={25}
                    className="absolute top-1/3 left-3 md:w-8 md:left-25 lg:w-10 lg:top-2/6 lg:left-1/4"
                />
                <Image
                    src={star}
                    alt="star"
                    width={30}
                    className="absolute bottom-1/3 right-4 md:w-10 md:bottom-1/4 md:right-45 lg:w-11 lg:bottom-1/5 lg:right-1/4"
                />
            </div>
            <div className="flex flex-col gap-3 md:gap-4 absolute z-30 top-1/2 left-1/2 -translate-1/2 text-center text-nowrap text-white">
                <h2
                    className="text-20-semibold md:text-32-semibold lg:text-4xl lg:leading-12"
                >
                    현재 접속하신 페이지가<br />
                    존재하지 않습니다.
                </h2>
                <p className="text-13-medium md:text-16-medium">
                    서비스 이용에 불편을 드려 대단히 죄송합니다.<br />
                    현재 해당 사이트의 페이지가 존재하지 않아요.<br />
                    확인 후 다시 접속해 주세요.
                </p>
                <Link href={"/mover-search"} className="w-fit mx-auto px-4 md:px-5 py-2 md:py-2.5 mt-3 md:mt-4 rounded-sm bg-primary-blue-300 text-14-semibold md:text-16-semibold">메인으로 바로가기</Link>
            </div>
            <div className="absolute bottom-[3%] md:bottom-[4%] left-1/2 -translate-x-1/2 text-nowrap text-13-medium md:text-14-medium text-gray-200 text-center">Copyright Ⓒ MOVING Inc.<br className="md:hidden"/> All Rights Reserved.</div>
        </div>
    )
}