import visionCard1 from '@/assets/images/visionCard1.png';
import visionCard2 from '@/assets/images/visionCard2.png';
import visionCard3 from '@/assets/images/visionCard3.png';

const imageMap = [visionCard1, visionCard2, visionCard3];

type VisionCardData = {
    title: string;
    description: string;
};

type VisionCardProps = {
    vision: VisionCardData;
    index: number;
};

export default function VisionCard({ vision, index, }: VisionCardProps) {
    const image = imageMap[index];

    return (
        <div
            style={{
                backgroundImage: `url(${image.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            className={`aspect-[72/100] rounded-4xl mr-7 relative overflow-hidden`}
        >
            <div className='absolute z-10 left-0 top-0 w-full h-full bg-black/30'>
                <div className='absolute z-20 py-10 px-8 text-white'>
                    <p
                        className="text-22-semibold md:text-28-bold mb-2"
                        dangerouslySetInnerHTML={{ __html: vision.title }}
                    />
                    <span
                        className="text-16-regular md:text-18-regular"
                        dangerouslySetInnerHTML={{ __html: vision.description }}
                    />
                </div>
            </div>
        </div>
    );
}
