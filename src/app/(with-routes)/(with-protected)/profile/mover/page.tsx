import InputField from "@/components/profile/InputField";
import React from "react";

function MoverProfilePage() {
  return (
    <>
      <div> 기사님 프로필 등록</div>
      <div> 추가 정보를 입력하여 회원가입을 완료해주세요</div>

      <hr />

      <InputField
        isImage="selected"
        text="프로필 이미지"
        width="w-[640px]"
        height="h-[64px]"
      />

      <InputField
        text="별명"
        placeholder="사이트에 노출될 이름을 입력해주세요"
        width="w-[640px]"
        height="h-[64px]"
      />

      <InputField
        text="상세 설명"
        isArea="selected"
        placeholder="상세 내용을 입력해주세요"
        width="w-[640px]"
        height="h-[160px]"
      />

      <InputField text="제공 서비스" isServiceType="selected" />

      <InputField text="서비스 가능 지역" isServiceType="selected" />
    </>
  );
}

export default MoverProfilePage;
