"use client";

import SolidButton from "@/components/common/buttons/SolidButton";
import InputField from "@/components/profile/InputField";
import React from "react";

type FormData = {
  image: string;
  alias: string;
  career: number;
  onelineIntoduction: string;
  detailDescription: string;
  serviceType: string;
  area: string;
};

function MoverProfilePage() {
  return (
    <>
      <div className="flex flex-col gap-8 mb-12">
        <div className="text-32-semibold leading-8">기사님 프로필 등록</div>

        <div className="text-20-regular leading-8 text-black-200">
          추가 정보를 입력하여 회원가입을 완료해주세요
        </div>
      </div>

      <hr className="m-0 p-0 border-t-[1px] border-line-100" />

      <div className="flex w-full gap-18 mt-12">
        <div className="flex flex-col flex-1">
          <InputField
            isImage="selected"
            text="프로필 이미지"
            height="h-[64px]"
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            text="별명"
            placeholder="사이트에 노출될 이름을 입력해주세요"
            height="h-16"
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            text="경력"
            placeholder="기사님의 경력을 입력해주세요"
            height="h-[64px]"
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            text="한 줄 소개"
            placeholder="한 줄 소개를 입력해주세요"
            height="h-[64px]"
          />
        </div>

        <div className="flex-1">
          <InputField
            text="상세 설명"
            isTextArea="selected"
            placeholder="상세 내용을 입력해주세요"
            height="h-[160px]"
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField text="제공 서비스" isServiceType="selected" />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField text="서비스 가능 지역" isArea="selected" />

          <div className="mt-17">
            <SolidButton
              children="시작하기"
              disabled={false}
              // onClick={handleSubmitProfile}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default MoverProfilePage;
