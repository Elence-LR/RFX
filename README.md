# 思政教育评估标准学习平台

思想政治教育评估标准跨学科融合教学平台，覆盖课前、课中、课后全流程。

## 功能模块

### 课前预习
- 课前问卷（兴趣点 + 困惑点）→ 自动生成词云图
- 三种学习方式（视频 / 文字 / 图片）→ 各国评估标准发展现状
- 跨学科资源包（教育学、社会学、心理学）

### 课中实践
- 情景导入：志愿服务类思政教育评估改革案例
- AI学伴「小思」：动画形象 + 智能对话，收集各国成功经验
- 方案提交与评审：组长提交优化方案书，平台自动评分并给出改进建议

### 课后拓展
- AI美化方案书：规范化格式、附录索引
- 三重评价：自评 + 互评 + AI学伴评

## 快速开始

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:5173

## 在线访问

https://elence-lr.github.io/RFX/

## 技术栈

- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- Framer Motion（动画）
- react-wordcloud（词云图）
- React Router（路由）

## 构建部署

```bash
npm run build
npm run preview
```

构建产物在 `dist/` 目录，可部署到任意静态服务器。
