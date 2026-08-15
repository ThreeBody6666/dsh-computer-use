# dsh-computer-use 宣传文案包

> 状态（2026-08-15）：**npm 0.2.1 已发布 + GitHub main 已同步 + GUI 可视化设置卡片已可用**

## 📣 中文文案

### 一句话版（微信群 / 朋友圈 / 即刻）

给 DeepSeek Harness 装了"电脑控制"插件——AI 智能体现在能直接操作 Windows 桌面了：截图、点击、拖拽、打字、快捷键、滚动一气呵成。原生实现不走 MCP，每个动作都先征求同意，还能接任意视觉模型"看懂"屏幕。开源：
https://github.com/ThreeBody6666/dsh-computer-use

### 标准版（掘金 / 知乎 / V2EX / 简书）

【开源】dsh-computer-use —— 让 DeepSeek Harness 智能体直接操控你的 Windows 电脑

AI 智能体不光能"说"，现在还能"动手"：

- 🖥️ computer_screenshot：截取虚拟桌面
- 🖱️ computer_click / drag / scroll：精确坐标鼠标操作
- ⌨️ computer_type / keypress：Unicode 输入 + 安全快捷键
- 👀 computer_observe：截屏交给任意 OpenAI 兼容视觉模型理解
- ⏱️ computer_wait：等应用稳定再截图

原生接入 DSH 工具注册表（不走 MCP）；每个动作默认原生审批；越界/危险键/非法输入前置拦截；GUI 可视化设置卡片配视觉模型。

安装：`dsh plugin --profile web add @crazy_th/dsh-computer-use`

⭐ GitHub：https://github.com/ThreeBody6666/dsh-computer-use
📦 npm：https://www.npmjs.com/package/@crazy_th/dsh-computer-use

### 详细版（公众号 / CSDN / 知乎专栏）

标题：《给 DeepSeek Harness 装上"眼睛和手"：让 AI 智能体直接操作 Windows》

1. 为什么做：模型能读图但不能操作，现有方案多依赖 MCP 服务
2. 做了什么：8 个原生工具（screenshot/click/drag/scroll/type/keypress/wait/observe）
3. 怎么做的：Cordis 插件，工具行 + settings 行分离；observe 接任意视觉模型
4. 安全设计：默认审批、坐标/快捷键/输入前置校验
5. GUI 设置：视觉配置以"可配置模型 provider"注册，设置页可视化编辑
6. 结尾：开源地址 + 求 Star + 求 PR

## 🌍 English Copy

### Short (Twitter / X)

🤖 dsh-computer-use: native (no MCP) Windows computer-use tools for DeepSeek Harness — screenshot, click, drag, scroll, type, keypress, wait, observe. Every action asks for approval first; `computer_observe` pipes screenshots to any OpenAI-compatible vision model.

Install: `dsh plugin --profile web add @crazy_th/dsh-computer-use`
⭐ github.com/ThreeBody6666/dsh-computer-use

### Standard (Reddit / HN)

I built dsh-computer-use, an open-source DSH plugin that gives DeepSeek Harness agents hands + eyes on Windows — 8 native tools straight into the Cordis registry, no MCP. `computer_observe` sends a screenshot to any OpenAI-compatible vision model. Native approval gate + input validation by default; vision settings exposed as a GUI card via configurable-model-provider.

Install: `dsh plugin --profile web add @crazy_th/dsh-computer-use`
🔗 https://github.com/ThreeBody6666/dsh-computer-use
📦 https://www.npmjs.com/package/@crazy_th/dsh-computer-use

## 🎯 投放渠道建议

| 渠道 | 用哪个版本 | 备注 |
|---|---|---|
| 掘金 | 标准版 | 加 #DeepSeek #开源 #AI 标签 |
| 知乎 | 标准版/详细版 | 问题化标题更吸睛 |
| V2EX | 标准版 | 「分享创造」节点 |
| 微信公众号 | 详细版 | 配截图 |
| CSDN | 详细版 | 技术细节可再展开 |
| Twitter/X | 英文短版 | @DeepSeek 官方号 |
| Reddit r/LocalLLaMA | 英文标准版 | 加安全设计细节 |
| Hacker News | Show HN 版 | Show HN: 前缀 |
| 即刻/朋友圈 | 一句话版 | 配演示截图 |
