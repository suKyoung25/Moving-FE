import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BannerCard from "../common/BannerCard";
import CustomDot from "../common/CusdomDot";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
  desktop:           { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet:            { breakpoint: { max: 1024, min: 464 },  items: 1 },
  mobile:            { breakpoint: { max: 464,  min: 0 },    items: 1 },
};

const bannerItems = [
  { imagePc: 'banner1', imageMobile : "banner1_mobile", title: '어디든지,<br>정돈되고 깔끔하게' },
  { imagePc: 'banner2', imageMobile : "banner2_mobile", title: '믿고 맡길 수 있는 기사님<br/>어떻게 찾아야 할까?' },
  { imagePc: 'banner3', imageMobile : "banner3_mobile", title: '예약한 짐, 운송도<br/>간편하고 빠르게' },
  { imagePc: 'banner4', imageMobile : "banner4_mobile", title: '이사, 준비하는 순간부터<br/>새로운 시작이 되도록' },
];

export default function LandingBanner() {
  return (
    <Carousel
      responsive={responsive}
      arrows={false}
      showDots={true}
      infinite={true}
      draggable={false}
      autoPlay={true}           
      autoPlaySpeed={5000}
      transitionDuration={1000}
      pauseOnHover={false}
      customDot={<CustomDot />}
    >
      {
        bannerItems.map((bannerItem, index) =>
          <BannerCard key={index} imagePc={bannerItem.imagePc} imageMobile={bannerItem.imageMobile} title={bannerItem.title} />
        )
      }
    </Carousel>
  )
}