"use client";

import { createMoverProfile } from "@/actions/profile/create-moverProfile.action";
import SolidButton from "@/components/common/buttons/SolidButton";
import InputField from "@/components/profile/InputField";
import { moverProfileSchema } from "@/validations";
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
    area: [] as string[],
  });

  //각 input의 error를 담을 errors 객체를 만듦
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 클라이언트 측 유효성 검사 함수
  const validateField = (
    name: keyof typeof moverProfileSchema.shape,
    value: any
  ) => {
    //name은 zod에서 key 타입이랑 비교
    const partial = { [name]: value };
    const result = moverProfileSchema.partial().safeParse(partial);
    if (!result.success) {
      return result.error.format()?.[name]?._errors?.[0] ?? "";
    }
    return "";
  };

  //각 input의 onChange props로 내려줄 함수 (모든 input 값을 가져올 수 있음)
  const handleFormChange = (
    name: keyof typeof moverProfileSchema.shape,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // form 제출 버튼 disabled 조건
  const requiredFields = [
    formData.alias,
    formData.career,
    formData.onelineIntroduction,
    formData.detailDescription,
  ];
  const areRequiredFieldsFilled = //input에 빈문자열이 있는지 확인
    requiredFields.every((field) => field.trim() !== "") &&
    formData.serviceType.length > 0 && // 배열은 별도로 체크 (제공 서비스)
    formData.area.length > 0; // 배열은 별도로 체크 (서비스 가능 지역)
  const hasFieldErrors = Object.values(errors).some((err) => err); //각 input에서 error가 있는지 확인
  const isDisabled = isPending || hasFieldErrors || !areRequiredFieldsFilled; //>>>최종적으로 버튼 활성화 여부 확인

  //디버깅
  console.log(formData);
  console.log(hasFieldErrors);

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
          <InputField isImage={true} text="프로필 이미지" />

          <hr className="hidden lg:block m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <div className="mt-8">
            <InputField
              name="alias"
              value={formData.alias}
              onChange={(val) => handleFormChange("alias", val)}
              text="별명"
              placeholder="사이트에 노출될 이름을 입력해주세요"
              height="h-13 mg:h-13 lg:h-16"
              error={errors.alias}
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
            error={errors.career}
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            name="onelineIntroduction"
            value={formData.onelineIntroduction}
            onChange={(val) => handleFormChange("onelineIntroduction", val)}
            text="한 줄 소개"
            placeholder="한 줄 소개를 입력해주세요"
            height="h-13 mg:h-13 lg:h-16"
            error={errors.onelineIntroduction}
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8 lg:hidden" />
        </div>

        <div className="flex-1">
          <InputField
            name="detailDescription"
            value={formData.detailDescription}
            onChange={(val) => handleFormChange("detailDescription", val)}
            text="상세 설명"
            isTextArea={true}
            placeholder="상세 내용을 입력해주세요"
            height="h-[160px]"
            error={errors.detailDescription}
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            name="serviceType"
            value={formData.serviceType}
            onChange={(val) => handleFormChange("serviceType", val as string[])}
            text="제공 서비스"
            isServiceType={true}
            error={errors.serviceType}
          />

          <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

          <InputField
            name="area"
            value={formData.area}
            onChange={(val) => handleFormChange("area", val as string[])}
            text="서비스 가능 지역"
            isArea={true}
            error={errors.area}
          />

          <div className="mt-17">
            <SolidButton disabled={isDisabled} type="submit">
              {isPending ? "등록 중..." : "시작하기"}
            </SolidButton>
          </div>
        </div>
      </form>
    </>
  );
}

export default MoverProfilePage;
