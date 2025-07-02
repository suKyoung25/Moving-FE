import { DotProps } from "react-multi-carousel";

const CustomDot = ({ onClick, active }: DotProps) => (
    <div className='py-12'>
        <button
            onClick={onClick}
            className={`
                w-2 h-2 rounded-full mx-1 transition-all duration-500 ease-in-out
                md:w-3 md:h-3 md:mx-2
                 ${active ? 'bg-primary-blue-300 !w-12' : 'bg-gray-300'}
            `}
        />
    </div>
);

export default CustomDot;
