import React from "react";

// 견적 요청 진행 상태 표시 바
export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div
      className="w-full bg-line-200 rounded-full h-[6px] lg:h-2"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div
        className="bg-primary-blue-300 h-[6px] lg:h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
