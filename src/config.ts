export const site = {
  title: "MLZ ORBIT",
  subtitle: "AI Agent × 智算现场运维 × 自动化工具实验室",
  description: "记录智算现场、AI Agent、Skills 和本地自动化工具的真实项目与技术文章。",
  author: "MLZ"
};

export const categories = [
  { slug: "compute-ops", label: "智算现场运维", short: "算力", tone: "blue" },
  { slug: "agents", label: "AI Agent 与 Skills", short: "Agent", tone: "cyan" },
  { slug: "apex", label: "MiMoClaw / APEX", short: "APEX", tone: "violet" },
  { slug: "automation", label: "本地自动化工具", short: "工具", tone: "green" },
  { slug: "dev-log", label: "项目开发日志", short: "日志", tone: "amber" }
] as const;
