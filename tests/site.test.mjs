import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const execFileAsync = promisify(execFile);
const projectModule = await import(new URL("../src/data/projects.ts", import.meta.url));
const { projects, caseProjects, roadmapProjects } = projectModule;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else files.push(absolute);
  }
  return files;
}

test("关键页面、组件和公开证据已经建立", async () => {
  const requiredText = [
    ".github/workflows/deploy-pages.yml",
    "src/pages/index.astro",
    "src/pages/archive.astro",
    "src/pages/about.astro",
    "src/pages/projects/index.astro",
    "src/pages/projects/[slug].astro",
    "src/pages/posts/[...slug].astro",
    "src/pages/category/[slug].astro",
    "src/pages/404.astro",
    "src/components/ComputeOpsHub.astro",
    "src/components/ComputeOpsTopicIndex.astro",
    "src/components/EvidenceGrid.astro",
    "src/components/HomeActivityStream.astro",
    "src/components/HomeEvidenceRail.astro",
    "src/components/ProjectList.astro",
    "src/components/ProjectRoadmap.astro",
    "src/components/Reader.astro",
    "src/components/SiteHead.astro",
    "src/components/TopicIndex.astro",
    "public/evidence/onsite-compute-ops/validation-summary.svg",
    "public/evidence/agentic-toolbox/test-summary.svg",
    "public/evidence/bitcoin-prediction-radar/validation-summary.svg",
    "public/evidence/agenth-specability/completion-gate.svg",
    "public/og-image.svg"
  ];
  for (const relative of requiredText) {
    const content = await readFile(new URL(relative, root), "utf8");
    assert.ok(content.length > 100, `${relative} 内容不足`);
  }

  for (const relative of ["public/og-image.png", "public/evidence/bitcoin-prediction-radar/btc-price-history.png"]) {
    const image = await readFile(new URL(relative, root));
    assert.ok(image.length > 1000, `${relative} 不能为空`);
  }
});

test("GitHub Pages 发布先通过质量门禁并使用正式站点地址", async () => {
  const workflow = await readFile(new URL(".github/workflows/deploy-pages.yml", root), "utf8");
  const projectRoot = path.resolve(fileURLToPath(root));
  const { stdout: gitRoot } = await execFileAsync("git", ["rev-parse", "--show-toplevel"], { cwd: projectRoot });

  assert.equal(path.resolve(gitRoot.trim()), projectRoot, "博客必须作为独立 Git 仓库发布");
  assert.match(workflow, /SITE_URL: https:\/\/adminlmz\.github\.io/);
  assert.match(workflow, /pnpm test/);
  assert.match(workflow, /pnpm check/);
  assert.match(workflow, /pnpm build/);
  assert.match(workflow, /actions\/checkout@v7/);
  assert.match(workflow, /pnpm\/action-setup@v6/);
  assert.match(workflow, /actions\/setup-node@v7/);
  assert.match(workflow, /actions\/configure-pages@v6/);
  assert.match(workflow, /actions\/upload-pages-artifact@v5/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
  assert.match(workflow, /needs: build/);
  assert.match(workflow, /path: dist/);
  assert.doesNotMatch(workflow, /secrets\./);
});

test("五个栏目都有真实文章并关联现有项目", async () => {
  const postsDir = new URL("src/content/posts/", root);
  const posts = (await readdir(postsDir)).filter((name) => name.endsWith(".md"));
  assert.equal(posts.length, 5);

  const categories = new Set();
  const projectSlugs = new Set(projects.map((project) => project.slug));
  for (const post of posts) {
    const content = await readFile(new URL(post, postsDir), "utf8");
    for (const field of ["title:", "description:", "published:", "category:", "tags:", "draft:", "featured:", "project:"]) {
      assert.match(content, new RegExp(`^${field}`, "m"), `${post} 缺少 ${field}`);
    }
    const category = content.match(/^category:\s*([^\s]+)$/m)?.[1];
    const project = content.match(/^project:\s*([^\s]+)$/m)?.[1];
    assert.ok(category, `${post} 栏目无法解析`);
    assert.ok(project && projectSlugs.has(project), `${post} 关联了不存在的项目 ${project}`);
    categories.add(category);
  }

  assert.deepEqual(categories, new Set(["compute-ops", "agents", "apex", "automation", "dev-log"]));
});

test("八个已有产物和六个建设方向使用不同数据合同", () => {
  assert.equal(projects.length, 14);
  assert.equal(caseProjects.length, 8);
  assert.equal(roadmapProjects.length, 6);
  assert.equal(new Set(projects.map((project) => project.slug)).size, 14);

  const caseStatuses = new Set(["可运行", "接近成品", "研究原型", "一次性交付物"]);
  for (const project of caseProjects) {
    assert.ok(caseStatuses.has(project.status), `${project.slug} 使用了非真实项目状态`);
    for (const field of ["problem", "nextStep", "verifiedAt", "privacyNote"]) {
      assert.ok(project[field]?.length > 8, `${project.slug} 缺少 ${field}`);
    }
    for (const field of ["stack", "approach", "decisions", "outcomes", "evidence"]) {
      assert.ok(Array.isArray(project[field]) && project[field].length > 0, `${project.slug} 缺少 ${field}`);
    }
    for (const item of project.evidence) {
      assert.ok(item.type && item.label && item.detail && item.verifiedAt, `${project.slug} 有不完整证据`);
    }
    if (project.featured) {
      assert.ok(project.evidence.some((item) => item.href), `${project.slug} 是重点案例却没有公开证据链接`);
    }
  }

  const roadmapStatuses = new Set(["未开始", "资料整理", "验证中", "已形成公开产物"]);
  for (const project of roadmapProjects) {
    assert.ok(roadmapStatuses.has(project.status), `${project.slug} 使用了非路线状态`);
    assert.ok([1, 2, 3].includes(project.phase), `${project.slug} 缺少有效阶段`);
    assert.ok(project.motivation.length > 16, `${project.slug} 缺少为什么要做`);
    assert.ok(project.currentAction.length > 8, `${project.slug} 缺少最近动作`);
    assert.ok(project.milestones.length >= 3, `${project.slug} 里程碑不足`);
    assert.ok(project.acceptanceCriteria.length >= 3, `${project.slug} 验收标准不足`);
    assert.ok(project.plannedArtifacts.length >= 3, `${project.slug} 计划产物不足`);
    assert.equal("outcomes" in project, false, `${project.slug} 规划项目不应声明完成结果`);
    assert.equal("evidence" in project, false, `${project.slug} 规划项目不应伪装成已有证据`);
  }
});

test("项目中的公开证据链接都指向实际文件或文章", async () => {
  for (const project of caseProjects) {
    for (const item of project.evidence.filter((evidence) => evidence.href)) {
      if (item.href.startsWith("/evidence/")) {
        const content = await readFile(new URL(`public${item.href}`, root));
        assert.ok(content.length > 100, `${project.slug} 的证据文件为空: ${item.href}`);
      } else if (item.href.startsWith("/posts/")) {
        const slug = item.href.split("/").filter(Boolean).at(-1);
        const content = await readFile(new URL(`src/content/posts/${slug}.md`, root), "utf8");
        assert.ok(content.length > 100, `${project.slug} 的文章证据为空: ${item.href}`);
      } else {
        assert.fail(`${project.slug} 使用了未检查的证据链接 ${item.href}`);
      }
    }
  }
});

test("项目索引和详情明确区分案例与路线", async () => {
  const index = await readFile(new URL("src/pages/projects/index.astro", root), "utf8");
  const detail = await readFile(new URL("src/pages/projects/[slug].astro", root), "utf8");
  const roadmap = await readFile(new URL("src/components/ProjectRoadmap.astro", root), "utf8");

  assert.match(index, /caseProjects/);
  assert.match(index, /roadmapProjects/);
  assert.match(index, /ProjectRoadmap/);
  assert.match(index, /已形成产物/);
  assert.match(index, /作品建设路线/);
  assert.doesNotMatch(index, /<ProjectList projects=\{projects\}/);

  assert.match(detail, /project\.kind === "case"/);
  assert.match(detail, /project\.kind === "roadmap"/);
  assert.match(detail, /EvidenceGrid/);
  assert.match(detail, /为什么要做/);
  assert.match(detail, /建设里程碑/);
  assert.match(detail, /验收标准/);
  assert.match(detail, /post\.data\.project === project\.slug/);
  assert.match(detail, /noopener noreferrer/);
  assert.doesNotMatch(detail, /<main(?:\s|>)/, "项目详情不能在全站主地标中再次嵌套 main");
  assert.match(roadmap, /最近动作/);
  assert.match(roadmap, /通过条件/);
});

test("首页融合作者身份、项目证据和编辑时间流", async () => {
  const page = await readFile(new URL("src/pages/index.astro", root), "utf8");
  const evidenceRail = await readFile(new URL("src/components/HomeEvidenceRail.astro", root), "utf8");
  const activityStream = await readFile(new URL("src/components/HomeActivityStream.astro", root), "utf8");
  const topicIndex = await readFile(new URL("src/components/TopicIndex.astro", root), "utf8");
  const roadmap = await readFile(new URL("src/components/ProjectRoadmap.astro", root), "utf8");

  const visiblePage = page.replace(/<[^>]+>/g, "");
  assert.match(visiblePage, /把复杂现场，做成可复核的系统/);
  assert.match(page, /HomeEvidenceRail/);
  assert.match(page, /HomeActivityStream/);
  assert.match(page, /TopicIndex/);
  assert.match(page, /ProjectList/);
  assert.match(page, /ProjectRoadmap/);
  assert.doesNotMatch(page, /CapabilityMap|home-stats|Technical field notes|Selected cases|Latest notes|Work in progress|Writing areas/);

  const evidencePosition = page.indexOf("<HomeEvidenceRail");
  const projectsPosition = page.indexOf("<ProjectList");
  const activityPosition = page.indexOf("<HomeActivityStream");
  const roadmapPosition = page.indexOf("<ProjectRoadmap");
  assert.ok(evidencePosition > 0 && evidencePosition < projectsPosition, "首屏证据必须先于代表项目");
  assert.ok(projectsPosition < activityPosition, "代表项目必须先于最近产出");
  assert.ok(activityPosition < roadmapPosition, "最近产出必须先于路线摘要");
  assert.ok(page.indexOf('"agentic-toolbox", 0') < page.indexOf('"onsite-compute-ops", 1'), "Agentic Toolbox 必须是首页主案例");

  for (const project of caseProjects.filter((item) => item.featured)) {
    assert.ok(project.evidence.some((item) => item.href), `${project.slug} 缺少首页可用证据`);
  }
  assert.match(evidenceRail, /\.find\(\(evidence\) => evidence\.href\)/);
  assert.match(evidenceRail, /evidence\.verifiedAt/);
  assert.doesNotMatch(evidenceRail, /project\.verifiedAt/);

  assert.match(activityStream, /kind: "article" \| "evidence" \| "roadmap"/);
  assert.match(activityStream, /进行中/);
  assert.match(activityStream, /slice\(0, 6\)/);
  assert.match(activityStream, /published/);
  assert.match(activityStream, /verifiedAt/);
  assert.doesNotMatch(activityStream, /project\.featured/);
  assert.match(page, /caseProjects=\{featuredProjects\}/);

  const projectSlugs = new Set(projects.map((project) => project.slug));
  const postIds = new Set((await readdir(new URL("src/content/posts/", root))).map((name) => name.replace(/\.(md|mdx)$/, "")));
  const projectRefs = [...topicIndex.matchAll(/(?:projects|roadmap): \[([^\]]*)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
  const postRefs = [...topicIndex.matchAll(/posts: \[([^\]]*)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
  for (const slug of projectRefs) assert.ok(projectSlugs.has(slug), `主题索引引用了不存在的项目 ${slug}`);
  for (const id of postRefs) assert.ok(postIds.has(id), `主题索引引用了不存在的文章 ${id}`);
  assert.match(topicIndex, /长期专业主题/);
  assert.doesNotMatch(topicIndex, /href="#"|能力、项目与文章关系图/);

  assert.match(roadmap, /roadmap-phase-focus/);
  assert.match(roadmap, /currentAction/);
  assert.match(roadmap, /roadmap-phase-links/);
});

test("现场栏目聚合真实项目、问题入口、路线和跨栏目记录", async () => {
  const page = await readFile(new URL("src/pages/category/[slug].astro", root), "utf8");
  const hub = await readFile(new URL("src/components/ComputeOpsHub.astro", root), "utf8");
  const topicIndex = await readFile(new URL("src/components/ComputeOpsTopicIndex.astro", root), "utf8");

  assert.match(page, /ComputeOpsHub/);
  assert.match(page, /category\.slug === "compute-ops"/);
  assert.match(page, /post\.data\.category === "compute-ops"/);
  assert.match(page, /computeOpsProjectSlugs\.has\(post\.data\.project\)/);
  assert.match(page, /<PostList posts=\{posts\}/, "其他栏目必须继续使用通用文章列表");

  const computeOpsCases = caseProjects.filter((project) => project.category === "智算现场运维");
  const computeOpsRoadmaps = roadmapProjects.filter((project) => project.category === "智算现场运维");
  assert.equal(computeOpsCases.length, 2);
  assert.equal(computeOpsRoadmaps.length, 6);

  for (const marker of [
    "compute-hub-hero",
    "compute-hub-work",
    "compute-hub-topics",
    "compute-hub-roadmap",
    "compute-hub-activity",
    "compute-hub-boundary"
  ]) assert.match(hub, new RegExp(marker));

  const workPosition = hub.indexOf("compute-hub-work");
  const topicsPosition = hub.indexOf("compute-hub-topics");
  const roadmapPosition = hub.indexOf("compute-hub-roadmap");
  const activityPosition = hub.indexOf("compute-hub-activity");
  const boundaryPosition = hub.indexOf("compute-hub-boundary");
  assert.ok(workPosition > 0 && workPosition < topicsPosition, "已有项目必须先于排障主题");
  assert.ok(topicsPosition < roadmapPosition, "排障主题必须先于建设路线");
  assert.ok(roadmapPosition < activityPosition, "建设路线必须先于最近记录");
  assert.ok(activityPosition < boundaryPosition, "最近记录必须先于公开边界");
  assert.match(hub, /ProjectRoadmap/);
  assert.match(hub, /HomeActivityStream/);
  assert.match(hub, /caseProjects=\{caseProjects\}/);
  assert.match(hub, /\.length/);
  assert.doesNotMatch(hub, /href="#"/);

  const topicSlugs = [...topicIndex.matchAll(/roadmap: "([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(new Set(topicSlugs), new Set(computeOpsRoadmaps.map((project) => project.slug)));
  assert.equal(topicSlugs.length, 6);
  assert.match(topicIndex, /h200-three-visibility-layers/);
  assert.match(topicIndex, /throw new Error/);
});

test("全局样式不再依赖旧首页与旧项目网格覆盖", async () => {
  const css = await readFile(new URL("src/styles/global.css", root), "utf8");
  const source = (await Promise.all((await walk(fileURLToPath(new URL("src/", root))))
    .filter((name) => /\.(astro|ts)$/.test(name))
    .map((file) => readFile(file, "utf8")))).join("\n");

  assert.doesNotMatch(css, /Completion pass/);
  assert.doesNotMatch(css, /\.(?:home-hero-visual|hero-image-frame|hero-image|hero-index|project-grid|project-item|project-index|capability-map)\b/);
  assert.doesNotMatch(source, /CapabilityMap|home-hero-visual|hero-image-frame|hero-index|project-grid|project-item|project-index/);
  assert.equal((css.match(/@media \(max-width: 900px\)/g) ?? []).length, 1, "900px 响应式规则必须集中在一处");
  assert.equal((css.match(/@media \(max-width: 620px\)/g) ?? []).length, 1, "620px 响应式规则必须集中在一处");
  assert.doesNotMatch(css, /backdrop-filter/, "导航不应恢复玻璃拟态模糊");
});

test("关于页说明公开身份、方法和边界且不伪造联系入口", async () => {
  const about = await readFile(new URL("src/pages/about.astro", root), "utf8");
  assert.match(about, /MLZ ORBIT/);
  assert.match(about, /工作方法/);
  assert.match(about, /当前建设路线/);
  assert.match(about, /公开边界/);
  assert.doesNotMatch(about, /archive-search/);
  assert.doesNotMatch(about, /mailto:|github\.com/);
});

test("公开内容不包含本地路径、密钥或公网地址", async () => {
  const roots = [new URL("src/", root), new URL("public/evidence/", root)];
  const files = (await Promise.all(roots.map((url) => walk(fileURLToPath(url))))).flat()
    .filter((file) => /\.(astro|md|ts|js|mjs|svg|json|css)$/i.test(file));
  const forbidden = [
    /\/Users\//,
    /(?:api[_-]?key|token|password)\s*[:=]\s*["'][^"']+/i,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\b(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-5])(?:\.(?:\d{1,3})){3}\b/
  ];
  for (const file of files) {
    const content = await readFile(file, "utf8");
    for (const pattern of forbidden) {
      assert.doesNotMatch(content, pattern, `${file} 命中敏感模式 ${pattern}`);
    }
  }
});

test("文章阅读显示作者、更新日期、项目入口和文章级 SEO", async () => {
  const page = await readFile(new URL("src/pages/posts/[...slug].astro", root), "utf8");
  const reader = await readFile(new URL("src/components/Reader.astro", root), "utf8");
  const head = await readFile(new URL("src/components/SiteHead.astro", root), "utf8");

  assert.match(page, /author=\{site\.author\}/);
  assert.match(page, /getProject/);
  assert.match(page, /project=\{project\}/);
  assert.match(page, /headings=\{headings\}/);
  assert.match(page, /ogType="article"/);
  assert.match(reader, /更新于/);
  assert.match(reader, /关联项目/);
  assert.match(reader, /本文目录/);
  assert.match(reader, /上一篇/);
  assert.match(reader, /下一篇/);
  assert.match(head, /og:image/);
  assert.match(head, /article:published_time/);
});

test("搜索、导航和详情页保留可访问语义", async () => {
  const archive = await readFile(new URL("src/pages/archive.astro", root), "utf8");
  const layout = await readFile(new URL("src/layouts/OrbitLayout.astro", root), "utf8");
  const shell = await readFile(new URL("src/components/OrbitShell.astro", root), "utf8");
  const projectsPage = await readFile(new URL("src/pages/projects/[slug].astro", root), "utf8");
  const css = await readFile(new URL("src/styles/global.css", root), "utf8");

  assert.match(archive, /aria-live="polite"/);
  assert.match(archive, /aria-label="打开《/);
  assert.match(archive, /\?\.label \?\?/);
  assert.match(layout, /skip-link/);
  assert.match(projectsPage, /<h1>\{project\.name\}<\/h1>/);
  for (const href of ["/projects/", "/archive/", "/about/"]) {
    assert.match(shell, new RegExp(`href: "${href.replaceAll("/", "\\/")}"`), `顶部导航缺少 ${href}`);
  }
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(layout, /MobileDock/);
});

test("公开页面不使用破折号装饰或旧星系文案", async () => {
  const files = await walk(fileURLToPath(new URL("src/", root)));
  for (const file of files.filter((name) => /\.(astro|md|ts)$/.test(name))) {
    const content = await readFile(file, "utf8");
    assert.doesNotMatch(content, /[—–]/, `${file} 包含禁止的破折号字符`);
  }

  const source = await Promise.all(files.filter((name) => /\.(astro|ts)$/.test(name)).map((file) => readFile(file, "utf8")));
  const joined = source.join("\n");
  assert.doesNotMatch(joined, /返回星系|轨道偏离|orbitLinks|FIELD NOTES/);
});
