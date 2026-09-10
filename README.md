# Grok Tasks Manager

<div align="center">

基于 Next.js 构建的 Grok 自动化任务管理平台，纯前端实现，支持多平台部署

[![Deploy to GitHub Pages](https://github.com/xianyu110/grok-task/actions/workflows/deploy.yml/badge.svg)](https://github.com/xianyu110/grok-task/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

**在线演示** · [GitHub Pages](https://xianyu110.github.io/grok-task/) · [一键部署到 Vercel](https://vercel.com/new/clone?repository-url=https://github.com/xianyu110/grok-task)

</div>

---

## ✨ 特性

### 🎯 核心功能

- **任务管理** - 创建、编辑、删除和执行 Grok 任务
- **预设模板** - 5 个开箱即用的任务模板
  - X 热帖监控
  - AI 技术追踪
  - 竞品动态监控
  - 行业大V追踪
  - AI 提示词收集
- **执行历史** - 完整的任务执行记录和历史追踪

### 💎 用户体验

- **优雅交互** - Toast 通知、实时状态更新、流畅动画
- **智能容错** - 30秒超时控制、友好的错误提示、网络异常处理
- **响应式设计** - 完美适配桌面端和移动端
- **现代化 UI** - Tailwind CSS + Lucide Icons

### ⚡ 技术亮点

- **零后端** - 纯前端实现，可部署到静态托管平台
- **本地存储** - 数据存储在浏览器 localStorage
- **性能优化** - React Hooks 优化、组件懒加载
- **类型安全** - 完整的 TypeScript 类型定义

---

## 🛠 技术栈

| 技术 | 说明 |
|------|------|
| **框架** | [Next.js 14](https://nextjs.org/) + TypeScript |
| **样式** | [Tailwind CSS](https://tailwindcss.com/) |
| **图标** | [Lucide Icons](https://lucide.dev/) |
| **部署** | GitHub Pages / Vercel / Netlify |
| **存储** | localStorage（浏览器本地存储） |
| **API** | Grok API (通过中转服务) |

---

## 🚀 快速开始

### 1️⃣ 克隆项目

```bash
git clone https://github.com/xianyu110/grok-task.git
cd grok-task
```

### 2️⃣ 安装依赖

```bash
npm install
```

### 3️⃣ 本地开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 4️⃣ 构建生产版本

```bash
npm run build
```

构建产物位于 `out` 目录

---

## 📦 部署指南

<details>
<summary><b>📘 GitHub Pages 部署</b></summary>

### 自动部署（推荐）

本项目已配置 GitHub Actions 自动部署：

1. **配置 GitHub Pages**
   - 进入仓库 `Settings` > `Pages`
   - Source 选择 `GitHub Actions`

2. **推送代码**
   ```bash
   git push origin main
   ```

3. **等待部署完成**
   - 访问 [Actions](https://github.com/xianyu110/grok-task/actions) 查看状态
   - 1-2 分钟后访问：https://xianyu110.github.io/grok-task/

### 手动部署

```bash
# 构建
npm run build

# 部署到 gh-pages 分支
npx gh-pages -d out
```

</details>

<details>
<summary><b>⚡ Vercel 部署（推荐）</b></summary>

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/xianyu110/grok-task)

### 手动部署

1. 访问 [vercel.com](https://vercel.com)
2. 点击 `New Project` 导入 GitHub 仓库
3. 自动检测 Next.js 配置，点击 `Deploy`
4. 30-60 秒后获得 `https://your-project.vercel.app`

#### ✨ Vercel 优势

- ⚡ **零配置** - 自动检测 Next.js
- 🌍 **全球 CDN** - 极速访问
- 🔒 **自动 HTTPS** - 免费 SSL
- 👀 **预览部署** - 每个 PR 自动生成预览
- 🚀 **无路径前缀** - 直接访问根路径

</details>

<details>
<summary><b>🌐 Netlify 部署</b></summary>

1. 在 Netlify 导入 GitHub 仓库
2. 配置：
   - Build command: `npm run build`
   - Publish directory: `out`
   - Environment variables: `DEPLOY_TARGET=netlify`
3. 点击 Deploy

</details>

---

## 📖 使用说明

### 首次配置

1. 打开网站后，点击右上角「**API 设置**」按钮
2. 填写配置：
   - **API 密钥**：任意字符串（如 `sk-my-key-123456`）
   - **API 地址**：`https://tryallapi.com/v1`
   - **模型名称**：`grok-4.1-fast`
3. 点击「保存配置」

### 创建任务

1. 点击「从模板创建任务」按钮
2. 选择一个预设模板
3. 任务自动创建并显示在列表中

### 执行任务

- **手动执行**：点击任务卡片上的「播放」按钮
- 任务会调用 Grok API 并显示结果
- 执行历史自动保存在浏览器

### 管理任务

| 操作 | 说明 |
|------|------|
| ⏸️ 暂停/启动 | 点击暂停按钮切换任务状态 |
| 🗑️ 删除 | 点击垃圾桶图标删除任务 |
| 📜 查看历史 | 点击历史按钮查看执行记录 |
| ▶️ 立即执行 | 点击播放按钮手动执行任务 |

---

## 📁 项目结构

```
grok-task/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 主页面（纯客户端）
│   └── globals.css             # 全局样式
├── lib/
│   ├── clientGrokClient.ts     # Grok API 客户端
│   ├── clientStorage.ts        # localStorage 存储管理
│   └── templates.ts            # 预设模板
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions 自动部署
├── public/
│   └── .nojekyll               # GitHub Pages 配置
├── next.config.js              # Next.js 配置
├── tailwind.config.ts          # Tailwind 配置
├── vercel.json                 # Vercel 配置
└── package.json
```

---

## ❓ 常见问题

### 数据相关

**Q: 数据会丢失吗？**
A: 数据保存在浏览器 localStorage，清除浏览器数据会丢失。建议定期导出重要任务的提示词。

**Q: 跨设备同步吗？**
A: 不支持。数据存储在当前浏览器的 localStorage，不会跨设备同步。

### API 相关

**Q: 为什么需要配置 API？**
A: 本项目是纯前端应用，需要在浏览器中直接调用 Grok API。推荐使用中转服务，API 密钥可自定义。

**Q: 可以使用官方 Grok API 吗？**
A: 可以，但需要真实的 API Key。推荐使用中转服务更方便。

### 功能相关

**Q: 支持定时任务吗？**
A: 当前版本不支持自动定时执行（因为是纯前端）。需要手动点击执行按钮。

**Q: 如何添加更多模板？**
A: 编辑 `lib/templates.ts` 文件，添加新的模板配置。

### 部署相关

**Q: 本地开发访问 404？**
A: 本地开发访问 `http://localhost:3000` 即可（无需 `/grok-task` 路径）

**Q: GitHub Pages 部署后样式丢失？**
A: 确保 `public/.nojekyll` 文件存在，并等待 GitHub Pages 完全部署（可能需要几分钟）

---

## 🔧 技术原理

### 为什么可以部署到 GitHub Pages？

1. **静态导出** - 使用 Next.js 的 `output: 'export'` 配置
2. **无后端依赖** - 所有 API 调用在浏览器端完成
3. **localStorage** - 数据存储在用户浏览器本地
4. **CORS 友好** - 中转 API 支持跨域请求

### 数据存储方案

```typescript
// 任务存储
localStorage.setItem('grok_tasks', JSON.stringify(tasks));

// API 配置存储
localStorage.setItem('grok_api_config', JSON.stringify(config));

// 执行历史存储
localStorage.setItem('grok_executions', JSON.stringify(executions));
```

---

## 📝 更新日志

### v1.1.0 (2025-01-12)

- ✨ **UI 优化** - 用 Toast 通知替代 alert 弹窗
- ⚡ **性能提升** - React useCallback/useMemo 优化
- 🛡️ **错误处理** - 30秒超时控制和友好错误提示
- 📱 **响应式** - 改进移动端适配和交互体验
- 🎨 **视觉层次** - 优化间距、折叠技术细节、改进空状态

### v1.0.0 (2025-01-11)

- 🎉 首次发布
- ✅ 基础任务管理功能
- ✅ 5 个预设模板
- ✅ GitHub Pages 自动部署

---

## 🎯 路线图

### 短期计划

- [ ] 数据导入/导出功能
- [ ] 更多任务模板
- [ ] 任务分类和标签

### 中期计划

- [ ] 云端存储同步（Firebase/Supabase）
- [ ] PWA 支持（离线使用）
- [ ] 定时任务（使用 Notification API）

### 长期计划

- [ ] 多语言支持
- [ ] 自定义主题
- [ ] 团队协作功能

---

## 📄 License

[MIT](LICENSE) © [xianyu110](https://github.com/xianyu110)

---

## 🙏 致谢

- 灵感来源：[@卡尔的AI沃茨](https://github.com/kaier)
- 基于文章：《马斯克都爱用的Grok定时任务，治好了我的信息焦虑》
- 技术栈：[Next.js](https://nextjs.org/) · [Tailwind CSS](https://tailwindcss.com/) · [Lucide](https://lucide.dev/)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐️**

[回到顶部](#grok-tasks-manager) · [报告问题](https://github.com/xianyu110/grok-task/issues) · [提交 PR](https://github.com/xianyu110/grok-task/pulls)

</div>
