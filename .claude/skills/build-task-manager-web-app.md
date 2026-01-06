# Build Task Manager Web Application

## Description
Create a complete task management web application with AI integration, localStorage persistence, and GitHub Pages deployment. This skill demonstrates building a production-ready Next.js application with client-side architecture.

## Use Cases
- Build AI-powered task management systems
- Create automated information gathering tools
- Implement template-based task creation
- Deploy serverless web applications with custom API integration

## Tech Stack
- **Framework**: Next.js 14 + TypeScript (Static Export)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Browser localStorage
- **Deployment**: GitHub Pages
- **API**: Custom relay service (client-side calls)

## Project Architecture

### 1. Core Features
- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ Template library with predefined task types
- ✅ Task execution with API integration
- ✅ Execution history tracking
- ✅ Custom API configuration UI
- ✅ Pure client-side architecture (no backend)

### 2. Data Models

```typescript
// Task Model
interface Task {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  schedule: string;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
  templateId?: string;
}

// Template Model
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
  defaultSchedule: string;
}

// Execution History
interface TaskExecution {
  id: string;
  taskId: string;
  status: 'success' | 'failed';
  result?: string;
  error?: string;
  executedAt: string;
}

// API Configuration
interface ApiConfig {
  apiKey: string;
  apiBase: string;
  model: string;
}
```

### 3. File Structure

```
project/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions auto-deploy
├── app/
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Main page (client component)
│   └── globals.css                 # Global styles
├── lib/
│   ├── clientStorage.ts            # localStorage operations
│   ├── clientGrokClient.ts         # API client
│   └── templates.ts                # Predefined templates
├── public/
│   └── .nojekyll                   # GitHub Pages config
├── next.config.js                  # Next.js config (static export)
├── tailwind.config.ts              # Tailwind CSS config
├── package.json
└── README.md
```

## Implementation Guide

### Step 1: Initialize Next.js Project

```bash
npx create-next-app@latest grok-task --typescript --tailwind --app
cd grok-task
npm install lucide-react axios
```

### Step 2: Configure for Static Export

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/your-repo-name',
  assetPrefix: '/your-repo-name',
  images: { unoptimized: true },
  trailingSlash: true,
}
```

### Step 3: Create Storage Layer

```typescript
// lib/clientStorage.ts
const STORAGE_KEYS = {
  TASKS: 'grok_tasks',
  EXECUTIONS: 'grok_executions',
  API_CONFIG: 'grok_api_config',
};

export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  return stored ? JSON.parse(stored) : [];
};

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};
```

### Step 4: Create API Client

```typescript
// lib/clientGrokClient.ts
export async function callGrokAPI(
  prompt: string,
  config: ApiConfig
): Promise<GrokResponse> {
  try {
    const response = await fetch(`${config.apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    const data = await response.json();
    return {
      success: true,
      content: data.choices[0].message.content,
      usage: data.usage,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

### Step 5: Create Template Library

```typescript
// lib/templates.ts
export const templates: Template[] = [
  {
    id: 'x-trending',
    name: 'X 热帖监控',
    description: '监控 X 平台指定账号的高互动帖子',
    category: '社交媒体监控',
    prompt: `你是"X 热帖监控机器人"。

搜索最近 24 小时内 X 平台指定账号的帖子。

筛选条件：
- 点赞数 ≥ 30
- 浏览量 ≥ 1 万
- 原创内容

输出格式：
【X 24小时热帖速报】
统计时间：[时间]
今日最高赞：[数量] 赞 | 今日最高浏览：[数量]万+

@用户名 - 一句话描述
点赞 [数量]，浏览 [数量]万+
[链接]`,
    defaultSchedule: '每天 08:00, 20:00',
  },
  {
    id: 'ai-tech-tracker',
    name: 'AI 技术追踪',
    description: '追踪 AI 领域的最新技术动态',
    category: '技术追踪',
    prompt: `搜索最近 24 小时内关于 AI 技术的重要动态。

关注领域：
- 新模型发布
- 技术突破
- 行业应用
- 研究论文

输出最重要的 10 条信息，包含标题、来源和简要说明。`,
    defaultSchedule: '每天 09:00',
  },
];
```

### Step 6: Build Main UI Component

```tsx
// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Play, Pause, Trash2, Settings } from 'lucide-react';
import { getTasks, createTask, deleteTask, getApiConfig, saveApiConfig } from '@/lib/clientStorage';
import { executeTask } from '@/lib/clientGrokClient';
import { templates } from '@/lib/templates';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({ apiKey: '', apiBase: '', model: '' });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setTasks(getTasks());
    setApiConfig(getApiConfig());
  }, []);

  const handleCreateTask = (template: Template) => {
    const newTask = createTask({
      name: template.name,
      description: template.description,
      prompt: template.prompt,
      schedule: template.defaultSchedule,
      status: 'active',
    });
    setTasks(getTasks());
  };

  const handleExecuteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !apiConfig.apiKey) return;

    const result = await executeTask(task.prompt, apiConfig);
    // Handle result display
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Task Manager</h1>
          <button onClick={() => setShowSettings(true)}>
            <Settings className="w-5 h-5" />
            API 设置
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-gray-800 p-5 rounded-lg">
            <h3>{task.name}</h3>
            <button onClick={() => handleExecuteTask(task.id)}>
              <Play className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50">
          {/* API configuration UI */}
        </div>
      )}
    </main>
  );
}
```

### Step 7: Setup GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

### Step 8: Deploy

```bash
# Build locally
npm run build

# Manual deploy (alternative)
npm install -g gh-pages
gh-pages -d out

# Or push to GitHub for auto-deploy
git add .
git commit -m "feat: initial deployment"
git push origin main
```

### Step 9: Configure GitHub Pages

1. Go to repo Settings > Pages
2. Source: `gh-pages` branch
3. Folder: `/ (root)`
4. Save and wait for deployment

## Key Features Implementation

### Feature 1: Template-Based Task Creation

```typescript
const handleCreateFromTemplate = (template: Template) => {
  const task = createTask({
    name: template.name,
    description: template.description,
    prompt: template.prompt,
    schedule: template.defaultSchedule,
    status: 'active',
    templateId: template.id,
  });

  // Refresh UI
  setTasks(getTasks());
  alert('任务创建成功！');
};
```

### Feature 2: Execution History Tracking

```typescript
export const addExecution = (execution: Omit<TaskExecution, 'id'>): TaskExecution => {
  const newExecution: TaskExecution = {
    ...execution,
    id: Date.now().toString(),
  };

  const executions = getExecutions();
  executions.push(newExecution);

  // Keep only last 50 records
  if (executions.length > 50) {
    executions.sort((a, b) =>
      new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
    );
    executions.splice(50);
  }

  saveExecutions(executions);
  return newExecution;
};
```

### Feature 3: API Configuration Persistence

```typescript
const handleSaveConfig = () => {
  if (!apiConfig.apiKey || !apiConfig.apiBase) {
    alert('请填写完整配置！');
    return;
  }

  saveApiConfig(apiConfig);
  setShowSettings(false);
  alert('配置已保存！');
};
```

## Best Practices

### 1. Error Handling
```typescript
try {
  const result = await callAPI(prompt, config);
  if (!result.success) {
    throw new Error(result.error);
  }
  // Handle success
} catch (error) {
  console.error('API Error:', error);
  alert('执行失败: ' + error.message);
}
```

### 2. Loading States
```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await performAction();
  } finally {
    setLoading(false);
  }
};
```

### 3. Data Validation
```typescript
const validateTask = (task: Partial<Task>): string | null => {
  if (!task.name?.trim()) return '任务名称不能为空';
  if (!task.prompt?.trim()) return '提示词不能为空';
  return null;
};
```

### 4. Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <div key={item.id} className="p-4">
      {/* Content */}
    </div>
  ))}
</div>
```

## Performance Optimization

### 1. Lazy Loading
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### 2. Memoization
```typescript
import { useMemo } from 'react';

const filteredTasks = useMemo(() => {
  return tasks.filter(task => task.status === 'active');
}, [tasks]);
```

### 3. Debounce Input
```typescript
import { useEffect, useState } from 'react';

const [search, setSearch] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => setDebouncedSearch(search), 300);
  return () => clearTimeout(timer);
}, [search]);
```

## Common Issues & Solutions

### Issue: localStorage undefined in SSR
**Solution**: Always check `typeof window !== 'undefined'`

### Issue: Stale data after updates
**Solution**: Reload from localStorage after mutations

### Issue: Large data causing slow performance
**Solution**: Implement pagination and limit stored records

### Issue: API CORS errors
**Solution**: Use relay API service or configure CORS properly

## Security Considerations

1. **Never commit API keys** - Store in localStorage only
2. **Validate all inputs** - Prevent XSS attacks
3. **Use HTTPS** - For all API calls
4. **Sanitize display data** - Escape HTML in user content
5. **Rate limiting** - Implement client-side throttling

## Testing Strategy

```typescript
// Test localStorage operations
describe('clientStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create task', () => {
    const task = createTask({ name: 'Test', prompt: 'Test' });
    expect(task.id).toBeDefined();
    expect(getTasks()).toHaveLength(1);
  });
});

// Test API client
describe('clientApiClient', () => {
  it('should handle API errors', async () => {
    const result = await callAPI('test', {
      apiKey: '',
      apiBase: '',
      model: ''
    });
    expect(result.success).toBe(false);
  });
});
```

## Deployment Checklist

- [ ] Configure `basePath` and `assetPrefix`
- [ ] Add `.nojekyll` to `public/`
- [ ] Set up GitHub Actions workflow
- [ ] Enable GitHub Actions write permissions
- [ ] Configure GitHub Pages settings
- [ ] Test in production environment
- [ ] Add README with usage instructions
- [ ] Document API configuration steps

## Related Skills
- `deploy-nextjs-to-github-pages.md`
- `implement-localstorage-crud.md`
- `create-api-integration.md`
- `build-modal-components.md`
- `implement-template-system.md`

## Example Projects
- Grok Task Manager: https://github.com/xianyu110/grok-task
- Live Demo: https://xianyu110.github.io/grok-task/

## References
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [GitHub Pages](https://pages.github.com)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
