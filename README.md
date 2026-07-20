# MLZ ORBIT

一个基于 Astro 的静态技术博客，以深色技术档案和编辑式阅读呈现智算现场、AI Agent 与本地自动化项目。

## 已包含

- 清晰的顶部导航、能力关系图和证据型首页。
- Markdown 内容集合、文章目录、标签、上一篇与下一篇。
- 八个已有产物与六个建设方向分区展示，路线包含最近动作、里程碑和验收标准。
- 结构化项目证据、脱敏验证摘要和自动关联的技术文章。
- 本地文章搜索、RSS、Sitemap、Open Graph 分享图和自定义 404。
- 响应式顶部导航、键盘焦点样式和减弱动效适配。

## 本地运行

```bash
pnpm install
pnpm dev
```

开发地址默认为 `http://localhost:4321`。

生产构建后可本地检查静态产物：

```bash
pnpm build
pnpm preview
```

## 质量检查

```bash
pnpm check
pnpm test
pnpm build
```

## GitHub Pages 发布

正式站点发布到 `https://orbit.lyhapi.com`。推送到 `main` 后，GitHub Actions 会依次运行测试、类型检查和正式构建，全部通过后再更新 Pages。

自定义域名由 GitHub Pages 管理 `orbit.lyhapi.com`，私人控制台使用 `https://console.lyhapi.com`。如果仓库变量 `PUBLIC_ORBIT_CONSOLE_URL` 未设置，工作流会使用这个私人控制台地址作为默认值。

也可以在仓库的 Actions 页面手动运行 `Deploy to GitHub Pages` 工作流。

## 新增文章

在 `src/content/posts/` 新建 Markdown 文件，并填写标题、描述、发布日期、栏目、标签、草稿状态和精选状态。需要关联项目时填写对应的 `project` slug。

## 新增项目

在 `src/data/projects.ts` 增加项目记录。`case` 项目必须包含问题、方法、决策、结果、下一步、验证日期和结构化证据；`roadmap` 项目必须包含阶段、最近动作、里程碑、验收标准和计划产物。公开内容只能使用脱敏后的能力、状态和证据，不得复制客户数据、运行日志、认证信息或本地私人路径。

其他部署环境通过 `SITE_URL` 设置正式网址：

```bash
SITE_URL="$SITE_URL" pnpm build
```
