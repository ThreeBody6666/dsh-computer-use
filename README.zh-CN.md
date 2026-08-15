# DSH Computer Use

[English](README.md)

面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的原生 Windows Computer Use 插件。它直接注册到 DSH 的 Cordis 工具体系，不使用 MCP。当前兼容目标为 DSH `0.1.0-rc.6`。

## 功能

- `computer_screenshot`：截取当前虚拟桌面并作为 DSH 图片附件返回。
- `computer_observe`：当当前 DSH 模型无法识图时，将桌面截图交给用户配置的视觉模型分析。
- `computer_click`、`computer_drag`、`computer_scroll`：受虚拟桌面坐标边界限制的鼠标控制。
- `computer_type`、`computer_keypress`：向当前焦点控件输入 Unicode 文本或支持的快捷键。
- `computer_wait`：等待应用界面更新后再进行观察。

所有 Computer Use 工具默认通过 DSH 原生审批服务请求许可。插件会在发送输入前拒绝 `CTRL+ALT+DELETE`、空文本、不支持的按键、无效时长及虚拟桌面范围外的坐标。

## 视觉模型设置

安装并重启 DSH 后，打开 **Settings**，进入 `computer-use-vision` 设置区。填写兼容 OpenAI 的 HTTPS Base URL、API Key、支持视觉的模型名和最大响应 token，然后启用该模型。

API Key 使用 DSH Settings 的 secret 字段保存，不写入 Cordis 配置或工具返回内容。`computer_observe` 只会把当前截图发送到此处配置的视觉端点；请确认该端点的隐私与数据处理规则后再启用。

## 安装

从 npm 安装（推荐）。`--profile` 为必填参数，用于指定装入哪个 DSH profile：

```powershell
dsh plugin --profile web add @crazy_th/dsh-computer-use
```

把 `web` 换成你实际使用的 profile（`tui`、`headless` 等）。

从源码安装（开发调试）：

```powershell
pnpm install
pnpm run build
dsh plugin --profile web add link:<本仓库路径>
```

重启 DSH 后可检查已加载层：

```powershell
dsh --profile web --dump-config
```

内置 `cordis.patch.yml` 默认开启审批，并将截图限制为最大 1600x1200。需要时可在 profile 的 `cordis.patch.yml` 中覆盖这些值。

## 开发

```powershell
pnpm install
pnpm test
pnpm run typecheck
pnpm run build
```

自动化驱动目前仅支持 Windows，使用 `user32.dll` 发送输入、使用 `System.Drawing` 截图；不会安装全局钩子或常驻后台进程。

## 许可证

MIT
