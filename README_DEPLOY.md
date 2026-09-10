# Grok Tasks Manager

一个基于 Next.js 构建的 Grok 自动化任务管理平台，可部署到 Vercel。

## ⚠️ 重要说明：使用中转 API

本项目使用**中转 API 服务**，无需真实的 Grok API Key：

- 🌐 **中转 API 地址**：`https://tryallapi.com/v1`
- 🔑 **API 密钥**：可自定义任意字符串（无需官方 API Key）
- ✅ **无需 X Premium 订阅**
- 🚀 **开箱即用，配置简单**

> **配置示例**：只需在环境变量中设置 `GROK_API_BASE=https://tryallapi.com/v1`，API Key 可以填任意字符串

## 功能特性

- ✅ **任务管理**：创建、编辑、删除和执行 Grok 任务
- ✅ **预设模板库**：5 个开箱即用的任务模板
  - X 热帖监控
  - AI 技术追踪
  - 竞品动态监控
  - 行业大V追踪
  - AI 提示词收集
- ✅ **一键部署到 Vercel**
- ✅ **现代化 UI**：使用 Tailwind CSS 和 Lucide Icons

## 技术栈

- **框架**: Next.js 14 + TypeScript
- **样式**: Tailwind CSS
- **部署**: Vercel
- **存储**: 内存存储（可升级到 Vercel KV）
- **API**: Grok API (OpenAI 兼容)

## 快速开始

### 1. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 2. 配置环境变量

⚠️ **重要：本项目使用中转 API 服务**

创建 \`.env.local\` 文件：

\`\`\`env
# 🔑 API 密钥（可自定义任意字符串，无需真实 Grok API Key）
GROK_API_KEY=your-custom-api-key

# 🌐 中转 API 地址（必须使用此地址）
GROK_API_BASE=https://tryallapi.com/v1

# 🤖 模型名称
GROK_MODEL=grok-4.1-fast
\`\`\`

**配置说明：**
- \`GROK_API_KEY\`: 密钥可自定义，填写任意字符串即可（例如：\`sk-my-custom-key-123456\`）
- \`GROK_API_BASE\`: 必须使用中转 API 地址 \`https://tryallapi.com/v1\`
- \`GROK_MODEL\`: 推荐使用 \`grok-4.1-fast\`，速度快且效果好

### 3. 本地开发

\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:3000

## 部署到 Vercel

### 方式一：通过 Vercel CLI

\`\`\`bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
\`\`\`

### 方式二：通过 GitHub（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel Dashboard](https://vercel.com) 导入项目
3. 配置环境变量（重要！）：
   - \`GROK_API_KEY\`: 自定义任意字符串（如：\`sk-my-key-123\`）
   - \`GROK_API_BASE\`: **必须填写** \`https://tryallapi.com/v1\`
   - \`GROK_MODEL\`: \`grok-4.1-fast\`
4. 点击 Deploy

> 💡 **提示**：环境变量中的 API Key 可以是任意字符串，因为使用的是中转 API 服务

### 方式三：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/grok-task)

## 使用说明

### 创建任务

1. 点击「从模板创建任务」按钮
2. 选择一个预设模板
3. 任务将自动创建并显示在任务列表中

### 执行任务

- **手动执行**：点击任务卡片上的「播放」按钮
- **自动执行**：配置定时任务（需要额外的 Cron 服务）

### 管理任务

- **暂停/启动**：点击「暂停」按钮
- **删除**：点击「垃圾桶」图标
- **查看状态**：任务状态实时显示

## 定时任务说明

当前版本使用内存存储，不支持真正的定时执行。要实现定时功能，有以下方案：

### 方案一：Vercel Cron Jobs

在 \`vercel.json\` 中配置：

\`\`\`json
{
  "crons": [
    {
      "path": "/api/cron/execute-tasks",
      "schedule": "0 * * * *"
    }
  ]
}
\`\`\`

### 方案二：外部 Cron 服务

使用 [cron-job.org](https://cron-job.org) 或类似服务定期调用 API：

\`\`\`
POST https://your-app.vercel.app/api/tasks/{taskId}/execute
\`\`\`

### 方案三：Vercel KV + Background Jobs

升级存储到 Vercel KV，配合 Vercel 的 Background Functions。

## 项目结构

\`\`\`
grok-task/
├── app/
│   ├── api/              # API Routes
│   │   ├── tasks/        # 任务 CRUD
│   │   └── templates/    # 模板列表
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 主页面
│   └── globals.css       # 全局样式
├── lib/
│   ├── grokClient.ts     # Grok API 客户端
│   ├── storage.ts        # 数据存储
│   └── templates.ts      # 预设模板
├── .env.local            # 环境变量
├── next.config.js        # Next.js 配置
├── tailwind.config.ts    # Tailwind 配置
└── vercel.json           # Vercel 配置
\`\`\`

## API 端点

### 任务管理

- \`GET /api/tasks\` - 获取所有任务
- \`POST /api/tasks\` - 创建新任务
- \`GET /api/tasks/[id]\` - 获取单个任务
- \`PUT /api/tasks/[id]\` - 更新任务
- \`DELETE /api/tasks/[id]\` - 删除任务
- \`POST /api/tasks/[id]/execute\` - 执行任务
- \`GET /api/tasks/[id]/executions\` - 获取执行历史

### 模板

- \`GET /api/templates\` - 获取所有模板

## 升级建议

### 持久化存储

当前使用内存存储，重启后数据会丢失。升级方案：

1. **Vercel KV**（推荐）
\`\`\`bash
npm install @vercel/kv
\`\`\`

2. **Vercel Postgres**
\`\`\`bash
npm install @vercel/postgres
\`\`\`

3. **外部数据库**（MongoDB, PostgreSQL, etc.）

### 真正的定时任务

- 集成 Vercel Cron Jobs
- 或使用 Upstash QStash

### 用户认证

- 集成 NextAuth.js
- 或使用 Clerk / Auth0

### 通知系统

- 邮件通知（SendGrid / Resend）
- Webhook 通知

## 常见问题

**Q: 为什么任务不会自动执行？**
A: 当前版本只支持手动执行。需要配置 Cron 服务实现定时执行。

**Q: 数据会丢失吗？**
A: 是的，当前使用内存存储。部署后建议升级到 Vercel KV。

**Q: 如何添加更多模板？**
A: 编辑 \`lib/templates.ts\` 文件，添加新的模板配置。

**Q: 支持多用户吗？**
A: 当前不支持。需要添加用户认证系统。

## License

MIT

## 支持

如有问题，请提交 Issue 或 Pull Request。
