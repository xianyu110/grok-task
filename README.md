# Grok Tasks Manager - 纯前端版本

一个基于 Next.js 构建的 Grok 自动化任务管理平台，纯前端实现，可部署到 GitHub Pages。

[![Deploy to GitHub Pages](https://github.com/xianyu110/grok-task/actions/workflows/deploy.yml/badge.svg)](https://github.com/xianyu110/grok-task/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**在线演示**: [https://xianyu110.github.io/grok-task/](https://xianyu110.github.io/grok-task/)

## ⚠️ 重要说明：纯前端 + 中转 API

本项目是**纯前端应用**，无需后端服务器：

- 💾 **数据存储**：使用浏览器 localStorage，数据保存在本地
- 🌐 **中转 API**：推荐使用 `https://apipro.maynor1024.live/v1`
- 🔑 **自定义密钥**：API 密钥可填写任意字符串
- ✅ **无需服务器**：可部署到 GitHub Pages、Vercel、Netlify 等
- 🚀 **开箱即用**：打开网页即可使用，无需后端配置

> **配置方式**：首次使用点击右上角「API 设置」按钮，填写任意 API 密钥和中转地址即可

## ✨ 功能特性

- ✅ **任务管理**：创建、编辑、删除和执行 Grok 任务
- ✅ **预设模板库**：5 个开箱即用的任务模板
  - X 热帖监控
  - AI 技术追踪
  - 竞品动态监控
  - 行业大V追踪
  - AI 提示词收集
- ✅ **优雅的交互体验**：Toast 通知、实时状态更新、响应式设计
- ✅ **智能错误处理**：30秒超时控制、友好的错误提示、网络异常处理
- ✅ **本地存储**：数据保存在浏览器 localStorage
- ✅ **纯前端**：无需后端服务器
- ✅ **一键部署到 GitHub Pages**
- ✅ **现代化 UI**：使用 Tailwind CSS 和 Lucide Icons
- ✅ **性能优化**：React Hooks 优化、组件懒加载

## 🛠 技术栈

- **框架**: Next.js 14 + TypeScript (Static Export)
- **样式**: Tailwind CSS
- **部署**: GitHub Pages / Vercel / Netlify
- **存储**: localStorage（浏览器本地存储）
- **API**: Grok API (通过中转服务)
- **性能**: React useCallback/useMemo 优化

## 快速开始

### 1. 克隆项目

\`\`\`bash
git clone https://github.com/xianyu110/grok-task.git
cd grok-task
\`\`\`

### 2. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 3. 本地开发

\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:3000/grok-task

> **注意**：由于配置了 `basePath`，本地开发需要访问 `/grok-task` 路径

### 4. 构建静态文件

\`\`\`bash
npm run build
\`\`\`

构建后的静态文件在 \`out\` 目录

## 部署到 GitHub Pages

### 方式一：手动部署

1. **构建项目**

\`\`\`bash
npm run build
\`\`\`

2. **推送 out 目录到 gh-pages 分支**

\`\`\`bash
# 安装 gh-pages 工具
npm install -g gh-pages

# 部署到 GitHub Pages
gh-pages -d out
\`\`\`

3. **配置 GitHub Pages**
   - 进入 GitHub 仓库 Settings > Pages
   - Source 选择 \`gh-pages\` 分支
   - 保存后等待部署完成

### 方式二：GitHub Actions 自动部署（推荐）✨

本项目已配置 GitHub Actions 自动部署，只需：

1. **确保仓库已配置 GitHub Pages**
   - 进入 GitHub 仓库 Settings > Pages
   - Source 选择 `GitHub Actions`

2. **推送代码到 main 分支**
   \`\`\`bash
   git add .
   git commit -m "your commit message"
   git push origin main
   \`\`\`

3. **自动部署**
   - GitHub Actions 会自动构建并部署
   - 约 1-2 分钟后即可访问：https://xianyu110.github.io/grok-task/

4. **查看部署状态**
   - 访问 Actions 页面：https://github.com/xianyu110/grok-task/actions

## 使用说明

### 首次配置

1. 打开网站后，点击右上角的「**API 设置**」按钮
2. 填写配置：
   - **API 密钥**：任意字符串（如：\`sk-my-key-123456\`）
   - **API 地址**：\`https://apipro.maynor1024.live/v1\`
   - **模型名称**：\`grok-4.1-fast\`
3. 点击「保存配置」

### 创建任务

1. 点击「从模板创建任务」按钮
2. 选择一个预设模板
3. 任务将自动创建并显示在任务列表中

### 执行任务

- **手动执行**：点击任务卡片上的「播放」按钮
- 任务会调用 Grok API 并显示结果
- 执行历史会保存在浏览器 localStorage

### 管理任务

- **暂停/启动**：点击「暂停」按钮
- **删除**：点击「垃圾桶」图标
- **查看历史**：点击「历史」按钮
- **查看状态**：任务状态实时显示

## 项目结构

\`\`\`
grok-task/
├── app/
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 主页面（纯客户端）
│   └── globals.css        # 全局样式
├── lib/
│   ├── clientGrokClient.ts    # 浏览器端 Grok API 客户端
│   ├── clientStorage.ts       # localStorage 存储管理
│   └── templates.ts           # 预设模板
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions 自动部署
├── next.config.js             # Next.js 配置（静态导出）
├── tailwind.config.ts         # Tailwind 配置
└── package.json
\`\`\`

## 其他部署方式

### Vercel

1. 导入 GitHub 仓库到 Vercel
2. 自动检测为 Next.js 项目
3. 点击 Deploy

### Netlify

1. 在 Netlify 导入 GitHub 仓库
2. Build command: \`npm run build\`
3. Publish directory: \`out\`
4. 点击 Deploy

### 本地预览

\`\`\`bash
# 构建
npm run build

# 使用 serve 预览（需要安装 serve）
npx serve out
\`\`\`

## ❓ 常见问题

**Q: 数据会丢失吗？**
A: 数据保存在浏览器 localStorage，清除浏览器数据会丢失。建议定期导出重要任务的提示词。

**Q: 为什么需要配置 API？**
A: 本项目是纯前端应用，需要在浏览器中直接调用 Grok API。推荐使用中转服务，API 密��可自定义。

**Q: 可以使用官方 Grok API 吗？**
A: 可以，但需要真实的 API Key。推荐使用中转服务更方便。

**Q: 支持定时任务吗？**
A: 当前版本不支持自动定时执行（因为是纯前端）。需要手动点击执行按钮。

**Q: 如何添加更多模板？**
A: 编辑 \`lib/templates.ts\` 文件，添加新的模板配置。

**Q: 跨设备同步吗？**
A: 不支持。数据存储在当前浏览器的 localStorage，不会跨设备同步。

**Q: 本地开发访问 404？**
A: 由于配置了 `basePath: '/grok-task'`，本地开发需要访问 `http://localhost:3000/grok-task`

**Q: GitHub Pages 部署后样式丢失？**
A: 确保 `public/.nojekyll` 文件存在，并等待 GitHub Pages 完全部署（可能需要几分钟）

## 技术原理

### 为什么可以部署到 GitHub Pages？

1. **静态导出**：使用 Next.js 的 \`output: 'export'\` 配置
2. **无后端依赖**：所有 API 调用在浏览器端完成
3. **localStorage**：数据存储在用户浏览器本地
4. **CORS 友好**：中转 API 支持跨域请求

### 数据存储方案

```typescript
// 任务存储在 localStorage
localStorage.setItem('grok_tasks', JSON.stringify(tasks));

// API 配置存储在 localStorage
localStorage.setItem('grok_api_config', JSON.stringify(config));

// 执行历史存储在 localStorage
localStorage.setItem('grok_executions', JSON.stringify(executions));
```

## 🚀 最近更新

### v1.1.0 (2025-01-12)
- ✨ 优化用户体验：用 Toast 通知替代 alert 弹窗
- ⚡ 性能优化：使用 React useCallback/useMemo 减少重新渲染
- 🛡️ 增强错误处理：添加 30 秒超时控制和友好错误提示
- ✅ 代码质量：改进类型安全和错误边界处理
- 📱 改进响应式设计和交互体验

## 🎯 升级建议

### 云端存储

如果需要跨设备同步，可以集成：
- Firebase Realtime Database
- Supabase
- Cloudflare KV

### PWA 支持

添加 Service Worker，支持离线使用：
```bash
npm install next-pwa
```

### 数据导入导出

添加导出 JSON 功能，方便备份和迁移。

### 定时任务

可以集成浏览器 Notification API 或 Service Worker 实现定时提醒。

## License

MIT

## 支持

- **GitHub**: https://github.com/xianyu110/grok-task
- **问题反馈**: 提交 Issue
- **贡献代码**: 提交 Pull Request

---

## 致谢

感谢 [@卡尔的AI沃茨](https://github.com/kaier) 的创意和灵感！

本项目基于文章《马斯克都爱用的Grok定时任务，治好了我的信息焦虑》的思路实现。
