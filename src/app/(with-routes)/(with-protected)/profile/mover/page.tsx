"use client";

import { createMoverProfile } from "@/actions/profile/create-moverProfile.action";
import SolidButton from "@/components/common/buttons/SolidButton";
import InputField from "@/components/profile/InputField";
import React, { useActionState, useState } from "react";

function MoverProfilePage() {
  const [state, formAction, isPending] = useActionState(
    createMoverProfile,
    null
  );

  //모든 input의 입력값 관리
  const [formData, setFormData] = useState({
    alias: "",
    career: "",
    onelineIntroduction: "",
    detailDescription: "",
    serviceType: [] as string[],
    area: "",
  });

  const handleFormChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //json을 객체로 파싱 (각 input의 유효성 error 관련)
  const fieldErrors: Record<string, { _errors: string[] }> = state?.error
    ? JSON.parse(state.error)
    : {};

  // form 제출 버튼 disabled 조건
  const isInitial = state === null; // 폼 제출이 한 번도 안 된 상태
  const hasFieldErrors = Object.keys(fieldErrors).length > 0; //각 input에서 error가 있는지 확인
  const isDisabled = isInitial || isPending || hasFieldErrors;

  //디버깅
  console.log(formData);
  console.log(isDisabled);

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
        className="flex flex-col w-full mt-6 lg:mt-12 lg:flex-row lg:gap-18"
      >
        <div className="flex flex-col flex-1">
          <InputField isImage="selected" text="프로필 이미지" />

          <hr className="hidden lg:block m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <div className="mt-8">
            <InputField
              name="alias"
              value={formData.alias}
              onChange={(val) => handleFormChange("alias", val)}
              text="별명"
              placeholder="사이트에 노출될 이름을 입력해주세요"
              height="h-13 mg:h-13 lg:h-16"
              error={fieldErrors?.alias?._errors?.[0]}
            />
          </div>

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            name="career"
            value={formData.career}
            onChange={(val) => handleFormChange("career", val)}
            text="경력"
            placeholder="기사님의 경력을 입력해주세요"
            height="h-13 mg:h-13 lg:h-16"
            error={fieldErrors?.career?._errors?.[0]}
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            name="onelineIntroduction"
            value={formData.onelineIntroduction}
            onChange={(val) => handleFormChange("onelineIntroduction", val)}
            text="한 줄 소개"
            placeholder="한 줄 소개를 입력해주세요"
            height="h-13 mg:h-13 lg:h-16"
            error={fieldErrors?.onelineIntroduction?._errors?.[0]}
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8 lg:hidden" />
        </div>

        <div className="flex-1">
          <InputField
            name="detailDescription"
            value={formData.detailDescription}
            onChange={(val) => handleFormChange("detailDescription", val)}
            text="상세 설명"
            isTextArea="selected"
            placeholder="상세 내용을 입력해주세요"
            height="h-[160px]"
            error={fieldErrors?.detailDescription?._errors?.[0]}
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            name="serviceType"
            value={formData.serviceType}
            onChange={(val) => handleFormChange("serviceType", val as string[])}
            text="제공 서비스"
            isServiceType="selected"
            error={fieldErrors?.serviceType?._errors?.[0]}
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            name="area"
            value={formData.area}
            onChange={(val) => handleFormChange("area", val)}
            text="서비스 가능 지역"
            isArea="selected"
            error={fieldErrors?.area?._errors?.[0]}
          />

          <div className="mt-17">
            <SolidButton disabled={!isDisabled} type="submit">
              {isPending ? "등록 중..." : "시작하기"}
            </SolidButton>
          </div>
        </div>
      </form>
    </>
  );
}

export default MoverProfilePage;
