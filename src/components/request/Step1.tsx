"use client";

import { useFormWizard } from "@/context/FormWizardContext";
import { Request } from "@/lib/types";
import React from "react";
import ChatMessage from "./ChatMessage";
import Image from "next/image";
import CheckedIcon from "@/assets/images/roundActiveIcon.svg";
import UncheckedIcon from "@/assets/images/roundDefaultIcon.svg";
import SolidButton from "@/components/common/buttons/SolidButton";
import ChatWrapper from "./ChatWrapper";

// 이사 종류 선택
export default function Step1() {
  const { state, dispatch, currentStep, goToNextStep, goToPrevStep } =
    useFormWizard();
  const selected = state.moveType;

  const selectOptions = [
    { label: "소형이사 (원룸, 투룸, 20평대 미만)", value: "small" },
    { label: "가정이사 (쓰리룸, 20평대 이상)", value: "home" },
    { label: "사무실이사 (사무실, 상업공간)", value: "office" },
  ] as const;

  const selectedLabel = selectOptions.find(
    (option) => option.value === selected
  )?.label;

  const handleSelect = (value: Request["moveType"]) => {
    dispatch({ type: "SET_MOVE_TYPE", payload: value });
  };

  // 이미 Step1이 완료된 경우: 선택 결과만 보여줌
  if (currentStep > 0) {
    return (
      <>
        <ChatMessage type="system" message="이사 종류를 선택해 주세요." />
        <ChatMessage
          type="user"
          message={selectedLabel ?? ""}
          onEditClick={goToPrevStep}
        />
      </>
    );
  }

  return (
    <>
      <ChatMessage type="system" message="이사 종류를 선택해 주세요." />
      <ChatWrapper>
        <div className="flex flex-col gap-2 lg:gap-4">
          {selectOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex items-center w-70 lg:w-140 h-13 lg:h-21 px-4 py-[14px] border rounded-2xl cursor-pointer hover:border-primary-blue-300 ${
                selected === option.value
                  ? "border-primary-blue-300 bg-primary-blue-50"
                  : "border-line-200"
              }`}
            >
              <Image
                src={selected === option.value ? CheckedIcon : UncheckedIcon}
                alt={`라디오 버튼 ${selected === option.value ? "선택됨" : "선택안됨"}`}
                className="w-6 aspect-square lg:w-9"
              />
              <span className="ml-2 text-sm lg:text-lg font-semibold">
                {option.label}
              </span>
            </button>
          ))}
        </div>
        <SolidButton onClick={goToNextStep} disabled={!selected}>
          선택완료
        </SolidButton>
      </ChatWrapper>
    </>
  );
}
