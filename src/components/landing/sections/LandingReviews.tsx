import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css";
import SectionTitle from "../common/SectionTitle";
import ReviewCard from "../common/ReviewCard";
import { useRef } from "react";
import CarouselArrowButton from "../common/CarouselArrowButton";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1152 },
        items: 3,
        slidesToSlide: 3,
    },
    tablet: {
        breakpoint: { max: 1152, min: 700 },
        items: 2,
        slidesToSlide: 2,
    },
    mobile: {
        breakpoint: { max: 700, min: 0 },
        items: 1,
        slidesToSlide: 1
    }
}

const reviewsData = [
    {
        service: "소형이사",
        name: "엄태성",
        desc: "예약을 했지만 2주전이라서 비가 장마비가 을거라고는 상상도 못했는데  장마비가 오네요. 그억수같은 비를 다 맞으시고 불평 한마디 없이 오직 냉장고를 꼭 3층으로 안전하게 올리겠다는 신념이 보였습니다. 꼭 이분과 이사나 운송에 대해 논 하고 싶습니다. 평생 고생하셨습니다 "
    },
    {
        service: "대형이사",
        name: "김시온",
        desc: "예약을 했지만 2주전이라서 비가 장마비가 을거라고는 상상도 못했는데  장마비가 오네요. 아니 진짜 이게 말이 안 됩니다. 왜 항상 저는 이사하는 날에 이렇게 비가 많이 오는지... 그억수같은 비를 다 맞으시고 불평 한마디 없이 오직 냉장고를 꼭 3층으로 안전하게 올리겠다는 신념이 보였습니다. 꼭 이분과 이사나 운송에 대해 논 하고 싶습니다. 평생 고생하셨습니다 "
    },
    {
        service: "가정이사",
        name: "홍준호",
        desc: "엄청 만족스럽습니다 침대 메트릭스 안전하게 옮겨주시고 프레임 조립까지.. 돈 좀 더 쓰더라도 기사님 쓰고싶네요^^"
    },
    {
        service: "소형이사(반포장)",
        name: "안상우",
        desc: "금액도 다른 분들보다 많이 안 받으시고 일은 너무 잘 하시는 것 같아요 너무 감동입니다."
    },
    {
        service: "가정이사",
        name: "오진식",
        desc: "정말 너무×1000 잘해주십니다. 제가 짐이 생각보다 많았고 비도 정말 많이 내렸는데 차분하고 꼼꼼하게 잘해주세요ㅠㅠ죄송하고 감사했습니다!!!!! 금액도 다른 분들보다 많이 안받으시는데 일은 더 잘하시는 것 같아요 고민하지 마시고 오정우 파트너님으로 선택하세요!!"
    },
]

type CarouselRefType = {
    next: () => void;
    previous: () => void;
    goToSlide: (index: number) => void;
};

export default function LandingReviews() {
    const carouselRef = useRef<CarouselRefType | null>(null);

    const handleNext = () => {
        carouselRef.current?.next();
    };

    const handlePrev = () => {
        carouselRef.current?.previous();
    };

    return (
        <div className="bg-gray-600">
            <div
                className="
                    relative pt-16 pb-20 px-8
                    md:pt-28 md:pb-40 lg:px-0 
                    mx-auto max-w-6xl 
                "
            >
                <SectionTitle title="무빙 이용자들의 진짜 리뷰" />

                <CarouselArrowButton onClick={handlePrev} direction="left" />
                <CarouselArrowButton onClick={handleNext} direction="right" />

                <Carousel
                    ref={(ref) => { carouselRef.current = ref as CarouselRefType | null; }}
                    responsive={responsive}
                    arrows={false}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={5000}
                    transitionDuration={2000}
                    itemClass="px-3.5 h-inherit"
                    containerClass="-mx-3.5"
                >
                    {reviewsData.map((review, index) => (
                        <ReviewCard key={index} {...review} />
                    ))}
                </Carousel>
            </div>
        </div>
    );
}
