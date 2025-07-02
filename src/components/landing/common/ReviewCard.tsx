import { FaStar } from "react-icons/fa";

export default function ReviewCard({ ...review }) {
    const { service, name, desc } = review;
    return (
        <div
            className="
                py-10 px-8 h-full
                rounded-4xl bg-white
            "
        >
            <div
                className="flex gap-1 mb-4 "
            >
                {Array(5)
                    .fill(0)
                    .map((_, i) => (
                        <FaStar key={i} className="w-4 h-4 md:w-6 md:h-6 text-primary-blue-300" />
                    ))}
            </div>
            <div className="mb-6">
                <div className="text-16-regular md:text-18-medium">
                    <span className="mr-2 text-gray-400 ">서비스</span>
                    <span>{service}</span>
                </div>
                <div className="text-16-regular md:text-18-medium">
                    <span className="mr-2 text-gray-400">파트너</span>
                    <span>{name}님</span>
                </div>
            </div>

            <div className="line-clamp-8 text-16-regular md:text-18-regular">{desc}</div>
        </div>
    )
}