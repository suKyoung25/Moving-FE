"use client";

import { createMoverProfile } from "@/actions/profile/createMoverProfile";
import SolidButton from "@/components/common/buttons/SolidButton";
import InputField from "@/components/profile/InputField";
import React, { useActionState } from "react";

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
  const [state, formAction, isPending] = useActionState(
    createMoverProfile,
    null
  );

  return (
    <>
      <div className="flex flex-col gap-4 lg:gap-8 mb-6 lg:mb-12">
        <div className="text-18-semibold leading-8 lg:text-32-semibold ">
          기사님 프로필 등록
        </div>

        <div className="lg:text-20-regular text-12-regular leading-8 text-black-200">
          추가 정보를 입력하여 회원가입을 완료해주세요
        </div>
      </div>

      <hr className="m-0 p-0 border-t-[1px] border-line-100" />

      <form
        action={formAction}
        className="flex flex-col w-full lg:gap-18 mt-6 lg:mt-12 md:flex-row lg:flex-row"
      >
        <div className="flex flex-col flex-1">
          <InputField isImage="selected" text="프로필 이미지" />

          <hr className="hidden lg:block m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <div className="mt-8">
            <InputField
              name="alias"
              text="별명"
              placeholder="사이트에 노출될 이름을 입력해주세요"
              height="h-13 mg:h-13 lg:h-16"
            />
          </div>

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            name="career"
            text="경력"
            placeholder="기사님의 경력을 입력해주세요"
            height="h-13 mg:h-13 lg:h-16"
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            name="onelineIntroduction"
            text="한 줄 소개"
            placeholder="한 줄 소개를 입력해주세요"
            height="h-13 mg:h-13 lg:h-16"
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8 lg:hidden" />
        </div>

        <div className="flex-1">
          <InputField
            name="detailDescription"
            text="상세 설명"
            isTextArea="selected"
            placeholder="상세 내용을 입력해주세요"
            height="h-[160px]"
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            name="serviceType"
            text="제공 서비스"
            isServiceType="selected"
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField name="area" text="서비스 가능 지역" isArea="selected" />

          <div className="mt-17">
            <SolidButton
              children={isPending ? "등록 중..." : "시작하기"}
              disabled={isPending}
              type="submit"
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default MoverProfilePage;
