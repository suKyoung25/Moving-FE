import React from "react";
import BasicInputField from "./BasicInputField";
import SolidButton from "../common/buttons/SolidButton";
import OutlinedButton from "../common/buttons/OutlinedButton";
import SecretInputField from "./SecretInputField";

function BasicInfoForms() {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:gap-18">
        <div className="flex-1">
          <BasicInputField
            name="name"
            text="이름"
            placeholder="사이트에 노출될 이름을 입력해주세요"
            height="h-16"
            //   defaultValue,
            //   validator,
            //   onValidChange,
          />

          <hr className="my-8 p-o border-t-[1px] border-line-100" />

          <BasicInputField
            name="email"
            text="이메일"
            placeholder="moving.@email.com"
            height="h-16"
            //   defaultValue,
            //   validator,
            //   onValidChange,
          />

          <hr className="my-8 p-o border-t-[1px] border-line-100" />

          <BasicInputField
            name="phone"
            text="전화번호"
            placeholder="01012345678"
            height="h-16"
            //   defaultValue,
            //   validator,
            //   onValidChange,
          />
        </div>

        <hr className="my-8 p-o border-t-[1px] border-line-100 lg:hidden" />

        <div className="flex-1">
          <SecretInputField
            name="existedPassword"
            text="현재 비밀번호"
            placeholder="현재 비밀번호를 입력해주세요"
            height="h-16"
            //   defaultValue,
            //   validator,
            //   onValidChange,
          />

          <hr className="my-8 p-o border-t-[1px] border-line-100" />

          <SecretInputField
            name="newPassword"
            text="새 비밀번호"
            placeholder="새 비밀번호를 입력해주세요"
            height="h-16"
            //   defaultValue,
            //   validator,
            //   onValidChange,
          />

          <hr className="my-8 p-o border-t-[1px] border-line-100" />

          <SecretInputField
            name="checkNewPassword"
            text="새 비밀번호 확인"
            placeholder="새 비밀번호를 다시 한번 입력해주세요"
            height="h-16"
            //   defaultValue,
            //   validator,
            //   onValidChange,
          />

          <hr className="my-8 p-o border-t-[1px] border-line-100 lg:hidden" />
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row-reverse lg:mt-16">
        <SolidButton className="h-13 lg:h-16">수정하기</SolidButton>
        <OutlinedButton>취소</OutlinedButton>
      </div>
    </>
  );
}

export default BasicInfoForms;
