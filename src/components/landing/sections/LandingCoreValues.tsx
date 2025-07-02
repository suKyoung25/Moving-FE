import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css";
import VisionCard from "../common/VisionCard";
import SectionTitle from "../common/SectionTitle";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1152 },
        items: 3,
        partialVisibilityGutter: 10
    },
    tablet: {
        breakpoint: { max: 1152, min: 700 },
        items: 2,
        partialVisibilityGutter: 30
    },
    mobile: {
        breakpoint: { max: 700, min: 0 },
        items: 1,
        partialVisibilityGutter: 50
    }
}

const visionCardList = [
    { title: "시장을<br/>합리적으로", description: "이사 시장에 남아있는<br/>불합리성과 정보 불균형을<br/>개선합니다." },
    { title: "누구나 쉽게<br/>정보를 얻을 수 있도록", description: "모든 이들이 가치 있는<br/>정보를 가지고 의사를<br/>결정할 수 있도록 돕습니다." },
    { title: "사용자 경험을<br/>최우선으로", description: "고객, 파트너 모두에게<br/>이용하기 편한 서비스가<br/>될 수 있도록 노력합니다." },
]

export default function LandingCoreValues() {
    return (
        <div
            className="
                pt-16 pb-20 px-8
                md:pt-28 md:pb-40 lg:px-0 
                mx-auto max-w-6xl
            "
        >
            <SectionTitle title="이사 시장을 바꿔갑니다"/>
            <Carousel
                partialVisible={true}
                responsive={responsive}
                arrows={false}
                autoPlay={true}  
                autoPlaySpeed={3000}            
                infinite={true}
            >
                {
                    visionCardList.map((vision, index) =>
                        <VisionCard
                            key={index}
                            vision={vision}
                            index={index}
                        />
                    )
                }
            </Carousel>
        </div>
    )
}