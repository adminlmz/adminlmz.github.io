export type CaseProjectStatus = "可运行" | "接近成品" | "研究原型" | "一次性交付物";
export type RoadmapProjectStatus = "未开始" | "资料整理" | "验证中" | "已形成公开产物";
export type ProjectStatus = CaseProjectStatus | RoadmapProjectStatus;

export type EvidenceType = "test" | "validator" | "screenshot" | "chart" | "report" | "article" | "source-audit";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectEvidence {
  type: EvidenceType;
  label: string;
  detail: string;
  verifiedAt: string;
  href?: string;
}

interface ProjectBase {
  slug: string;
  name: string;
  summary: string;
  category: string;
  featured: boolean;
  privacyNote: string;
  nextStep: string;
}

export interface CaseProject extends ProjectBase {
  kind: "case";
  status: CaseProjectStatus;
  role?: string;
  stack: string[];
  timeframe?: string;
  verifiedAt: string;
  problem: string;
  approach: string[];
  decisions: string[];
  outcomes: string[];
  evidence: ProjectEvidence[];
  links?: ProjectLink[];
}

export interface ProjectMilestone {
  title: string;
  detail: string;
}

export interface RoadmapProject extends ProjectBase {
  kind: "roadmap";
  status: RoadmapProjectStatus;
  phase: 1 | 2 | 3;
  goal: string;
  motivation: string;
  currentAction: string;
  milestones: ProjectMilestone[];
  acceptanceCriteria: string[];
  plannedArtifacts: string[];
}

export type Project = CaseProject | RoadmapProject;

export const projects: Project[] = [
  {
    kind: "case",
    slug: "onsite-compute-ops",
    name: "现场算力运维 Agent",
    summary: "把 GPU、IB、RDMA、NCCL、告警与拓扑排查整理成一步一条命令的现场工作流。",
    status: "可运行",
    category: "智算现场运维",
    featured: true,
    role: "工作流、安全边界与验证合同设计",
    stack: ["Python", "Shell", "Markdown", "JSON Schema"],
    timeframe: "持续迭代",
    verifiedAt: "2026-07-18",
    problem: "现场排障需要保存证据顺序和停止边界，但通用 Agent 往往一次给出过多命令，容易把说明、计划和真实执行混在一起。",
    approach: [
      "把命令查询、准备执行、执行中、已有结果和记录模式拆成不同状态。",
      "按 GPU、网络、BMC、拓扑和告警场景组织脚本、参考资料与安全报告合同。",
      "使用公开安全夹具、Schema 和黄金样例验证输出结构。"
    ],
    decisions: [
      "执行中不发送下一条命令，优先等待提示符和完整输出。",
      "状态变更操作必须同时给出目标、影响、停止条件和恢复检查。",
      "公开证据只使用合成输入和脱敏摘要，不复制现场日志。"
    ],
    outcomes: [
      "形成 10 个自动化脚本和 20 份场景参考。",
      "验证器在 2026-07-18 重新执行并返回成功。",
      "现场诊断默认只读，状态变更必须经过单独确认。"
    ],
    evidence: [
      {
        type: "validator",
        label: "验证器通过",
        detail: "公开资源、Schema、安全合同和黄金样例通过项目验证器。",
        verifiedAt: "2026-07-18",
        href: "/evidence/onsite-compute-ops/validation-summary.svg"
      },
      {
        type: "source-audit",
        label: "10 个脚本 / 20 份参考",
        detail: "按脚本目录和参考资料目录重新计数。",
        verifiedAt: "2026-07-18"
      },
      {
        type: "article",
        label: "单步执行设计说明",
        detail: "解释为什么现场工作流必须一次只推进一条命令。",
        verifiedAt: "2026-07-18",
        href: "/posts/one-command-at-a-time-agent-skill/"
      }
    ],
    nextStep: "继续补充只使用合成输入的公开案例，让更多故障路径能够被站外读者复核。",
    privacyNote: "公开版本不包含客户名称、网络地址、设备编号、拓扑、现场日志和认证信息。"
  },
  {
    kind: "case",
    slug: "agentic-toolbox",
    name: "Agentic Toolbox",
    summary: "七个本地工具共享命令行和网页入口，覆盖热点、配置、Skills、告警、OCR、网页健康和安全自查。",
    status: "可运行",
    category: "本地自动化工具",
    featured: true,
    role: "工具整合、统一入口、Web 界面与测试",
    stack: ["Python", "unittest", "本地 Web", "SQLite"],
    timeframe: "2026-07",
    verifiedAt: "2026-07-18",
    problem: "零散脚本各自有参数、报告格式和输出目录，日常使用时难以发现、复用和追踪历史。",
    approach: [
      "保留七个工具的独立业务边界，同时提供统一命令行调度。",
      "增加本地网页入口、运行历史、报告浏览与筛选。",
      "使用合成样例覆盖热点、配置、OCR、告警、网页检查和安全自查。"
    ],
    decisions: [
      "优先使用 Python 标准库，降低本机安装和迁移成本。",
      "命令行与网页共享同一业务入口，避免复制实现。",
      "安全自查只报告命中类型，不回显密钥内容。"
    ],
    outcomes: [
      "七个工具能够通过统一入口运行并生成本地报告。",
      "97 项单元测试在 2026-07-18 重新执行并全部通过。",
      "网页界面保留历史与筛选，但不依赖远程数据库。"
    ],
    evidence: [
      {
        type: "test",
        label: "97 项测试通过",
        detail: "使用 Python unittest 重新执行完整测试目录。",
        verifiedAt: "2026-07-18",
        href: "/evidence/agentic-toolbox/test-summary.svg"
      },
      {
        type: "source-audit",
        label: "7 个独立工具",
        detail: "工具目录、统一调度入口和网页入口均已存在。",
        verifiedAt: "2026-07-18"
      },
      {
        type: "article",
        label: "工具收敛记录",
        detail: "记录统一合同、网页入口和本地持久化的设计过程。",
        verifiedAt: "2026-07-18",
        href: "/posts/from-scripts-to-agentic-toolbox/"
      }
    ],
    nextStep: "制作完全使用合成数据的界面样例，并为长任务补充更清楚的运行状态。",
    privacyNote: "公开页面只使用合成数据，不展示本机扫描结果、历史数据库和私人配置。"
  },
  {
    kind: "case",
    slug: "h200-knowledge-station",
    name: "H200 运维知识站",
    summary: "把新人入口、速查、故障处理、学习计划和资料索引生成适合手机阅读的静态知识站。",
    status: "接近成品",
    category: "智算现场运维",
    featured: false,
    role: "内容整理与移动阅读构建",
    stack: ["Python", "Markdown", "静态 HTML", "响应式 CSS"],
    timeframe: "2026-06 至 2026-07",
    verifiedAt: "2026-07-18",
    problem: "值班资料分散在多份文档中，手机现场查阅时难以快速进入正确主题。",
    approach: [
      "按新人入口、速查、故障处理、模板、学习计划和场景练习整理内容。",
      "由构建脚本生成单篇页面、索引页和手机合集。",
      "为小屏阅读设置视口、响应式表格和打印样式。"
    ],
    decisions: [
      "把危险操作边界与命令说明放在同一条阅读路径。",
      "保留 Markdown 作为内容源，HTML 只作为可分发产物。",
      "不把现存目录文件数当成稳定版本号。"
    ],
    outcomes: [
      "当前构建输入包含 10 份 H200 Markdown。",
      "构建脚本可以生成单篇、索引和合集页面。",
      "现存目录有 17 个 HTML，但包含旧版本和重复编号，不能作为当前可复现页数。"
    ],
    evidence: [
      {
        type: "source-audit",
        label: "10 份当前内容源",
        detail: "构建输入按当前 Markdown 文件重新计数。",
        verifiedAt: "2026-07-18"
      },
      {
        type: "source-audit",
        label: "构建口径待冻结",
        detail: "现存 17 个 HTML 与当前输入推导的产物数量不一致，因此不对外宣称 17 页版本。",
        verifiedAt: "2026-07-18"
      }
    ],
    nextStep: "清理旧版本输出、冻结可复现清单，并完成逐页脱敏后再提供公开截图。",
    privacyNote: "公开前逐页移除真实设备标识、客户拓扑、现场日志和内部资料链接。"
  },
  {
    kind: "case",
    slug: "bitcoin-prediction-radar",
    name: "比特币预测市场雷达",
    summary: "只读抓取市场数据，过滤脏市场，记录首次观察概率，并在结算后做闭环验证。",
    status: "接近成品",
    category: "项目开发日志",
    featured: true,
    role: "只读监控、过滤、告警与结算验证闭环",
    stack: ["Python", "Flask", "pytest", "本地状态文件"],
    timeframe: "2026-07",
    verifiedAt: "2026-07-18",
    problem: "预测市场容易混入过期、关闭、归零和结果顺序不明确的数据，事后挑选样本又会污染观察结论。",
    approach: [
      "抓取现货参照和预测市场盘口，并按状态、结果标签和数据质量过滤。",
      "保存同一市场的首次观察概率，避免后验覆盖。",
      "在市场到期后查询结算状态，把首次观察与最终结果连接起来。"
    ],
    decisions: [
      "系统只做观察，不连接钱包，不生成自动买卖动作。",
      "首次观察记录只写第一次，旧记录损坏时失败关闭而不是静默覆盖。",
      "外部现货参照与预测市场结算来源分开描述。"
    ],
    outcomes: [
      "形成市场过滤、候选告警、健康检查、看门狗和结算验证路径。",
      "34 项测试在 2026-07-18 重新执行并全部通过。",
      "公开结论只描述系统能力，不给出收益、胜率或交易承诺。"
    ],
    evidence: [
      {
        type: "test",
        label: "34 项测试通过",
        detail: "测试覆盖市场过滤、首次观察、结算、告警、健康状态和只读策略。",
        verifiedAt: "2026-07-18",
        href: "/evidence/bitcoin-prediction-radar/validation-summary.svg"
      },
      {
        type: "chart",
        label: "公开安全价格图",
        detail: "现有价格历史图只用于展示观察数据，不表示预测准确率。",
        verifiedAt: "2026-07-18",
        href: "/evidence/bitcoin-prediction-radar/btc-price-history.png"
      },
      {
        type: "article",
        label: "首次观察到结算闭环",
        detail: "说明如何减少后验污染，并区分观察与交易动作。",
        verifiedAt: "2026-07-18",
        href: "/posts/bitcoin-radar-observation-loop/"
      }
    ],
    nextStep: "积累更多已结算样本并继续验证数据失败路径，不在样本不足时展示胜率。",
    privacyNote: "不连接钱包，不自动下单，不承诺收益；公开资产不包含市场地址、账户和本地运行状态。"
  },
  {
    kind: "case",
    slug: "agenth-specability",
    name: "agenth / Specability",
    summary: "以任务目标、上下文包、完成证据和验收门禁约束本地 Coding Agent。",
    status: "研究原型",
    category: "AI Agent 与 Skills",
    featured: false,
    role: "本地 CLI 原型与完成证据门禁",
    stack: ["Node.js", "CommonJS", "node:test", "YAML"],
    timeframe: "2026-06 至 2026-07",
    verifiedAt: "2026-07-18",
    problem: "Agent 可以生成看似完成的回答，却没有任务目标、差异摘要、验证记录和风险说明来证明工作真的完成。",
    approach: [
      "生成项目级上下文包、任务卡和运行证据目录。",
      "把 diff、通过的验证、跳过项理由和风险声明设为完成门禁。",
      "通过本地 CLI 和项目钩子记录证据，不依赖全局服务。"
    ],
    decisions: [
      "agenth 包保持 private，本地原型不冒充公开 npm 分发。",
      "缺少任一必需证据时，完成命令必须失败。",
      "默认拒绝上传、遥测、危险 Git 和路径逃逸。"
    ],
    outcomes: [
      "本地 CLI 能初始化上下文、创建任务、记录证据并给出完成判定。",
      "12 项测试在 2026-07-18 重新执行并全部通过。",
      "Specability 已形成本地打包原型，但不宣称已发布到公共 registry。"
    ],
    evidence: [
      {
        type: "test",
        label: "12 项测试通过",
        detail: "覆盖初始化、完成门禁、篡改检测、并发记录和危险命令阻断。",
        verifiedAt: "2026-07-18",
        href: "/evidence/agenth-specability/completion-gate.svg"
      },
      {
        type: "source-audit",
        label: "private 本地 CLI",
        detail: "包元数据明确标记 private，当前只描述为本地分发原型。",
        verifiedAt: "2026-07-18"
      }
    ],
    nextStep: "补一套完全脱敏的演示任务，并把 Specability 的本地打包与 agenth 门禁关系写清楚。",
    privacyNote: "公开内容不包含私人会话、真实任务运行目录和本机 Agent 配置。"
  },
  {
    kind: "case",
    slug: "mimoclaw-apex-ecosystem",
    name: "MiMoClaw APEX Ecosystem",
    summary: "研究 APEX、Skill、Agent 与多模型之间可审计的只读诊断和安全边界。",
    status: "研究原型",
    category: "MiMoClaw / APEX",
    featured: false,
    role: "只读诊断、安全合同与投影研究",
    stack: ["Python", "JSON", "契约测试", "本地投影"],
    timeframe: "持续研究",
    verifiedAt: "2026-07-18",
    problem: "研究信号、公式质量和 Agent 建议容易被误解为可以直接改变核心评分或触发真实动作。",
    approach: [
      "为诊断结果标记只读、是否写报告和是否修改在线状态。",
      "把 advisor-only 信号与核心分数、自动化动作隔离。",
      "使用本地投影汇总状态，同时保留质量提升阻断条件。"
    ],
    decisions: [
      "公开演示只描述只读诊断路径，不展示私人状态和指标明细。",
      "可接受数据包不等于公式质量达到提升条件。",
      "没有单一证据支持的测试数量和外连默认状态不进入公开文案。"
    ],
    outcomes: [
      "源码合同明确只读诊断不写报告且不修改在线状态。",
      "advisor-only 信号不能改变核心分数，也不能触发真实动作。",
      "当前价值是结构化研究和风险审计，不是现实收益证明。"
    ],
    evidence: [
      {
        type: "source-audit",
        label: "只读诊断合同",
        detail: "诊断输出标记 read-only、无报告写入和无在线状态修改。",
        verifiedAt: "2026-07-18"
      },
      {
        type: "source-audit",
        label: "advisor-only 隔离",
        detail: "顾问信号只影响复核优先级，不改变核心分数或触发动作。",
        verifiedAt: "2026-07-18"
      },
      {
        type: "article",
        label: "只读证据边界",
        detail: "解释数据包可接受与公式质量可提升之间的区别。",
        verifiedAt: "2026-07-18",
        href: "/posts/apex-read-only-evidence-boundary/"
      }
    ],
    nextStep: "把只读诊断、建议层和自动化阻断关系整理成不含私人指标的公开架构图。",
    privacyNote: "公开前移除服务器投影、事件日志、私人记忆、指标明细和在线状态。"
  },
  {
    kind: "case",
    slug: "pdf-layout-translator",
    name: "PDF 保留版式翻译工具",
    summary: "翻译 PDF 文本并按原文本框位置覆盖回页面，生成保留结构的中文版产物。",
    status: "一次性交付物",
    category: "本地自动化工具",
    featured: false,
    role: "一次性翻译缓存与版式回填脚本",
    stack: ["Python", "PyMuPDF", "翻译缓存", "文本框回填"],
    timeframe: "2026-07",
    verifiedAt: "2026-07-18",
    problem: "普通 PDF 翻译容易丢失原页面结构，长文档重复请求又会浪费已完成的翻译结果。",
    approach: [
      "提取每页文字块和边界框，并为技术术语设置保护规则。",
      "使用翻译缓存减少重复请求。",
      "清除原文字块后按原边界框回填中文，并逐步缩小字体以适应版面。"
    ],
    decisions: [
      "首版绑定单一输入文件，诚实标记为一次性交付物。",
      "脚本调用第三方翻译接口，因此不宣称离线或适合敏感文档。",
      "不公开受版权保护的原文页面、全文译文和缓存内容。"
    ],
    outcomes: [
      "生成 159 页 A4 中文版 PDF 产物。",
      "脚本具备翻译缓存、术语保护和文本框覆盖式排版。",
      "产品化仍需要参数化输入、通用字体策略和可授权样例。"
    ],
    evidence: [
      {
        type: "report",
        label: "159 页 A4 产物",
        detail: "使用 PDF 元数据工具核验现有中文版产物的页数和页面尺寸。",
        verifiedAt: "2026-07-18"
      },
      {
        type: "source-audit",
        label: "缓存与文本框回填",
        detail: "源码包含缓存读写、边界框提取、遮盖和 insert_textbox 回填流程。",
        verifiedAt: "2026-07-18"
      }
    ],
    nextStep: "使用自制的一页样例验证参数化输入、字体回退和失败页面报告。",
    privacyNote: "示例只使用自制或明确授权的页面；脚本会访问第三方翻译接口，不处理未授权敏感文档。"
  },
  {
    kind: "case",
    slug: "image-excel-audit",
    name: "图片与 Excel 自动比对工具",
    summary: "通过 OCR 与字段规则，把现场图片和 Excel 标签记录生成可复核的分类报告。",
    status: "一次性交付物",
    category: "本地自动化工具",
    featured: false,
    role: "OCR 字段匹配、复核分流与 Excel 报告生成",
    stack: ["Python", "openpyxl", "OCR", "Node.js", "Excel 报告"],
    timeframe: "2026-07",
    verifiedAt: "2026-07-18",
    problem: "现场图片数量多，OCR 结果又存在误识别，人工逐张对照表格字段耗时且难以记录复核原因。",
    approach: [
      "把标签拆成网络类型、机柜、U 位、端口和序号等字段。",
      "按字段命中计算候选分数，再分成已匹配、需复核和未匹配。",
      "生成包含汇总、图片目录、匹配结果和待处理视图的 Excel 报告。"
    ],
    decisions: [
      "Excel 源表以只读模式加载，原文件不被修改。",
      "只有关键字段组合满足门槛时才自动标记已匹配。",
      "真实报告包含图片、OCR、路径和表格字段，因此不能直接公开。"
    ],
    outcomes: [
      "一次性任务处理了 120 张图片样本。",
      "输出 JSON 同时记录汇总、逐标签结果和逐图片状态。",
      "现有 Excel 产物包含 8 个工作表，并执行公式错误扫描。"
    ],
    evidence: [
      {
        type: "source-audit",
        label: "120 张样本",
        detail: "图片清单、汇总 image_count 和图片数组长度三处口径一致。",
        verifiedAt: "2026-07-18"
      },
      {
        type: "report",
        label: "8 个报告工作表",
        detail: "现有 xlsx 包含 8 个 worksheet 文件，报告代码同时执行公式错误扫描。",
        verifiedAt: "2026-07-18"
      }
    ],
    nextStep: "用合成标签、虚构表格和自制图片生成可公开的缩减报告，并抽象输入字段。",
    privacyNote: "不发布真实图片、OCR 全文、原图路径、表格字段、设备编号和现有 Excel 报告。"
  },
  {
    kind: "roadmap",
    slug: "gpu-health-diagnostics",
    name: "GPU 健康诊断",
    summary: "围绕 XID、ECC、温度、功耗和降频建立可复核的 GPU 健康检查与排障路径。",
    status: "资料整理",
    phase: 1,
    category: "智算现场运维",
    featured: false,
    goal: "形成不依赖真实现场日志的 GPU 体检和初步故障分流手册。",
    motivation: "GPU 健康不能靠单一温度或一条 XID 下结论。把指标、日志和诊断工具排成证据顺序，才能减少误判并明确何时升级处理。",
    currentAction: "整理 nvidia-smi、内核日志和 DCGM 之间的证据顺序。",
    milestones: [
      { title: "基线清单", detail: "列出温度、功耗、ECC、降频和设备可见性的只读检查项。" },
      { title: "分支路径", detail: "把 XID、ECC 增长、过热和降频拆成不同排查入口。" },
      { title: "公开案例", detail: "使用合成输出走通一条从现象到升级边界的案例。" }
    ],
    acceptanceCriteria: [
      "每一步都写明输入、通过条件、停止条件和下一层证据。",
      "合成案例可以由另一位读者独立复核。",
      "所有截图和输出不含真实设备标识。"
    ],
    plannedArtifacts: ["GPU 基线巡检清单", "XID / ECC 分支排查表", "合成案例与验收模板"],
    nextStep: "完成第一版 GPU 基线巡检清单。",
    privacyNote: "只公开通用检查方法和合成示例，不展示真实设备标识、客户日志或故障工单。"
  },
  {
    kind: "roadmap",
    slug: "rdma-network-diagnostics",
    name: "IB / RoCE 链路排查",
    summary: "围绕 IB、RDMA 与 RoCE 的状态、带宽、时延和丢包，整理链路诊断与基线验证方法。",
    status: "资料整理",
    phase: 1,
    category: "智算现场运维",
    featured: false,
    goal: "形成区分 InfiniBand 与 RoCE 的链路检查和性能基线手册。",
    motivation: "断链、丢包和带宽下降可能来自不同协议层。若混用 IB 与 RoCE 的工具和结论，排查会在错误层面反复绕圈。",
    currentAction: "拆分物理链路、端口状态、错误计数和端到端测试四层证据。",
    milestones: [
      { title: "协议边界", detail: "标明 IB 与 RoCE 各自适用的工具和网络依赖。" },
      { title: "基线模板", detail: "定义状态、速率、错误计数、带宽和时延记录格式。" },
      { title: "决策树", detail: "用合成链路异常验证从现象到定位方向的分支。" }
    ],
    acceptanceCriteria: [
      "IB 和 RoCE 步骤不会混用诊断结论。",
      "每个基线值都要求记录硬件、拓扑和测试规模。",
      "决策树包含升级边界和待回传证据。"
    ],
    plannedArtifacts: ["链路检查清单", "带宽与时延基线模板", "丢包与降速决策树"],
    nextStep: "完成 IB 与 RoCE 的工具和证据对照表。",
    privacyNote: "不公开真实交换机端口、拓扑、网络地址、设备标签和客户配置。"
  },
  {
    kind: "roadmap",
    slug: "nccl-communication-diagnostics",
    name: "NCCL 多机通信排障",
    summary: "针对多机 all-reduce 卡顿、超时和 hang，建立从拓扑到链路再到软件栈的诊断流程。",
    status: "资料整理",
    phase: 2,
    category: "智算现场运维",
    featured: false,
    goal: "形成可重复的 NCCL 基线测试和三类通信异常诊断入口。",
    motivation: "all-reduce 变慢、超时和完全卡死看起来相似，却可能分别落在拓扑、链路、网卡选择或软件版本。需要先把入口和证据矩阵分开。",
    currentAction: "定义性能偏低、通信超时和完全卡死的证据矩阵。",
    milestones: [
      { title: "基线测试", detail: "记录硬件、拓扑、规模、消息尺寸和带宽结果。" },
      { title: "日志速查", detail: "整理初始化、网卡选择、传输层和超时关键字。" },
      { title: "故障案例", detail: "使用虚构节点走通一个可重复的多机排障案例。" }
    ],
    acceptanceCriteria: [
      "单机与跨机证据层分开记录。",
      "测试结果不脱离硬件、拓扑和规模给出统一通过值。",
      "案例覆盖复现条件、停止边界和恢复验证。"
    ],
    plannedArtifacts: ["nccl-tests 基线指南", "NCCL_DEBUG 关键字速查", "超时与 hang 决策树"],
    nextStep: "完成 NCCL 基线测试记录模板。",
    privacyNote: "示例使用虚构节点和裁剪日志，不公开真实拓扑、网络地址、作业信息和业务负载。"
  },
  {
    kind: "roadmap",
    slug: "dcgm-monitoring-alerts",
    name: "DCGM GPU 监控与告警",
    summary: "把 DCGM 指标接入 Prometheus 与 Grafana，并为关键 GPU 健康信号建立告警规则。",
    status: "资料整理",
    phase: 2,
    category: "智算现场运维",
    featured: false,
    goal: "形成使用合成指标即可验证的 GPU 监控和告警最小闭环。",
    motivation: "只有指标面板还不能支持值班处理。采集范围、持续异常、恢复信号和告警抑制必须一起验证，告警才具备行动意义。",
    currentAction: "整理温度、功耗、利用率、显存、ECC 和设备状态的指标字典。",
    milestones: [
      { title: "采集范围", detail: "定义指标、标签、采样频率和数据缺失语义。" },
      { title: "展示层", detail: "用合成数据制作不含真实集群标签的看板。" },
      { title: "告警演练", detail: "验证持续异常、恢复和告警抑制路径。" }
    ],
    acceptanceCriteria: [
      "示例阈值明确标注需要按设备规范和现场基线复核。",
      "至少一条合成异常能够触发并恢复告警。",
      "公开看板不包含真实集群、节点和接收人。"
    ],
    plannedArtifacts: ["DCGM 指标字典", "合成数据 Grafana 面板", "告警规则与演练模板"],
    nextStep: "完成首版 GPU 健康指标字典。",
    privacyNote: "公开版本只使用合成指标和脱敏截图，不包含监控地址、真实标签和告警记录。"
  },
  {
    kind: "roadmap",
    slug: "gpu-container-runtime",
    name: "GPU 容器化部署规范",
    summary: "整理驱动、CUDA、容器运行时与 GPU 设备暴露之间的兼容关系和部署验证流程。",
    status: "未开始",
    phase: 3,
    category: "智算现场运维",
    featured: false,
    goal: "形成从宿主机到容器和编排层的最小 GPU 运行验证规范。",
    motivation: "容器看不到 GPU 时，问题可能在宿主驱动、Toolkit、运行时、镜像或编排层。分层验证可以避免把版本问题混成一个模糊报错。",
    currentAction: "准备驱动、Toolkit、CUDA 镜像和设备映射的责任边界表。",
    milestones: [
      { title: "兼容记录", detail: "记录宿主驱动、Toolkit、运行时和镜像版本。" },
      { title: "最小任务", detail: "验证宿主机可见、容器设备映射和最小计算任务。" },
      { title: "编排检查", detail: "整理 Device Plugin 部署、检查和回滚路径。" }
    ],
    acceptanceCriteria: [
      "能够区分宿主驱动、容器运行时和编排层问题。",
      "最小任务在记录的兼容组合下可重复运行。",
      "安装、失败和回滚步骤均有验证信号。"
    ],
    plannedArtifacts: ["版本兼容记录模板", "Docker GPU 最小运行示例", "Device Plugin 检查清单"],
    nextStep: "完成兼容记录模板和最小运行条件。",
    privacyNote: "公开示例不包含私有镜像仓库、集群地址、节点清单、账号和生产配置。"
  },
  {
    kind: "roadmap",
    slug: "slurm-gpu-scheduling",
    name: "Slurm GPU 作业调度",
    summary: "整理 GPU 资源声明、作业排队、抢占与故障恢复的 Slurm 调度操作和验证方法。",
    status: "未开始",
    phase: 3,
    category: "智算现场运维",
    featured: false,
    goal: "形成使用合成作业说明 GPU 资源申请、排队和状态变化的值班手册。",
    motivation: "作业排队、抢占和资源未释放都需要结合 GRES、分区和作业声明解释。没有状态路径时，值班人员只能看到结果，无法判断下一步。",
    currentAction: "准备节点、分区、GRES 和作业请求之间的资源映射示例。",
    milestones: [
      { title: "资源模型", detail: "解释节点、分区、GRES 和作业声明的映射关系。" },
      { title: "状态路径", detail: "观察排队、资源不足、抢占、失败重试和节点下线。" },
      { title: "值班手册", detail: "把查询、判断、升级和恢复验证整理成单步流程。" }
    ],
    acceptanceCriteria: [
      "所有示例使用虚构用户、队列和节点。",
      "每种状态都能解释原因、下一步和恢复信号。",
      "策略内容只作为实验材料，不直接给出生产参数建议。"
    ],
    plannedArtifacts: ["GPU 作业示例", "排队与抢占说明", "异常状态排查模板"],
    nextStep: "完成合成 GRES 资源映射和作业示例。",
    privacyNote: "不公开真实用户、账户、分区、QoS、作业记录、节点和集群配置。"
  }
];

export const caseProjects = projects.filter((project): project is CaseProject => project.kind === "case");
export const roadmapProjects = projects.filter((project): project is RoadmapProject => project.kind === "roadmap");

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
