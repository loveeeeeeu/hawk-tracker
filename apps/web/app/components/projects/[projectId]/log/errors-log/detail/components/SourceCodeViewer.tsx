interface SourceCodeViewerProps {
  sourceCode: {
    file: string;
    line: number;
    column: number;
    code: string;
    context: Array<{
      line: number;
      code: string;
      isErrorLine: boolean;
    }>;
  };
}
//创建源码查看器组件
export function SourceCodeViewer({ sourceCode }: SourceCodeViewerProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">源码堆栈</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-700">
            {sourceCode.file} (第 {sourceCode.line} 行，第 {sourceCode.column} 列)
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="font-mono text-sm">
              {sourceCode.context.map((item) => (
                <tr
                  key={item.line}
                  className={`${
                    item.isErrorLine
                      ? 'bg-red-50 border-l-4 border-red-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-1 text-gray-500 text-right select-none w-16">
                    {item.line}
                  </td>
                  <td className="px-4 py-1 text-gray-800">
                    {item.code}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}