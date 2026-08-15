# DSH Computer Use Plugin Handoff

Date: 2026-08-15

## Project

- Repository: `https://github.com/ThreeBody6666/dsh-computer-use`
- Package: `@crazy_th/dsh-computer-use`
- Local package version: `0.1.2`
- DSH install command after publication:

```powershell
dsh plugin add @crazy_th/dsh-computer-use
```

## Completed

- Implemented a native DSH Cordis plugin. It does not use MCP or Codex Computer Use.
- Registered eight native computer-control tools: screenshot, observe, click, drag, type, keypress, scroll, and wait.
- Added Windows-native screen capture and input driver at `scripts/windows-driver.ps1`.
- Added per-tool approval through DSH's `tools/pre-execute` hook.
- Added the `computer-use-vision` settings namespace, allowing users to configure an OpenAI-compatible vision endpoint, API key, model, and maximum tokens. API key is a DSH secret setting.
- Added English and Simplified Chinese documentation: `README.md` and `README.zh-CN.md`.
- Added DSH plugin bundle metadata in `cordis.patch.yml`.
- GitHub repository was created and tagged with `dsh-plugin`, `computer-use`, `deepseek-harness`, `vision-model`, and `windows`.
- GitHub `main` already contains `README.zh-CN.md` and package version `0.1.2`.

## Validation Already Run

```powershell
pnpm test
pnpm run typecheck
pnpm run build
npm pack --dry-run
```

All completed successfully. The local DSH smoke test also installed the plugin and confirmed its eight tools plus the `computer-use-vision` namespace.

## Git State

- Local branch: `main`
- Local documentation commit: `13ade46 docs: add Chinese README`
- The same documentation/package changes were written to GitHub through the GitHub API after raw Git push connections failed.
- Local `main` currently shows `ahead 1` because the API-created remote commit has a different commit ID. Do not force-push.

Suggested reconciliation when GitHub Git transport works again:

```powershell
git fetch origin
git rebase origin/main
git push origin main
```

Resolve any duplicate documentation commit during the rebase by keeping the remote file contents.

## npm Publication Blocker

- The newly supplied npm token was tested against `https://registry.npmjs.org/-/whoami` using npm's registry auth configuration.
- npm returned `E401 Unauthorized`; the token cannot authenticate to the registry in its current form.
- Do not save the token in `.npmrc`, source files, or Git history.

Once the package owner supplies a valid npm token with publish permission for the `crazy_th` scope, publish from the repository root:

```powershell
$env:NPM_PUBLISH_TOKEN = '<valid-token>'
npm whoami "--//registry.npmjs.org/:_authToken=$env:NPM_PUBLISH_TOKEN"
npm publish --access public "--//registry.npmjs.org/:_authToken=$env:NPM_PUBLISH_TOKEN"
npm view @crazy_th/dsh-computer-use@0.1.2 version
Remove-Item Env:NPM_PUBLISH_TOKEN
```

If `npm publish` says the version already exists, increment the patch version, rerun the validation commands, commit, and publish the new version. Confirm the final public page at `https://www.npmjs.com/package/@crazy_th/dsh-computer-use`.

## Security

The GitHub and npm credentials were pasted into this chat. Treat them as exposed and rotate/revoke them before further publishing.
