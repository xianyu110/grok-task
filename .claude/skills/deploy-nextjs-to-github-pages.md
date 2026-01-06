# Deploy Next.js to GitHub Pages

## Description
Deploy a pure frontend Next.js application to GitHub Pages with localStorage for data persistence and custom API configuration.

## Use Cases
- Deploy static Next.js apps to GitHub Pages
- Create client-side only applications with API integration
- Implement localStorage-based data persistence
- Setup custom API endpoints without backend servers

## Implementation Steps

### 1. Configure Next.js for Static Export

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/your-repo-name',
  assetPrefix: '/your-repo-name',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

### 2. Create localStorage Storage Layer

```typescript
// lib/clientStorage.ts
export interface Task {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ApiConfig {
  apiKey: string;
  apiBase: string;
  model: string;
}

const STORAGE_KEYS = {
  TASKS: 'app_tasks',
  API_CONFIG: 'app_api_config',
};

export const getApiConfig = (): ApiConfig => {
  if (typeof window === 'undefined') return { apiKey: '', apiBase: '', model: '' };
  const stored = localStorage.getItem(STORAGE_KEYS.API_CONFIG);
  return stored ? JSON.parse(stored) : {
    apiKey: '',
    apiBase: 'https://api.example.com/v1',
    model: 'default-model',
  };
};

export const saveApiConfig = (config: ApiConfig): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.API_CONFIG, JSON.stringify(config));
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

### 3. Create Browser-Side API Client

```typescript
// lib/clientApiClient.ts
export interface ApiResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: any;
}

export interface ApiConfig {
  apiKey: string;
  apiBase: string;
  model: string;
}

export async function callAPI(
  prompt: string,
  config: ApiConfig,
  options: { temperature?: number; max_tokens?: number } = {}
): Promise<ApiResponse> {
  try {
    if (!config.apiKey || !config.apiBase) {
      return {
        success: false,
        error: '请先配置 API 密钥和地址',
      };
    }

    const response = await fetch(`${config.apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error?.message || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices[0].message.content,
      usage: data.usage,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '网络请求失败',
    };
  }
}
```

### 4. Add API Configuration UI Component

```tsx
// components/ApiSettingsModal.tsx
'use client';

import { useState } from 'react';
import { X, Settings } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: { apiKey: string; apiBase: string; model: string };
  onSave: (config: { apiKey: string; apiBase: string; model: string }) => void;
}

export default function ApiSettingsModal({ isOpen, onClose, config, onSave }: ApiSettingsModalProps) {
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    if (!localConfig.apiKey || !localConfig.apiBase) {
      alert('请填写 API 密钥和地址！');
      return;
    }
    onSave(localConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold">API 配置</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <span className="font-semibold">💡 提示：</span>
              配置您的 API 设置以使用服务
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">API 密钥</label>
            <input
              type="text"
              value={localConfig.apiKey}
              onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
              placeholder="输入 API 密钥"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">API 地址</label>
            <input
              type="text"
              value={localConfig.apiBase}
              onChange={(e) => setLocalConfig({ ...localConfig, apiBase: e.target.value })}
              placeholder="https://api.example.com/v1"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">模型名称</label>
            <input
              type="text"
              value={localConfig.model}
              onChange={(e) => setLocalConfig({ ...localConfig, model: e.target.value })}
              placeholder="模型名称"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 5. Setup GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
          cname: false
```

### 6. Add .nojekyll File

Create `public/.nojekyll` (empty file) to prevent GitHub Pages from processing the site with Jekyll, which ignores `_next` directories.

```bash
mkdir -p public
touch public/.nojekyll
```

### 7. Manual Deployment (Alternative)

```bash
# Build the project
npm run build

# Install gh-pages tool
npm install -g gh-pages

# Deploy to gh-pages branch
gh-pages -d out
```

### 8. Configure GitHub Pages

1. Go to repository Settings > Pages
2. Source: Select `gh-pages` branch
3. Folder: `/ (root)`
4. Save

## Key Considerations

### Path Configuration
- Use `basePath` and `assetPrefix` in `next.config.js` for subdirectory deployment
- Format: `/repository-name`

### localStorage Best Practices
- Always check `typeof window !== 'undefined'` before accessing localStorage
- Provide default values for missing data
- Handle JSON parse errors gracefully

### GitHub Pages Limitations
- No server-side code execution
- All API calls must be client-side
- Static files only
- CORS must be handled by API endpoints

### Security
- Never commit real API keys
- Store sensitive data in localStorage (user's browser only)
- Use HTTPS for all API calls
- Validate user input before API calls

## Common Issues and Solutions

### Issue: Assets (CSS/JS) not loading
**Solution**: Add `.nojekyll` file to `public/` directory

### Issue: 404 on page refresh
**Solution**: Use `trailingSlash: true` in `next.config.js`

### Issue: Images not loading
**Solution**: Use `images: { unoptimized: true }` in `next.config.js`

### Issue: API CORS errors
**Solution**: Ensure API endpoint supports CORS or use a proxy service

### Issue: GitHub Actions permission denied
**Solution**: Enable "Read and write permissions" in Settings > Actions > General

## Example Project Structure

```
project/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── clientStorage.ts
│   └── clientApiClient.ts
├── public/
│   └── .nojekyll
├── next.config.js
├── package.json
└── README.md
```

## Testing Locally

```bash
# Development mode
npm run dev

# Build and preview
npm run build
npx serve out
```

## Related Skills
- `create-nextjs-app.md` - Creating Next.js applications
- `implement-localstorage.md` - Using localStorage for data persistence
- `github-actions-deployment.md` - CI/CD with GitHub Actions
- `client-side-api-calls.md` - Making API calls from the browser

## References
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
