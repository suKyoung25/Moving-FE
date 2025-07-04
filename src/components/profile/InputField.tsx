"use client";

import Image from "next/image";
import React, { useState } from "react";
import profileUploaderIcon from "@/assets/images/profileUploaderIcon.svg";
import { InputFieldProps } from "@/types/profile.types";

//이미지input / textArea / 제공 서비스 / 지역선택    각 형식을 [isprops] === boolean을 통해 분기처리
function InputField({
  name,
  isImage,
  isTextArea,
  isServiceType,
  isArea,
  text,
  placeholder,
  height,
  // error,
  // value,
  // onChange,
  validator, // 유효성 검사 함수
  defaultValue,
  onValidChange, // 값이 바뀔 때 호출
}: InputFieldProps) {
  const [value, setValue] = useState<string | string[]>(
    defaultValue ?? (isServiceType || isArea ? [] : "")
  );
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newVal = e.target.value;
    setValue(newVal); //input 값 저장

    if (validator) {
      const result = validator(newVal); //input 값을 유효성 검사

      if (result.success) {
        onValidChange?.(name, newVal); // 외부로 값 전달
        setError("");
      } else {
        setError(result.message);
      }
    }
  };

  //프로필 이미지 input인 경우
  if (isImage) {
    return (
      <div className="text-16-semibold lg:text-20-semibold flex flex-col gap-4">
        <div>{text}</div>
        <Image
          src={profileUploaderIcon}
          width={160}
          height={160}
          alt="비어있는 프로필 이미지"
          onClick={() => {
            console.log("프로필 이미지 등록 버튼 클릭");
          }}
        />
      </div>
    );
  }

  //상세 설명 input인 경우
  if (isTextArea) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-16-semibold lg:text-20-semibold">
          {text}
          <span className="text-blue-300"> *</span>
        </div>
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          className={`w-full ${height} placeholder:text-gray-300 rounded-2xl pl-3.5 pt-3.5 bg-bg-200 ${error ? "border border-red-500" : ""}`}
          placeholder={placeholder}
        />
        {error && (
          <div className="text-red-500 mt-2 text-base font-medium leading-[26px]">
            {error}
          </div>
        )}
      </div>
    );
  }

  //버튼 사용하는 컴포넌트에서 사용
  const handleToggle = (type: string) => {
    if (!Array.isArray(value)) return;

    const updated = value.includes(type)
      ? value.filter((item) => item !== type) // 한번 더 누르면 선택 해제
      : [...value, type]; // 선택 추가

    setValue(updated);

    if (validator) {
      const result = validator(updated);
      setError(result.success ? "" : result.message);

      if (result.success) {
        onValidChange?.(name, updated);
      }
    }
  };

  //제공 서비스 input인 경우 (소형이사, 가정이사, 사무실이사)

  if (isServiceType) {
    const serviceTypes = ["소형이사", "가정이사", "사무실이사"];
    const selectedValues = Array.isArray(value) ? value : []; // value가 배열인지 보장 (중복선택 가능)

    return (
      <div className="text-16-semibold lg:text-20-semibold leading-8 flex flex-col gap-6">
        <div>
          {text}
          <span className="text-blue-300"> *</span>
          {error && (
            <div className="text-red-500 mt-0.5 text-base font-medium leading-[26px]">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {serviceTypes.map((type) => {
            const isSelected = selectedValues.includes(type);
            return (
              <React.Fragment key={type}>
                <button
                  type="button"
                  onClick={() => handleToggle(type)}
                  className={`flex justify-center px-5 py-2.5 border rounded-full text-16-regular leading-[26px]
              ${isSelected ? "border-primary-blue-300 text-primary-blue-300 bg-primary-blue-50" : "border-gray-100 bg-bg-200 border"}`}
                >
                  {type}
                </button>
                {isSelected && (
                  <input //button에는 name으로 연결시킬 수 없어서 hidden input 사용
                    type="hidden"
                    name="type"
                    value={type}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  //서비스 가능 input인 경우
  if (isArea) {
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
    const selectedValues = Array.isArray(value) ? value : []; // value가 배열인지 보장 (중복선택 가능)

    return (
      <div className="text-16-semibold lg:text-20-semibold leading-8 flex flex-col gap-6">
        <div>
          {text}
          <span className="text-blue-300"> *</span>
          {error && (
            <div className="text-red-500 mt-0.5 text-base font-medium leading-[26px]">
              {error}
            </div>
          )}
        </div>
        <div className="grid grid-cols-5 gap-x-3.5 gap-y-4.5">
          {regions.map((region) => {
            const isSelected = selectedValues.includes(region);
            return (
              <React.Fragment key={region}>
                <button
                  type="button"
                  onClick={() => handleToggle(region)}
                  className={`flex justify-center px-5 py-2.5 rounded-full bg-bg-200 border border-gray-100 text-18-regular leading-7
                 ${isSelected ? "border-primary-blue-300 text-primary-blue-300 bg-primary-blue-50" : "border-gray-100 bg-bg-200 border"}`}
                >
                  {region}
                </button>
                {isSelected && (
                  <input //button에는 name으로 연결시킬 수 없어서 hidden input 사용
                    type="hidden"
                    name="region"
                    value={region}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  //그외 일반적인 input인 경우 (별명, 경력, 한 줄 소개)
  return (
    <div className="leading-[32px] flex flex-col gap-4">
      <div className="text-16-semibold lg:text-20-semibold">
        {text}
        <span className="text-blue-300"> *</span>
      </div>
      <input
        name={name}
        value={value}
        onChange={handleChange}
        type="text"
        className={`w-full ${height} placeholder:text-gray-300 rounded-2xl pl-3.5 bg-bg-200 ${error ? "border border-red-500" : ""}`}
        placeholder={placeholder}
        // onBlur={() => {
        //   if (validator) {
        //     const result = validator(value);
        //     setError(result.success ? "" : result.message);
        //   }
        // }}
      />

      {error && (
        <div className="text-red-500 mt-2 text-base font-medium leading-[26px] self-end">
          {error}
        </div>
      )}
    </div>
  );
}

export default InputField;
