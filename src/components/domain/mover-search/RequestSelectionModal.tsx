"use client";

interface Request {
  id: string;
  moveType: 'SMALL' | 'HOME' | 'OFFICE';
  moveDate: string;
  fromAddress: string;
  toAddress: string;
  requestedAt: string;
}

interface RequestSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requests: Request[];
  selectedRequestId: string;
  onSelectRequest: (requestId: string) => void;
  isLoading: boolean;
}

export function RequestSelectionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  requests, 
  selectedRequestId, 
  onSelectRequest,
  isLoading 
}: RequestSelectionModalProps) {
  if (!isOpen) return null;

  const getMoveTypeText = (moveType: string) => {
    switch (moveType) {
      case 'SMALL': return '소형이사';
      case 'HOME': return '가정이사';
      case 'OFFICE': return '사무실이사';
      default: return moveType;
    }
  };

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
      <div className="bg-white rounded-lg shadow-xl w-96 max-w-[90vw] mx-4 overflow-hidden">
        {/* 모달 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">지정 견적 요청하기</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            어떤 이사 요청에 대한 견적을 요청하시겠습니까?
          </p>
        </div>

        {/* 모달 본문 */}
        <div className="p-6">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {requests.map((request) => (
              <label 
                key={request.id} 
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRequestId === request.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="request"
                  value={request.id}
                  checked={selectedRequestId === request.id}
                  onChange={(e) => onSelectRequest(e.target.value)}
                  className="w-4 h-4 mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {getMoveTypeText(request.moveType)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(request.moveDate).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-700">
                    <div className="truncate">
                      <span className="font-medium">출발:</span> {request.fromAddress}
                    </div>
                    <div className="truncate">
                      <span className="font-medium">도착:</span> {request.toAddress}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    요청일: {new Date(request.requestedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading || !selectedRequestId}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                isLoading || !selectedRequestId
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isLoading ? '전송 중...' : '견적 요청하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}