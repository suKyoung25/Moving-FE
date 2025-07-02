import Link from "next/link";

export default function BannerCard({
  imagePc,
  imageMobile,
  title,
}: {
  imagePc: string;
  imageMobile: string;
  title: string;
}) {
  return (
    <>
      {/* 모바일용 */}
      <div
        className="h-[560px] relative md:hidden"
        style={{
          backgroundImage: `url(/images/banners/${imageMobile}.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div 
            className="
                w-full
                absolute left-1/2 top-1/2 -translate-1/2 z-20 
                flex flex-col items-center
            ">
          <h2
            className="mb-20 text-3xl text-center font-semibold text-white"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <Link href={"/mover-search"} className="py-4 px-6 rounded-full bg-primary-blue-300 text-18-semibold text-white">서비스 둘러보기</Link>
        </div>
      </div>

      {/* PC용 */}
      <div
        className="h-[680px] relative hidden md:block"
        style={{
          backgroundImage: `url(/images/banners/${imagePc}.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/80 z-10" />
        <div 
            className="
                max-w-6xl w-full md:px-[10%] lg:px-0
                absolute left-1/2 top-1/2 -translate-1/2 z-20  
                flex flex-col 
            ">
          <h2
            className="text-5xl font-bold mb-10 text-white leading-14"
            dangerouslySetInnerHTML={{ __html: title }}
          />
            <Link href={"/mover-search"} className="py-4 px-6 max-w-48  rounded-full bg-primary-blue-300 text-center text-20-bold text-white">서비스 둘러보기</Link>
        </div>
      </div>
    </>
  );
}
