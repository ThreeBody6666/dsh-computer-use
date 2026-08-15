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

安装并重启 DSH 后，打开 **设置 > 插件 > 插件配置**，展开 **Computer Use 视觉模型**。填写兼容 OpenAI 的 HTTPS Base URL、API Key、支持视觉的模型名和最大响应 token，然后启用该模型。

| 字段 | 要求 |
| --- | --- |
| 启用 | 仅在端点、密钥和模型都配置完成后开启。 |
| Base URL | 兼容 OpenAI 的 HTTPS API 基础地址，例如 `https://api.example.com/v1`。 |
| API Key | 以仅写入的 DSH secret 保存；更新时留空会保留已保存的密钥。 |
| 模型 | 服务商接受的视觉模型标识。 |
| 最大 Token | `64` 到 `8192` 的整数，默认值为 `1000`。 |

API Key 使用 DSH Settings 的 secret 字段保存，不写入 Cordis 配置或工具返回内容。`computer_observe` 只会把当前截图发送到此处配置的视觉端点；请确认该端点的隐私与数据处理规则后再启用。

![Computer Use 视觉模型设置卡](assets/computer-use-vision-settings.png)

### 为什么会显示在设置页面

DSH 的浏览器配置 API 只会暴露指定的设置命名空间。插件将视觉配置注册为可配置模型提供方，因此原生 Web UI 可以安全读取和保存这部分配置。Computer Use 工具与设置入口分开加载，避免工具运行时依赖阻塞设置卡片显示。

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

### 验证安装

组合后的配置中必须同时存在 `computer-use-settings` 和 `computer-use`：

```powershell
dsh --profile web --dump-config
```

对于 Web profile，可在默认本地端口启动 DSH：

```powershell
dsh web --port 3082
# 打开 http://127.0.0.1:3082，然后进入 设置 > 插件 > 插件配置。
```

如果没有看到卡片，请在重新构建或重新安装插件后重启 DSH；不要使用来自其他 DSH 实例或 profile 的缓存页面。

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
