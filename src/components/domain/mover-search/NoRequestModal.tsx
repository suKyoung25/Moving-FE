"use client";

interface NoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function NoRequestModal({ isOpen, onClose, onConfirm }: NoRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-80 max-w-[90vw] mx-4 overflow-hidden">
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            지정 견적 요청하기
          </h3>
          <p className="text-sm text-gray-900 mb-6">
            일반 견적 요청을 먼저 진행해 주세요
          </p>
          
          <button
            onClick={onConfirm}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            일반 견적 요청하기
          </button>
        </div>
      </div>
    </div>
  );
}
