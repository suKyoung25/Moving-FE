import Image from "next/image";

interface BenefitCardProps {
  boxColor: string;
  image: string;
  title: string;
  desc: string; 
}

export default function BenefitCard({ boxColor, image, title, desc }: BenefitCardProps) {
    return (
        <div className="max-w-3/4 mx-auto w-full md:max-w-11/12 lg:max-w-none">
            <div className={`${boxColor} flex justify-center items-center h-48 mb-4 rounded-3xl`}>
                <Image
                    src={image}
                    alt="BenefitImage"
                    width={152}
                    height={152}
                    className="md:w-32"
                />
            </div>
            <h3 className="text-22-semibold mb-2 md:text-24-bold">{title}</h3>
            <p
                className="text-14-regular text-justify mb-4 md:text-18-regular"
                dangerouslySetInnerHTML={{ __html: desc }}
            />
        </div>
    )
}