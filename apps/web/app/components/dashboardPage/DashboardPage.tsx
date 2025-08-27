"use client";
import { Link } from "react-router-dom";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useDashboardMetrics } from "./util";
// 导入自定义 Hook（注意路径是否正确，若 util.ts 与当前文件同目录则无需修改）


export default function DashboardPage() {
  // 通过 Hook 获取数据及状态
  const { metrics, loading, error, refreshData } = useDashboardMetrics();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 主内容区 */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Hawk-tracker</h2>
          <div className="flex items-center space-x-4">
            {/* 新增刷新按钮，用于手动更新数据 */}
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={loading}
            >
              {loading ? "加载中..." : "刷新数据"}
            </Button>
            
            {/* 登录/注册链接 */}
            <Link to="/login">
              <button className="flex items-center space-x-2 whitespace-nowrap">
                <span>登录/注册</span>
                <img
                  src="https://unpkg.com/@mynaui/icons/icons/user.svg"
                  alt="用户头像"
                  className="w-6 h-6 rounded-full"
                />
              </button>
            </Link>
          </div>
        </div>

        {/* 加载状态：数据请求过程中显示 */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">数据加载中，请稍候...</p>
          </div>
        )}

        {/* 错误状态：请求失败时显示 */}
        {error && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button variant="outline" onClick={refreshData}>
                重试
              </Button>
            </div>
          </div>
        )}

        {/* 数据渲染：加载完成且无错误时显示卡片 */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 遍历 metrics 数据生成卡片（替代硬编码的4个卡片） */}
            {metrics.map((card) => (
              <Card key={card.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold">{card.value}</p>
                      <p className="text-sm text-gray-500">{card.metric}</p>
                    </div>
                    <div className="bg-blue-500 text-white p-2 rounded-full">
                      <span className="text-xl font-bold">{card.badge}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}