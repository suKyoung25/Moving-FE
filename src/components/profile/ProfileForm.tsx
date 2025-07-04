"use client";

import { createMoverProfile } from "@/actions/profile/create-moverProfile.action";
import SolidButton from "@/components/common/buttons/SolidButton";
import InputField from "@/components/profile/InputField";
import React, { useActionState, useState } from "react";
import {
  validateName,
  validateCareer,
  validateOnelineIntroduction,
  validateDetailDescription,
  validateServiceType,
  validateArea,
} from "@/validations";

function ProfileForm() {
  const [, formAction, isPending] = useActionState(createMoverProfile, null);

  const [fieldValidity, setFieldValidity] = useState<Record<string, boolean>>({
    name: false,
    career: false,
    onelineIntroduction: false,
    detailDescription: false,
    serviceType: false,
    area: false,
  });

  // InputField에서 호출할 함수
  const handleValidityChange = (name: string, isValid: boolean) => {
    setFieldValidity((prev) => ({
      ...prev,
      [name]: isValid,
    }));
  };

  const isDisabled =
    isPending || !Object.values(fieldValidity).every((v) => v === true);

  return (
    <form
      action={formAction}
      className="flex flex-col w-full mt-6 lg:mt-12 lg:flex-row lg:gap-18"
    >
      <div className="flex flex-col flex-1">
        <InputField name="image" isImage={true} text="프로필 이미지" />

        <hr className="hidden lg:block m-0 p-0 border-t-[1px] border-line-100 my-8" />

        <div className="mt-8">
          <InputField
            name="name"
            text="별명"
            placeholder="사이트에 노출될 이름을 입력해주세요"
            height="h-13 mg:h-13 lg:h-16"
            validator={validateName}
            onValidChange={(name, isValid) =>
              handleValidityChange(name, isValid)
            }
          />
        </div>

        <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

        <InputField
          name="career"
          text="경력"
          placeholder="기사님의 경력을 입력해주세요"
          height="h-13 mg:h-13 lg:h-16"
          validator={validateCareer}
          onValidChange={(name, isValid) => handleValidityChange(name, isValid)}
        />

        <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

        <InputField
          name="onelineIntroduction"
          text="한 줄 소개"
          placeholder="한 줄 소개를 입력해주세요"
          height="h-13 mg:h-13 lg:h-16"
          validator={validateOnelineIntroduction}
          onValidChange={(name, isValid) => handleValidityChange(name, isValid)}
        />

        <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8 lg:hidden" />
      </div>

      <div className="flex-1">
        <InputField
          name="detailDescription"
          text="상세 설명"
          isTextArea={true}
          placeholder="상세 내용을 입력해주세요"
          height="h-[160px]"
          validator={validateDetailDescription}
          onValidChange={(name, isValid) => handleValidityChange(name, isValid)}
        />

        <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

        <InputField
          name="serviceType"
          text="제공 서비스"
          isServiceType={true}
          validator={validateServiceType}
          onValidChange={(name, isValid) => handleValidityChange(name, isValid)}
        />

        <hr className="m-0 p-0 border-t-[1px] border-line-100 my-8" />

        <InputField
          name="area"
          text="서비스 가능 지역"
          isArea={true}
          validator={validateArea}
          onValidChange={(name, isValid) => handleValidityChange(name, isValid)}
        />

        <div className="mt-17">
          <SolidButton disabled={isDisabled} type="submit">
            {isPending ? "등록 중..." : "시작하기"}
          </SolidButton>
        </div>
      </div>
    </form>
  );
}

export default ProfileForm;
