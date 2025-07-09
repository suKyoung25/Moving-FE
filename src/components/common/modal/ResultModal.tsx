'use client'

import Image from "next/image"
import xIcon from '@/assets/images/xIcon.svg'

type ResultModalProps = {
  isOpen: boolean
  message: string
  onClose: () => void
}

// 메시지를 표시하는 모달 컴포넌트
export default function ResultModal({ isOpen, message, onClose }: ResultModalProps) {
  // 배경 영역 클릭 시 닫기
  const handleClosed = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target instanceof HTMLElement &&
      e.target.classList.contains('isClosed')
    ) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      onClick={handleClosed}
      className="isClosed fixed top-0 left-0 z-50 w-full min-h-full bg-black/50 overflow-hidden"
    >
      <div className="max-w-[608px] w-4/5 mx-auto flex flex-col gap-6 lg:gap-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-6 rounded-3xl bg-white">
        {/* 닫기 버튼 */}
        <div className="flex justify-end">
          <button type="button" onClick={onClose}>
            <Image
              src={xIcon}
              alt="close"
              width={24}
              height={24}
              className="lg:w-9 lg:h-9"
            />
          </button>
        </div>

        {/* 메시지 출력 */}
        <div className="text-18-medium text-center">{message}</div>

        {/* 확인 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="p-4 text-16-semibold lg:text-20-semibold bg-primary-blue-300 text-white rounded-2xl"
        >
          확인
        </button>
      </div>
    </div>
  )
}
