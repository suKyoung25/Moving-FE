"use client";

import SolidButton from "@/components/common/buttons/SolidButton";
import { useFormWizard } from "@/context/FormWizardContext";
import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import ChatWrapper from "./ChatWrapper";
import "react-day-picker/style.css";
import { ko } from "react-day-picker/locale";
import { format } from "date-fns";

// 이사 날짜 선택
export default function Step2() {
  const { state, currentStep, goToNextStep, goToPrevStep } = useFormWizard();
  const [selected, setSelected] = useState<Date | undefined>(state.moveDate);
  const defaultClassNames = getDefaultClassNames();

  if (currentStep > 1 && selected) {
    return (
      <>
        <ChatMessage type="system" message="이사 예정일을 선택해 주세요." />
        <ChatMessage
          type="user"
          message={format(selected, "yyyy년 MM월 dd일") ?? ""}
          onEditClick={goToPrevStep}
        />
      </>
    );
  }

  return (
    <>
      <ChatMessage type="system" message="이사 예정일을 선택해 주세요." />
      <ChatWrapper className="rounded-tr-3xl p-[14px]">
        <DayPicker
          animate
          mode="single"
          selected={selected}
          onSelect={setSelected}
          locale={ko}
          navLayout="around"
          showOutsideDays
          classNames={{
            day: `w-11 h-10`,
            today: `font-bold text-primary-blue-300`,
            selected: `[&>button]:!mx-auto [&>button]:!my-0 [&>button]:!bg-primary-blue-300 [&>button]:rounded-full [&>button]:!w-6 [&>button]:!h-6 !text-white`,
            weekday: `text-gray-400 font-medium px-4 py-[10px]`,
            outside: `text-gray-100`,
            month_caption: `${defaultClassNames.month_caption} !text-base !font-semibold`,
            root: `${defaultClassNames.root} text-sm`,
            chevron: `${defaultClassNames.chevron} !fill-gray-300`,
          }}
          formatters={{
            formatCaption: (month, options) => {
              return format(month, "yyyy. MM", { locale: options?.locale });
            },
          }}
        />
        <SolidButton onClick={goToNextStep} disabled={!selected}>
          선택완료
        </SolidButton>
      </ChatWrapper>
    </>
  );
}
