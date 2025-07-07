"use client";

import { useFormWizard } from "@/context/FormWizardContext";

import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatWrapper from "./ChatWrapper";
import SolidButton from "@/components/common/buttons/SolidButton";
import OutlinedButton from "@/components/common/buttons/OutlinedButton";
import DaumPostcodeEmbed from "react-daum-postcode";
import AddressModal from "./AddressModal";
import AddressSearch from "./AddressSearch";
import { Request } from "@/lib/types";

const themeObj = {
  bgColor: "#FFFFFF", //바탕 배경색
  searchBgColor: "#FAFAFA", //검색창 배경색
  textColor: "#1F1F1F", //기본 글자색
  queryTextColor: "#1F1F1F", //검색창 글자색
  postcodeTextColor: "#1F1F1F", //우편번호 글자색
  emphTextColor: "#1B92FF", //강조 글자색
};

// 주소 입력
export default function Step3() {
  const { currentStep, goToNextStep } = useFormWizard();
  const [fromAddress, setFromAddress] = useState<Request["fromAddress"]>();
  const [toAddress, setToAddress] = useState<Request["toAddress"]>();
  const [targetField, setTargetField] = useState<"from" | "to" | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleComplete = (addr: string) => {
    console.log(addr);
    if (targetField === "from") {
      setFromAddress(addr);
    } else if (targetField === "to") {
      setToAddress(addr);
    }
    setShowModal(false);
  };

  const handleConfirm = () => {
    if (currentStep === 3) {
      goToNextStep();
    }
  };

  useEffect(() => {
    if (currentStep === 2 && fromAddress && toAddress) {
      goToNextStep();
    }
  }, [fromAddress, toAddress, currentStep, goToNextStep]);

  return (
    <>
      <ChatMessage type="system" message="이사 지역을 선택해 주세요." />
      <ChatWrapper className="px-6 py-5 lg:p-8">
        <label className="text-sm font-medium lg:text-lg">출발지</label>
        <OutlinedButton
          className="w-72 lg:w-140 text-left"
          onClick={() => {
            setTargetField("from");
            setShowModal(true);
          }}
        >
          {fromAddress || "출발지 선택하기"}
        </OutlinedButton>
        <label className="text-sm font-medium lg:text-lg">도착지</label>
        <OutlinedButton
          className="text-left"
          onClick={() => {
            setTargetField("to");
            setShowModal(true);
          }}
        >
          {toAddress || "도착지 선택하기"}
        </OutlinedButton>
        <SolidButton
          onClick={handleConfirm}
          disabled={!fromAddress || !toAddress}
        >
          견적 확정하기
        </SolidButton>
      </ChatWrapper>

      {showModal && (
        <AddressSearch
          type={targetField}
          onSelect={handleComplete}
          onClose={() => setShowModal(false)}
        />
        // <AddressModal
        //   type={targetField}
        //   onComplete={handleComplete}
        //   onClose={() => setShowModal(false)}
        // />
        // <div className="fixed inset-0 bg-bg-black/50 z-50 flex flex-col items-center justify-center">
        //   <div className="w-73 lg:w-152 bg-white">
        //     {/* <DaumPostcodeEmbed theme={themeObj} /> */}
        //   </div>
        // </div>
      )}
    </>
  );
}
