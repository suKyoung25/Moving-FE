import Image from 'next/image';
import Search from '@/assets/images/searchIcon.svg'

export default function SearchBar() {
  return (
    <div className="w-full">
      <div className="flex items-center w-full px-4 py-3 rounded-[12px] bg-bg-200 text-gray-400">
        <Image src={Search} alt="기사님 프로필" className="w-4 h-4 mr-2 " />
        <input
          type="text"
          placeholder="텍스트를 입력해 주세요."
          className="w-full bg-transparent text-14-regular placeholder-gray-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
