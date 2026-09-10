'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Play, Pause, Trash2, Clock, CheckCircle, XCircle, History, X, Settings } from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask, getTaskExecutions, addExecution, getApiConfig, saveApiConfig, type Task, type ApiConfig } from '@/lib/clientStorage';
import { executeTask } from '@/lib/clientGrokClient';
import { templates } from '@/lib/templates';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
  defaultSchedule: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [executingTask, setExecutingTask] = useState<string | null>(null);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({ apiKey: '', apiBase: '', model: '' });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // 加载任务和配置
    setTasks(getTasks());
    setApiConfig(getApiConfig());
  }, []);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleCreateTaskFromTemplate = useCallback((template: Template) => {
    const newTask = createTask({
      name: template.name,
      description: template.description,
      prompt: template.prompt,
      schedule: template.defaultSchedule,
      status: 'active',
      templateId: template.id,
    });
    setTasks(getTasks());
    setShowTemplates(false);
    showNotification('success', '任务创建成功！');
  }, [showNotification]);

  const [executionResult, setExecutionResult] = useState<any>(null);
  const [showExecutionModal, setShowExecutionModal] = useState(false);

  const handleExecuteTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // 检查 API 配置
    if (!apiConfig.apiKey || !apiConfig.apiBase) {
      showNotification('error', '请先配置 API 设置！点击右上角设置按钮进行配置。');
      setShowSettings(true);
      return;
    }

    setExecutingTask(taskId);
    try {
      const result = await executeTask(task.prompt, apiConfig);

      // 保存执行历史
      addExecution({
        taskId,
        status: result.success ? 'success' : 'failed',
        result: result.content,
        error: result.error,
        executedAt: new Date().toISOString(),
      });

      setExecutionResult({
        taskId,
        result,
        timestamp: new Date().toISOString(),
      });
      setShowExecutionModal(true);
    } catch (error: any) {
      showNotification('error', '执行任务失败: ' + error.message);
    } finally {
      setExecutingTask(null);
    }
  }, [tasks, apiConfig, showNotification]);

  const handleDeleteTask = useCallback((taskId: string) => {
    if (!confirm('确定要删除这个任务吗？')) return;
    deleteTask(taskId);
    setTasks(getTasks());
    showNotification('success', '任务已删除');
  }, [showNotification]);

  const handleToggleTaskStatus = useCallback((task: Task) => {
    const newStatus = task.status === 'active' ? 'paused' : 'active';
    updateTask(task.id, { status: newStatus });
    setTasks(getTasks());
  }, []);

  const handleSaveApiConfig = useCallback(() => {
    if (!apiConfig.apiKey || !apiConfig.apiBase) {
      showNotification('error', '请填写 API 密钥和地址！');
      return;
    }
    saveApiConfig(apiConfig);
    setShowSettings(false);
    showNotification('success', 'API 配置已保存！');
  }, [apiConfig, showNotification]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const groupedTemplates = useMemo(() => {
    return templates.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    }, {} as Record<string, Template[]>);
  }, []);

  const [selectedTaskHistory, setSelectedTaskHistory] = useState<string | null>(null);
  const [taskExecutions, setTaskExecutions] = useState<any[]>([]);

  const viewHistory = useCallback((taskId: string) => {
    const executions = getTaskExecutions(taskId);
    setTaskExecutions(executions);
    setSelectedTaskHistory(taskId);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all transform animate-in slide-in-from-right ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                Grok Tasks Manager
              </h1>
              <p className="text-gray-400 text-sm md:text-base">管理你的 Grok 自动化任务 - 纯前端版本</p>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Settings className="w-4 h-4" />
              API 设置
            </button>
          </div>

          {/* Collapsible Info */}
          <details className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg overflow-hidden group">
            <summary className="px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm text-gray-300">
              <span className="font-semibold">💡 使用提示</span>
              <span className="text-xs text-gray-500">(点击展开/收起)</span>
            </summary>
            <div className="px-4 pb-4 pt-2 text-sm text-gray-400 border-t border-gray-700">
              <p className="mb-2">
                <span className="font-semibold text-gray-300">纯前端应用：</span>
                数据存储在浏览器 localStorage，API 密钥可自定义。
              </p>
              <p>
                推荐使用 <code className="bg-gray-900 px-2 py-1 rounded text-blue-400">https://tryallapi.com/v1</code> 中转服务
              </p>
            </div>
          </details>
        </div>

        {/* Action Buttons */}
        <div className="mb-6">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            {showTemplates ? '关闭模板库' : '从模板创建任务'}
          </button>
        </div>

        {/* Templates Section */}
        {showTemplates && (
          <div className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">预设模板库</h2>
            {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => handleCreateTaskFromTemplate(template)}
                    >
                      <h4 className="font-semibold mb-2">{template.name}</h4>
                      <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{template.defaultSchedule}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">我的任务</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-gray-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-3">还没有任务</h3>
              <p className="text-gray-400 mb-6">开始创建你的第一个 Grok 任务，开启自动化之旅！</p>
              <button
                onClick={() => setShowTemplates(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                立即创建任务
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-700 p-5 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h3 className="font-semibold text-lg">{task.name}</h3>
                        {task.description && (
                          <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleTaskStatus(task)}
                        className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                        title={task.status === 'active' ? '暂停' : '启动'}
                      >
                        {task.status === 'active' ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleExecuteTask(task.id)}
                        disabled={executingTask === task.id}
                        className="p-2 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
                        title="立即执行"
                      >
                        {executingTask === task.id ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => viewHistory(task.id)}
                        className="p-2 hover:bg-purple-600 rounded-lg transition-colors"
                        title="查看历史"
                      >
                        <History className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 hover:bg-red-600 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>定时：{task.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>状态：</span>
                      <span className={
                        task.status === 'active' ? 'text-green-400' :
                        task.status === 'paused' ? 'text-yellow-400' :
                        'text-gray-400'
                      }>
                        {task.status === 'active' ? '运行中' : task.status === 'paused' ? '已暂停' : '已完成'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-2xl w-full border border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold">API 配置</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">
                    <span className="font-semibold">💡 提示：</span>
                    API 密钥可以填写任意字符串（如：sk-my-key-123），推荐使用中转 API 地址
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">API 密钥</label>
                  <input
                    type="text"
                    value={apiConfig.apiKey}
                    onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
                    placeholder="输入任意字符串作为 API 密钥"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">API 地址</label>
                  <input
                    type="text"
                    value={apiConfig.apiBase}
                    onChange={(e) => setApiConfig({ ...apiConfig, apiBase: e.target.value })}
                    placeholder="https://tryallapi.com/v1"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">模型名称</label>
                  <input
                    type="text"
                    value={apiConfig.model}
                    onChange={(e) => setApiConfig({ ...apiConfig, model: e.target.value })}
                    placeholder="grok-4.1-fast"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={handleSaveApiConfig}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  保存配置
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Execution Result Modal */}
        {showExecutionModal && executionResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold">任务执行结果</h3>
                <button
                  onClick={() => setShowExecutionModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(executionResult.timestamp).toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {executionResult.result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={executionResult.result.success ? 'text-green-500' : 'text-red-500'}>
                      {executionResult.result.success ? '执行成功' : '执行失败'}
                    </span>
                  </div>
                </div>

                {executionResult.result.success ? (
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-400">Grok 响应内容：</h4>
                    <div className="bg-gray-900 p-4 rounded-lg whitespace-pre-wrap text-sm border border-gray-700">
                      {executionResult.result.content}
                    </div>

                    {executionResult.result.usage && (
                      <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                        <h4 className="font-semibold mb-2 text-purple-400">API 使用统计：</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">提示词 Token：</span>
                            <span className="ml-2 font-mono">{executionResult.result.usage.prompt_tokens}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">完成 Token：</span>
                            <span className="ml-2 font-mono">{executionResult.result.usage.completion_tokens}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">总计 Token：</span>
                            <span className="ml-2 font-mono">{executionResult.result.usage.total_tokens}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-400">错误信息：</h4>
                    <div className="bg-red-900 bg-opacity-20 p-4 rounded-lg text-red-300 border border-red-800">
                      {executionResult.result.error}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Execution History Modal */}
        {selectedTaskHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold">执行历史</h3>
                <button
                  onClick={() => setSelectedTaskHistory(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {taskExecutions.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>暂无执行历史</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {taskExecutions.map((exec) => (
                      <div key={exec.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {exec.status === 'success' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span className={exec.status === 'success' ? 'text-green-500' : 'text-red-500'}>
                              {exec.status === 'success' ? '执行成功' : '执行失败'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(exec.executedAt).toLocaleString('zh-CN')}</span>
                          </div>
                        </div>
                        {exec.result && (
                          <div className="bg-gray-900 p-3 rounded text-sm whitespace-pre-wrap max-h-40 overflow-y-auto border border-gray-800">
                            {exec.result.substring(0, 500)}
                            {exec.result.length > 500 && '...'}
                          </div>
                        )}
                        {exec.error && (
                          <div className="bg-red-900 bg-opacity-20 p-3 rounded text-sm text-red-300 border border-red-800">
                            {exec.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
