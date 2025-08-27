interface PaginationProps {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}
//页码组件
export function Pagination({ 
  totalCount, 
  currentPage, 
  totalPages, 
  onPreviousPage, 
  onNextPage 
}: PaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        共{totalCount}条, 页码{currentPage}/{totalPages}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onPreviousPage}
          disabled={currentPage <= 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
        >
          上一页
        </button>
        <button
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
}


