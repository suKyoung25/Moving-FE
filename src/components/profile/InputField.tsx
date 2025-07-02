import Image from "next/image";
import React from "react";

interface InputFieldProps {
  isImage?: string; //이미지input인지
  isTextArea?: string; //textArea인지
  isServiceType?: string; //제공 서비스인지
  isArea?: string; //서비스 가능 지역인지
  text: string;
  placeholder?: string;
  width?: string;
  height?: string;
}

//이미지input / textArea / 제공 서비스 / 지역선택    각 형식을 [isprops] === "selected"를 통해 분기처리
function InputField({
  isImage,
  isTextArea,
  isServiceType,
  isArea,
  text,
  placeholder,
  width,
  height,
}: InputFieldProps) {
  //프로필 이미지 input인 경우
  if (isImage === "selected") {
    return (
      <div className="text-[20px] leading-[32px] flex flex-col gap-4">
        <div className="font-semibold ">{text}</div>
        <Image src="" alt="비어있는 프로필 이미지" />
      </div>
    );
  }

  //상세 설명 input인 경우
  if (isTextArea === "selected") {
    return (
      <div className="text-[20px] leading-[32px] flex flex-col gap-4">
        <div className="font-semibold ">
          {text}
          <span className="text-[var(--color-primary-blue-300)]"> *</span>
        </div>
        <textarea
          className={`${width} ${height} text-[var(--color-gray-300)] rounded-2xl pl-[14px] pt-[14px] bg-[var(--color-bg-200)]`}
          placeholder={placeholder}
        />
      </div>
    );
  }

  //제공 서비스 input인 경우 (소형이사, 가정이사, 사무실이사)
  const serviceTypes = ["소형이사", "가정이사", "사무실이사"];

  if (isServiceType === "selected") {
    return (
      <div className="text-[20px] leading-[32px] flex flex-col gap-4">
        <div className="font-semibold ">
          {text}
          <span className="text-[var(--color-primary-blue-300)]"> *</span>
        </div>

        <div className="flex gap-[12px]">
          {serviceTypes.map((type) => (
            <button className="flex justify-center px-[20px] py-[10px] rounded-[100px] bg-[var(--color-bg-200)] border border-[var(--color-gray-100)] font-normal text-[18px] leading-[26px]">
              {type}
            </button>
          ))}
        </div>
      </div>
    );
  }

  //서비스 가능 input인 경우 (각 지역별로)
  const regions = [
    "서울",
    "경기",
    "인천",
    "강원",
    "충북",
    "충남",
    "세종",
    "대전",
    "전북",
    "전남",
    "광주",
    "경북",
    "경남",
    "대구",
    "울산",
    "부산",
    "제주",
  ];

  if (isArea === "selected") {
    return (
      <div className="text-[20px] leading-[32px] flex flex-col gap-4">
        <div className="font-semibold ">
          {text}
          <span className="text-[var(--color-primary-blue-300)]"> *</span>
        </div>
        <div className="grid grid-cols-5 gap-x-[14px] gap-y-[18px]">
          {regions.map((region) => (
            <button className="flex justify-center px-[20px] py-[10px] rounded-[100px] bg-[var(--color-bg-200)] border border-[var(--color-gray-100)] font-normal text-[18px] leading-[26px]">
              {region}
            </button>
          ))}
        </div>
      </div>
    );
  }

  //그외 일반적인 input인 경우 (별명, 경력, 한 줄 소개)
  return (
    <div className="text-[20px] leading-[32px] flex flex-col gap-4">
      <div className="font-semibold ">
        {text}
        <span className="text-[var(--color-primary-blue-300)]"> *</span>
      </div>
      <input
        type="text"
        className={`${width} ${height} text-[var(--color-gray-300)] rounded-2xl pl-[14px] bg-[var(--color-bg-200)]`}
        placeholder={placeholder}
      />
    </div>
  );
}

export default InputField;
