import FavoriteMover from "./_components/FavoriteMover";

// 내가 찜한 기사님
export default function FavoriteMoverPage() {
  return (
    <div>
      <h1 className="pb-3.5 lg:pb-8 text-18-semibold lg:text-24-semibold text-black-400 ">
        찜한 기사님
      </h1>
      <div className="pt-6">
        <FavoriteMover />
      </div>
    </div>
  );
}
