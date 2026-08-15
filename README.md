# DSH Computer Use

[中文](README.zh-CN.md)

Native Windows Computer Use bundle for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). It uses the DSH Cordis tool registry directly and does not use MCP. The current compatibility target is DSH `0.1.0-rc.6`.

## Capabilities

- `computer_screenshot`: captures the virtual desktop and returns a DSH image attachment.
- `computer_click`, `computer_drag`, `computer_scroll`: pointer control using bounded virtual-desktop coordinates.
- `computer_type`, `computer_keypress`: Unicode text and supported keyboard shortcuts sent to the active control.
- `computer_wait`: allows an application to settle before the next observation.
- `computer_observe`: captures the desktop and sends it to a user-selected vision model when the active DSH model cannot inspect images.

Every Computer Use tool asks through DSH's native approval service by default. `CTRL+ALT+DELETE`, empty text, unsupported keys, invalid durations, and coordinates outside the virtual desktop are rejected before input is sent.

## Vision model settings

After installing and restarting DSH, open **Settings** and select the `computer-use-vision` section. Enter an OpenAI-compatible HTTPS base URL, API key, vision-capable model name, and response-token limit, then enable the model. The API key is stored in DSH's settings secret field and is not included in Cordis configuration or tool responses.

`computer_observe` sends the current screenshot only to this configured endpoint. Keep it disabled unless you understand where the visual data will be processed.

## Install

From npm (recommended):

```powershell
dsh plugin add @crazy_th/dsh-computer-use
```

> Installs into your current profile. To target a specific profile (e.g. the web GUI), append `--profile <name>`:
>
> ```powershell
> dsh plugin --profile web add @crazy_th/dsh-computer-use
> ```

From source (development):

```powershell
pnpm install
pnpm run build
dsh plugin add link:<path-to-this-checkout>
```

Restart DSH after installation. To inspect the active layer:

```powershell
dsh --profile web --dump-config
```

The bundled `cordis.patch.yml` enables approval and scales screenshots to at most 1600x1200. Override those values in the profile's `cordis.patch.yml` when needed.

## Development

```powershell
pnpm test
pnpm run typecheck
pnpm run build
```

The automation driver is Windows-only. It uses `user32.dll` for input and `System.Drawing` for screen capture; it does not install a global hook or run a background process.

## License

MIT
