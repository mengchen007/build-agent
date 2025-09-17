# CLAUDE.md

## 项目概述
**项目名称**: build-agent
**项目类型**: Vue 3 + Vite 多模态AI分析应用
**主要功能**: 基于视频监控的能源效率和会议室使用分析

## 技术栈
- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **样式**: TailwindCSS 4.1.13
- **UI组件**: Radix Vue, Lucide Vue Next
- **工具库**: VueUse, Class Variance Authority

## 项目结构
```
src/
├── components/
│   ├── ui/                    # 基础UI组件
│   │   ├── card/             # 卡片组件
│   │   ├── input/            # 输入组件
│   │   └── button/           # 按钮组件
│   ├── CenterPanel.vue       # 中间分析面板
│   ├── LeftPanel.vue         # 左侧视频上传面板
│   └── IntelligentThinkingProcess.vue  # 智能思考过程组件
├── assets/                   # 静态资源
└── App.vue                   # 主应用组件
```

## 核心功能模块

### 1. 视频上传与监控接入 (LeftPanel.vue)
- 支持拖拽上传视频文件 (MP4, AVI, MOV)
- 监控点选择和管理
- 视频预览和信息显示
- 文件格式验证和大小显示

### 2. 能源效率分析 (CenterPanel.vue)
- 多模态AI分析处理
- 实时分析状态显示
- 帧轮播和信息提取
- 深度学习模型集成
- 综合评估报告生成

### 3. 智能思考过程 (IntelligentThinkingProcess.vue)
- AI思考过程可视化
- 分析步骤展示
- 智能推理链条

## 开发命令
```bash
# 开发环境
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 安装依赖
npm install

# 类型检查 (如果需要)
npm run typecheck

# 代码检查 (如果需要)
npm run lint
```

## 开发规范

### Vue组件开发
- 使用Composition API (`<script setup>`)
- 响应式数据使用 `ref()` 和 `reactive()`
- 生命周期钩子使用 `onMounted()` 等
- 组件命名使用PascalCase

### 样式规范
- 使用TailwindCSS进行样式开发
- 自定义样式使用scoped样式
- 响应式设计优先
- 深色主题设计

### 文件命名
- 组件文件：PascalCase.vue
- 工具文件：camelCase.js
- 样式文件：kebab-case.css

## 新功能开发指南

### 添加新的分析场景
1. 在 `src/components/` 下创建新的分析组件
2. 参考 `CenterPanel.vue` 的结构实现分析逻辑
3. 添加相应的提示词和分析模板
4. 集成到主界面的场景切换中

### 扩展UI组件
1. 在 `src/components/ui/` 下添加新组件
2. 使用Radix Vue作为基础构建无障碍组件
3. 应用TailwindCSS进行样式定制
4. 确保组件的响应式和主题兼容性

### 数据流管理
- 组件间通信使用props/emit
- 复杂状态考虑使用Pinia状态管理
- 异步数据处理使用async/await
- 错误处理使用try/catch

## 部署配置
- 构建输出目录：`dist/`
- 静态资源处理通过Vite自动优化
- 支持现代浏览器和ES2015+
- 自动代码分割和懒加载

## 注意事项
- 视频文件处理需要考虑浏览器兼容性
- 大文件上传可能需要分片处理
- AI分析功能为模拟实现，实际部署需要后端API支持
- 监控接入功能为前端展示，实际使用需要摄像头权限和设备集成

## 已知问题
- 图片资源加载失败时会显示Canvas生成的占位图
- 视频分析为前端模拟，实际需要AI服务器支持
- 响应式布局在小屏幕设备上可能需要进一步优化