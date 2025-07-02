import 'animate.css';
import Link from "next/link";

export default function LandingCreateStoreOnboarding() {
    return (
        <div className="bg-gray-600">
            <div className="pt-16 pb-20 md:py-28 px-8 flex flex-col items-center justify-center gap-4 md:gap-7">
                <h2 className="text-24-semibold text-center md:text-5xl md:font-bold">새로운 시작의 첫 걸음,<br className="md:hidden" /> 무빙과 함께</h2>
                <Link href="/mover-search" className='px-5 py-2 bg-primary-blue-300 text-white rounded-xs text-14-semibold md:text-18-bold md:px-8 md:py-3'>
                    <span
                        className='animate__animated animate__bounce inline-block'
                        style={{
                            animationIterationCount: 'infinite',
                            animationDuration: '2s',
                        }}
                    >
                        서비스 둘러보기
                    </span>
                </Link>
                <span className='text-13-medium md:text-16-semibold'>이미 계정이 있나요? <Link href={"/login"} className='text-primary-blue-300'>로그인</Link></span>
            </div>
        </div>
    )
}