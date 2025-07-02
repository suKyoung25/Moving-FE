import { ReactNode } from "react";

interface InfoStatCardProps {
    icon: ReactNode;
    title: string;
    value: string;
}
export default function InfoStatCard({ icon, title, value }: InfoStatCardProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-20 h-20">
                {icon}
            </div>
            <div>
                <h3 className="text-14-semibold text-primary-blue-300">{title}</h3>
                <div className="text-32-bold md:text-4xl ">{value}명</div>
            </div>
        </div>
    )
}