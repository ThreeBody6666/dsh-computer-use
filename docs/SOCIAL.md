# 📣 dsh-computer-use 发布包（v0.2.1）

> 状态：npm 0.2.1 ✅ / GitHub `main` ✅ / GUI 可视化设置卡片 ✅ / 原生 Windows Computer Use 工具 ✅

---

## 🇨🇳 微信朋友圈 / 微信群 / 即刻（一句话版）

给 DeepSeek Harness 装了"电脑控制"插件——现在 AI 智能体可以直接替你操作 Windows 桌面了：截图看屏幕、点按钮、拖拽、打字、按快捷键、滚动，一气呵成 🖥️

开源插件 dsh-computer-use v0.2.1：原生实现（不走 MCP）、每个动作都先征求你同意、还能接任意视觉模型"看懂"屏幕。

👉 https://github.com/ThreeBody6666/dsh-computer-use

---

## 🇨🇳 掘金 / 知乎 / V2EX（标准版）

【开源】dsh-computer-use —— 让 DeepSeek Harness 智能体直接操控你的 Windows 电脑

AI 智能体不光能"说"，现在还能"动手"了。这个 DSH 插件让 agent 像人一样操作 Windows 桌面：

- 🖥️ **computer_screenshot**：截取虚拟桌面，返回 DSH 原生图片附件
- 🖱️ **computer_click / drag / scroll**：精确坐标的鼠标点击、拖拽、滚轮
- ⌨️ **computer_type / keypress**：Unicode 文本输入 + 安全快捷键（拒绝 Ctrl+Alt+Del 等危险键）
- 👀 **computer_observe**：截屏后交给**任意 OpenAI 兼容视觉模型**理解，主模型看不了图时也能"看懂"界面
- ⏱️ **computer_wait**：等应用稳定再截图，避免误操作

**为什么值得用**：
- ✅ 原生接入 DSH Cordis 工具注册表，**不走 MCP**，零额外服务
- ✅ 每个动作默认经过 DSH 原生审批（ask 确认），安全可控
- ✅ 越界坐标、空文本、非法时长在发出前就被拦截
- ✅ **v0.2.0+ 新增 GUI 可视化设置卡片**——设置页里点几下就配好视觉模型，凭据只写不回显

安装只需一条命令（`--profile` 必填）：
```bash
dsh plugin --profile web add @crazy_th/dsh-computer-use
```

🔗 GitHub：https://github.com/ThreeBody6666/dsh-computer-use
📦 npm：https://www.npmjs.com/package/@crazy_th/dsh-computer-use

标签：`#DeepSeek` `#开源` `#AI` `#Windows` `#ComputerUse` `#自动化`

---

## 🇨🇳 微信公众号 / CSDN / 知乎专栏（详细版）

标题：《给 DeepSeek Harness 装上"眼睛和手"：让 AI 智能体直接操作 Windows》

开头钩子：
"你有没有想过——AI 智能体看完屏幕截图后，能自己点按钮、输密码、拖动窗口把活儿干完？我把这套能力做成了 DSH 插件。"

正文大纲：
1. 为什么做：很多 AI 任务卡在"看得到、摸不到"——模型能读图但不能操作；现有方案多依赖 MCP 服务，重且绕
2. 做了什么：8 个原生工具直接进 DSH 工具注册表（screenshot/click/drag/scroll/type/keypress/wait/observe）
3. 怎么做的：Cordis 插件架构，工具行 + settings 行分离；`computer_observe` 把截图发给用户配置的任意 OpenAI 兼容视觉模型
4. 安全设计：默认审批门控、坐标越界/危险快捷键/非法输入前置拦截
5. GUI 设置：视觉模型配置以"可配置模型 provider"注册，设置页直接可视化编辑（0.2.x）
6. 实测场景：让 agent 读文件树、点菜单、跑自动化操作
7. 结尾：开源地址 + 求 Star + 求 PR

安装方式：
```bash
dsh plugin --profile web add @crazy_th/dsh-computer-use
```

---

## 🇺🇸 Twitter/X（短版）

🤖 dsh-computer-use: give your DeepSeek Harness agent hands + eyes on Windows. Native (no MCP) tools: screenshot, click, drag, scroll, type, keypress, wait — plus `computer_observe` that pipes screenshots to any OpenAI-compatible vision model. Every action asks for approval first.

New in v0.2.x: a visual settings card in the web GUI to configure the vision model.

Install: `dsh plugin --profile web add @crazy_th/dsh-computer-use`
🔗 github.com/ThreeBody6666/dsh-computer-use

#DeepSeek #OpenSource #Windows #ComputerUse #AIAgents

---

## 🇺🇸 Reddit r/LocalLLaMA + r/selfhosted（标准版）

I built dsh-computer-use, an open-source DSH plugin that lets DeepSeek Harness agents operate a Windows desktop directly — no MCP needed, it plugs straight into the Cordis tool registry.

- `computer_screenshot` / `computer_click` / `computer_drag` / `computer_scroll` / `computer_type` / `computer_keypress` / `computer_wait`
- `computer_observe`: captures the desktop and sends it to any OpenAI-compatible vision model, so the agent can "see" the UI when its main model can't inspect images
- Every action goes through DSH's native approval gate by default; out-of-bounds coordinates, dangerous shortcuts (Ctrl+Alt+Del), empty text and bad durations are rejected before anything is sent
- v0.2.x: the vision settings live in a GUI card (registered as a configurable model provider), so the web UI reads/writes them safely — secrets are write-only
- Install: `dsh plugin --profile web add @crazy_th/dsh-computer-use`

🔗 https://github.com/ThreeBody6666/dsh-computer-use
📦 npm: https://www.npmjs.com/package/@crazy_th/dsh-computer-use

---

## 🇺🇸 Hacker News（Show HN 版）

Show HN: dsh-computer-use — Native Windows Computer Use tools for DeepSeek Harness (no MCP)

I built a DSH plugin that registers 8 native Windows computer-use tools (screenshot, click, drag, scroll, type, keypress, wait, observe) directly into the Cordis tool registry. `computer_observe` sends a fresh screenshot to any OpenAI-compatible vision model so the agent can interpret the UI. Every action defaults to the host's approval gate, and inputs are validated before dispatch.

Vision model configuration is exposed as a GUI settings card via the configurable-model-provider mechanism (no host source changes). Screenshots scale to at most 1600x1200.

Install: `dsh plugin --profile web add @crazy_th/dsh-computer-use`
Repo: https://github.com/ThreeBody6666/dsh-computer-use
npm: https://www.npmjs.com/package/@crazy_th/dsh-computer-use

---

## 📸 配图素材

| 素材 | 位置 |
|---|---|
| GUI 设置卡片截图 | `assets/computer-use-vision-settings.png` |
| README 仓库卡片 | GitHub og:image |

## 🎯 投放渠道速查

| 渠道 | 用哪个版本 | 备注 |
|---|---|---|
| 微信朋友圈 | 一句话版 | 配设置卡片截图 |
| 掘金 | 标准版 | 加 #DeepSeek #开源 #AI 标签 |
| 知乎 | 标准版/详细版 | 问题化标题更吸睛 |
| V2EX | 标准版 | 「分享创造」节点 |
| 微信公众号 | 详细版 | 配截图+动图 |
| CSDN | 详细版 | 技术细节可再展开 |
| Twitter/X | 英文短版 | @DeepSeek 官方号 |
| Reddit r/LocalLLaMA | 英文标准版 | 加安全设计细节 |
| Hacker News | Show HN 版 | 标题加 Show HN: 前缀 |
| 即刻/朋友圈 | 一句话版 | 配演示截图 |
