import BasicInfoForms from "@/components/basicInfo/BasicInfoForms";

export default function MoverBasicInfoEditPage() {
  return (
    <>
      <div className="flex flex-col gap-4 lg:gap-8 mb-6 lg:mb-12">
        <div className="text-18-semibold leading-8 lg:text-32-semibold ">
          기본정보 수정
        </div>
      </div>

      <hr className="m-0 p-0 border-t-[1px] border-line-100" />

      <div className="mt-10">
        <BasicInfoForms />
      </div>
    </>
  );
}
