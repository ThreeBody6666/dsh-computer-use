// dsh-computer-use — browser (client) half.
//
// Renders a visual configuration card for the plugin inside the Web GUI's
// plugin-settings surface (the "Configurable plugins" tab), editing the
// `computer-use-vision` dsh-settings namespace the Host plugin registers. The
// card is a hand-written ModuleLoader module: it depends only on services the
// official client runtime provides (`slots`, `settingsScope`, `locale`,
// react), so it ships inside this npm package with no build step.
//
// The card mirrors the official ui-plugin-config PluginCard chrome in a
// self-contained slice (this package must not depend on a sibling UI package).

window.__ModuleLoader__.load({
	id: "@crazy_th/dsh-computer-use",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let runtime = require("@deepseek-ai/dsh-client-runtime/client");

		// ---------------------------------------------------------------- css
		const css = ".cu_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:8px;list-style:none;transition:border-color .16s,background .16s;overflow:hidden}.cu_cardOpen{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}.cu_header{cursor:pointer;text-align:left;width:100%;font:inherit;background:0 0;border:0;align-items:center;gap:8px;padding:10px 14px;display:flex}.cu_header:hover{background:var(--dsw-alias-interactive-bg-hover)}.cu_headText{flex-direction:column;flex:1;gap:2px;min-width:0;display:flex}.cu_name{color:var(--dsw-alias-label-primary);font-weight:600}.cu_description{color:var(--dsw-alias-label-tertiary);font-size:12px}.cu_pending{color:var(--dsw-alias-state-warn-primary);font-size:12px}.cu_chevron{color:var(--dsw-alias-label-tertiary);transition:transform .12s}.cu_chevronOpen{transform:rotate(180deg)}.cu_body{flex-direction:column;gap:14px;padding:0 14px 14px;display:flex}.cu_readOnly{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px}.cu_footer{justify-content:flex-end;align-items:center;gap:8px;display:flex}.cu_failed{color:var(--dsw-alias-state-error-primary);margin:0 auto 0 0;font-size:12px}.cu_discard,.cu_save{font:inherit;cursor:pointer;border-radius:6px;padding:5px 12px;font-size:13px}.cu_discard{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0}.cu_discard:hover:not(:disabled){color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-dimmed)}.cu_save{border:1px solid var(--dsw-alias-button-info-fill);background:var(--dsw-alias-button-info-fill);color:var(--dsw-alias-label-primary-foreground)}.cu_save:hover:not(:disabled){border-color:var(--dsw-alias-button-info-hover);background:var(--dsw-alias-button-info-hover)}.cu_discard:active:not(:disabled),.cu_save:active:not(:disabled){transform:translateY(1px)}.cu_discard:focus-visible:not(:disabled),.cu_save:focus-visible:not(:disabled),.cu_header:focus-visible,.cu_reset:focus-visible{outline:2px solid var(--dsw-alias-focus-ring);outline-offset:2px}.cu_discard:disabled,.cu_save:disabled{opacity:.55;cursor:not-allowed}.cu_groupTitle{color:var(--dsw-alias-label-secondary);font-weight:600;font-size:12px;margin:2px 0 0}.cu_sep{height:1px;background:var(--dsw-alias-border-l2)}.cu_field{gap:6px}.cu_head{display:flex;justify-content:space-between;align-items:center;min-height:19px;gap:8px}.cu_label{display:block;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:600;line-height:1.4}.cu_badges{display:inline-flex;align-items:center;gap:6px}.cu_badge{display:inline-block;color:var(--dsw-alias-label-tertiary);font-size:11px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;padding:1px 8px}.cu_badgeMuted{color:var(--dsw-alias-label-tertiary);font-size:11px}.cu_reset{font:inherit;cursor:pointer;color:var(--dsw-alias-label-tertiary);background:0 0;border:0;text-decoration:underline;font-size:11px;padding:0}.cu_reset:hover{color:var(--dsw-alias-label-primary)}.cu_input,.cu_select{width:100%;box-sizing:border-box;font:inherit;border-radius:6px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);padding:5px 9px;font-size:13px;min-height:32px}.cu_input:focus,.cu_select:focus{outline:2px solid var(--dsw-alias-focus-ring);outline-offset:0;border-color:transparent}.cu_inputInvalid{border-color:var(--dsw-alias-state-error-primary)}.cu_input:disabled,.cu_select:disabled{opacity:.6;cursor:not-allowed}.cu_hint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:1.45;margin:0}.cu_invalid{color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:1.45;margin:0}";
		// DSH themes differ in their label tokens. Keep configuration guidance legible
		// even when a theme makes the inherited setting labels nearly transparent.
		const readabilityCss = ".cu_field{gap:6px}.cu_label{display:block!important;color:#f2f6ff!important;line-height:1.4;opacity:1!important;visibility:visible!important}.cu_hint{display:block!important;color:#b8c6dd!important;line-height:1.45;opacity:1!important;visibility:visible!important}.cu_input::placeholder{color:#aebed8!important;opacity:1!important}.cu_input,.cu_select{min-height:34px}.cu_head{min-height:19px}";
		const switchCss = ".cu_switch{font:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:28px;border-radius:14px;padding:0 12px;font-size:12px;line-height:1;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);transition:border-color .12s,background .12s,color .12s;white-space:nowrap}.cu_switch:hover:not(:disabled){border-color:var(--dsw-alias-label-dimmed);color:var(--dsw-alias-label-primary)}.cu_switch:disabled{cursor:default;opacity:.5}.cu_switchOn{color:var(--dsw-alias-button-info-foreground);border-color:var(--dsw-alias-button-info-fill);background:var(--dsw-alias-button-info-fill)}.cu_switchOn:hover:not(:disabled){border-color:var(--dsw-alias-button-info-hover);background:var(--dsw-alias-button-info-hover)}";
		const tagId = "@crazy_th/dsh-computer-use/settings-card.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@crazy_th/dsh-computer-use";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css + switchCss + readabilityCss;
			document.head.appendChild(tag);
		}
		const cssDefault = {
			"badge": "cu_badge",
			"badgeMuted": "cu_badgeMuted",
			"badges": "cu_badges",
			"body": "cu_body",
			"card": "cu_card",
			"cardOpen": "cu_cardOpen",
			"chevron": "cu_chevron",
			"chevronOpen": "cu_chevronOpen",
			"description": "cu_description",
			"discard": "cu_discard",
			"failed": "cu_failed",
			"field": "cu_field",
			"footer": "cu_footer",
			"groupTitle": "cu_groupTitle",
			"head": "cu_head",
			"headText": "cu_headText",
			"header": "cu_header",
			"hint": "cu_hint",
			"input": "cu_input",
			"inputInvalid": "cu_inputInvalid",
			"invalid": "cu_invalid",
			"label": "cu_label",
			"name": "cu_name",
			"pending": "cu_pending",
			"readOnly": "cu_readOnly",
			"reset": "cu_reset",
			"save": "cu_save",
			"select": "cu_select",
			"sep": "cu_sep",
			"switch": "cu_switch",
			"switchOn": "cu_switchOn",
			"switchOff": "cu_switchOff"
		};

		// -------------------------------------------------------------- chrome
		/**
		 * Shared chrome for one plugin settings card: disclosure header, the
		 * controls inside, and a save/discard footer. Renders nothing while the
		 * namespace is unavailable.
		 */
		function PluginSettingsCard(props) {
			const [open, setOpen] = react.useState(false);
			const { state } = props;
			if (!state.available) return null;
			const title = props.t(props.titleKey);
			const blocked = !state.dirty || state.invalid || state.saving;
			return react_jsx_runtime.jsxs("li", {
				className: cssDefault.card + (open ? " " + cssDefault.cardOpen : ""),
				children: [
					react_jsx_runtime.jsxs("button", {
						type: "button",
						className: cssDefault.header,
						"aria-expanded": open,
						"aria-label": `${props.t(open ? "settings.collapse" : "settings.expand")}: ${title}`,
						onClick: () => setOpen(!open),
						children: [
							react_jsx_runtime.jsxs("span", {
								className: cssDefault.headText,
								children: [
									react_jsx_runtime.jsx("span", { className: cssDefault.name, children: title }),
									react_jsx_runtime.jsx("span", { className: cssDefault.description, children: props.t(props.descriptionKey) })
								]
							}),
							state.dirty ? react_jsx_runtime.jsx("span", { className: cssDefault.pending, children: props.t("settings.unsaved") }) : null,
							react_jsx_runtime.jsx("span", { className: cssDefault.chevron + (open ? " " + cssDefault.chevronOpen : ""), children: "\u25be" })
						]
					}),
					open ? react_jsx_runtime.jsxs("div", {
						className: cssDefault.body,
						children: [
							!state.writable ? react_jsx_runtime.jsx("p", { className: cssDefault.readOnly, role: "status", children: props.t("settings.readOnly") }) : null,
							props.children,
							react_jsx_runtime.jsxs("div", {
								className: cssDefault.footer,
								children: [
									state.failed ? react_jsx_runtime.jsx("p", { className: cssDefault.failed, role: "status", children: props.t("settings.saveFailed") }) : null,
									react_jsx_runtime.jsx("button", {
										type: "button",
										className: cssDefault.discard,
										disabled: !state.dirty || state.saving,
										onClick: props.onDiscard,
										children: props.t("settings.discard")
									}),
									react_jsx_runtime.jsx("button", {
										type: "button",
										className: cssDefault.save,
										disabled: blocked,
										onClick: props.onSave,
										children: props.t(state.saving ? "settings.saving" : "settings.save")
									})
								]
							})
						]
					}) : null
				]
			});
		}

		/** A plain text (or numeric) value field. */
		function ValueField(props) {
			return react_jsx_runtime.jsxs("div", {
				className: cssDefault.field,
				children: [
					react_jsx_runtime.jsxs("div", {
						className: cssDefault.head,
						children: [
							react_jsx_runtime.jsx("label", { className: cssDefault.label, htmlFor: props.id, children: props.label }),
							props.overridden ? react_jsx_runtime.jsxs("span", {
								className: cssDefault.badges,
								children: [
									react_jsx_runtime.jsx("span", { className: cssDefault.badge, children: props.overriddenLabel }),
									react_jsx_runtime.jsx("button", { type: "button", className: cssDefault.reset, disabled: props.disabled, onClick: props.onReset, children: props.resetLabel })
								]
							}) : null
						]
					}),
					react_jsx_runtime.jsx("input", {
						id: props.id,
						className: props.invalid ? cssDefault.inputInvalid : cssDefault.input,
						type: "text",
						...(props.numeric === true ? { inputMode: "numeric" } : {}),
						...(props.invalid ? { "aria-invalid": true } : {}),
						value: props.text,
						placeholder: props.placeholder ?? "",
						disabled: props.disabled,
						onChange: (event) => props.onEdit(event.target.value)
					}),
					react_jsx_runtime.jsx("p", { className: props.invalid ? cssDefault.invalid : cssDefault.hint, children: props.invalid ? props.invalidLabel : props.hint })
				]
			});
		}

		/** A boolean field edited through a true/false select. */
		function BooleanField(props) {
			return react_jsx_runtime.jsxs("div", {
				className: cssDefault.field,
				children: [
					react_jsx_runtime.jsxs("div", {
						className: cssDefault.head,
						children: [
							react_jsx_runtime.jsx("label", { className: cssDefault.label, htmlFor: props.id, children: props.label }),
							props.overridden ? react_jsx_runtime.jsxs("span", {
								className: cssDefault.badges,
								children: [
									react_jsx_runtime.jsx("span", { className: cssDefault.badge, children: props.overriddenLabel }),
									react_jsx_runtime.jsx("button", { type: "button", className: cssDefault.reset, disabled: props.disabled, onClick: props.onReset, children: props.resetLabel })
								]
							}) : null
						]
					}),
					react_jsx_runtime.jsxs("select", {
						id: props.id,
						className: cssDefault.select,
						value: props.text,
						disabled: props.disabled,
						onChange: (event) => props.onEdit(event.target.value),
						children: [
							react_jsx_runtime.jsx("option", { value: "", children: props.inheritLabel }),
							react_jsx_runtime.jsx("option", { value: "true", children: props.onLabel }),
							react_jsx_runtime.jsx("option", { value: "false", children: props.offLabel })
						]
					}),
					react_jsx_runtime.jsx("p", { className: cssDefault.hint, children: props.hint })
				]
			});
		}

		/**
		 * A write-only credential control. The value never rides a response, so
		 * the control reports only whether one is configured and starts blank; a
		 * blank draft writes nothing, which keeps the stored key rather than
		 * clearing it.
		 */
		function SecretField(props) {
			return react_jsx_runtime.jsxs("div", {
				className: cssDefault.field,
				children: [
					react_jsx_runtime.jsxs("div", {
						className: cssDefault.head,
						children: [
							react_jsx_runtime.jsx("label", { className: cssDefault.label, htmlFor: props.id, children: props.label }),
							react_jsx_runtime.jsx("span", {
								className: cssDefault.badges,
								children: react_jsx_runtime.jsx("span", { className: props.configured ? cssDefault.badge : cssDefault.badgeMuted, children: props.stateLabel })
							})
						]
					}),
					react_jsx_runtime.jsx("input", {
						id: props.id,
						className: cssDefault.input,
						type: "password",
						autoComplete: "off",
						value: props.text,
						placeholder: props.placeholder ?? "",
						disabled: props.disabled,
						onChange: (event) => props.onEdit(event.target.value)
					}),
					react_jsx_runtime.jsx("p", { className: cssDefault.hint, children: props.hint })
				]
			});
		}

		// --------------------------------------------------------------- form
		/** A staged boolean field. */
		function booleanField(field) {
			return {
				field,
				format: (value) => typeof value === "boolean" ? String(value) : "",
				parse: (text) => {
					if (text === "true") return { kind: "set", value: true };
					if (text === "false") return { kind: "set", value: false };
				}
			};
		}

		/** A staged text value (empty text clears the override). */
		function textField(field) {
			return {
				field,
				format: (value) => typeof value === "string" ? value : "",
				parse: (text) => text === "" ? { kind: "clear" } : { kind: "set", value: text }
			};
		}

		/** A staged numeric value. */
		function numberField(field) {
			return {
				field,
				format: (value) => typeof value === "number" ? String(value) : "",
				parse: (text) => {
					if (text === "") return { kind: "clear" };
					const value = Number(text);
					return Number.isFinite(value) ? { kind: "set", value } : void 0;
				}
			};
		}

		/**
		 * A staged write-only credential. Blank drafts are not writes (keeps the
		 * stored secret); the configured badge comes from the snapshot's `secrets`
		 * list, never from a value.
		 */
		function secretField(field) {
			return {
				field,
				secret: true,
				format: () => "",
				parse: (text) => text === "" ? void 0 : { kind: "set", value: text }
			};
		}

		/**
		 * Stages one card's edits over one settings namespace and writes them on
		 * save. The Host is the only authority on whether a value was accepted —
		 * its validators own the constraints no schema can express — so the
		 * outcome is read back from the section rather than predicted here.
		 */
		var CardForm = class {
			constructor(scope, specs) {
				this.scope = scope;
				this.specs = new Map(specs.map((spec) => [spec.field, spec]));
				this.staged = new Map();
				this.listeners = new Set();
				this.saving = false;
				this.failed = false;
				scope.subscribe(() => this.publish());
			}
			/** Publish a projection of this form, rebuilt whenever the scope or a draft changes. */
			bind(project) {
				const store = runtime.createSnapshotStore(project());
				this.listeners.add(() => store.set(project()));
				return store;
			}
			shell() {
				const snapshot = this.scope.getSnapshot();
				const plan = this.plan();
				return {
					available: snapshot.status === "ready",
					writable: snapshot.writable,
					dirty: plan.length > 0,
					invalid: plan.some((item) => item.run === void 0),
					saving: this.saving,
					failed: this.failed
				};
			}
			field(field) {
				const spec = this.specOf(field);
				const staged = this.staged.get(field);
				const snapshot = this.scope.getSnapshot();
				if (spec.secret === true) {
					const configured = snapshot.secrets?.some((entry) => entry.path?.length === 1 && entry.path[0] === field && entry.set);
					if (staged === void 0) return { text: "", overridden: false, invalid: false, configured };
					const write = spec.parse(staged.text);
					return { text: staged.text, overridden: write?.kind === "set", invalid: false, configured };
				}
				if (staged === void 0) return {
					text: spec.format(this.sectionValue(field)),
					overridden: this.stored(field),
					invalid: false
				};
				const write = staged.clear ? { kind: "clear" } : spec.parse(staged.text);
				return {
					text: staged.text,
					overridden: write?.kind === "set",
					invalid: write === void 0
				};
			}
			actions() {
				return {
					edit: (field, text) => this.stage(field, { text, clear: false }),
					resetField: (field) => {
						const spec = this.specOf(field);
						this.stage(field, spec.secret === true ? { text: "", clear: true } : { text: spec.format(this.baseValue(field)), clear: true });
					},
					save: () => this.save(),
					discard: () => {
						if (this.staged.size === 0 && !this.failed) return;
						this.staged.clear();
						this.failed = false;
						this.publish();
					}
				};
			}
			async save() {
				const plan = this.plan();
				const writes = plan.flatMap((item) => item.run === void 0 ? [] : [item.run]);
				if (plan.length === 0 || this.saving || writes.length !== plan.length) return;
				this.saving = true;
				this.failed = false;
				this.publish();
				let landed = true;
				for (const write of writes) landed = await write() && landed;
				if (landed) this.staged.clear();
				this.saving = false;
				this.failed = !landed;
				this.publish();
			}
			plan() {
				const plan = [];
				for (const [field, staged] of this.staged) {
					const spec = this.specOf(field);
					if (spec.secret === true) {
						if (staged.clear) {
							if (this.secretConfigured(field)) plan.push({ field, run: () => this.clear(field) });
							continue;
						}
						if (staged.text === "") continue;
						const write = spec.parse(staged.text);
						if (write === void 0) plan.push({ field, run: void 0 });
						else plan.push({ field, run: () => this.store(field, write.value) });
						continue;
					}
					if (staged.clear) {
						if (this.stored(field)) plan.push({ field, run: () => this.clear(field) });
						continue;
					}
					if (staged.text === spec.format(this.sectionValue(field))) continue;
					const write = spec.parse(staged.text);
					if (write === void 0) plan.push({ field, run: void 0 });
					else if (write.kind === "clear") plan.push({ field, run: () => this.clear(field) });
					else plan.push({ field, run: () => this.store(field, write.value) });
				}
				return plan;
			}
			async clear(field) {
				await this.scope.unset(field);
				return !this.stored(field);
			}
			async store(field, value) {
				await this.scope.set(field, value);
				return this.userLayer()?.[field] === value;
			}
			stage(field, edit) {
				this.staged.set(field, edit);
				this.failed = false;
				this.publish();
			}
			specOf(field) {
				const spec = this.specs.get(field);
				if (spec === void 0) throw new Error(`settings card has no field ${field}`);
				return spec;
			}
			snapshotOf() {
				return this.scope.getSnapshot();
			}
			sectionValue(field) {
				return this.snapshotOf().value?.[field];
			}
			baseValue(field) {
				return this.snapshotOf().base?.[field];
			}
			userLayer() {
				return this.snapshotOf().user;
			}
			stored(field) {
				const user = this.userLayer();
				return user !== void 0 && Object.hasOwn(user, field);
			}
			secretConfigured(field) {
				return this.snapshotOf().secrets?.some((entry) => entry.path?.length === 1 && entry.path[0] === field && entry.set) ?? false;
			}
			publish() {
				for (const listener of this.listeners) listener();
			}
		};

		// ------------------------------------------------------------- fields
		/** Field specs in display order, grouped for the card. */
		const FIELD_GROUPS = [
			{
				key: "vision",
				fields: [
					{ field: "enabled", spec: booleanField("enabled"), kind: "bool", labelKey: "f.enabled", hintKey: "f.enabledHint" },
					{ field: "baseURL", spec: textField("baseURL"), kind: "text", labelKey: "f.baseURL", hintKey: "f.baseURLHint", placeholderKey: "p.baseURL" },
					{ field: "apiKey", spec: secretField("apiKey"), kind: "secret", labelKey: "f.apiKey", hintKey: "f.apiKeyHint", placeholderKey: "p.apiKey" },
					{ field: "model", spec: textField("model"), kind: "text", labelKey: "f.model", hintKey: "f.modelHint", placeholderKey: "p.model" },
					{ field: "maxTokens", spec: numberField("maxTokens"), kind: "number", labelKey: "f.maxTokens", hintKey: "f.maxTokensHint", placeholderKey: "p.maxTokens" }
				]
			}
		];

		/** One field, dispatched on its kind. */
		function Field(props) {
			const { spec, kind, labelKey, hintKey, placeholderKey, t, fieldProps, state, onEdit, onReset } = props;
			const common = {
				id: `plugin-config-computer-use-${spec.field}`,
				label: t(labelKey),
				placeholder: placeholderKey ? t(placeholderKey) : "",
				disabled: fieldProps.disabled
			};
			if (kind === "bool") {
				return react_jsx_runtime.jsx(BooleanField, {
					...common,
					hint: t(hintKey),
					inheritLabel: t("f.inherit"),
					onLabel: t("f.on"),
					offLabel: t("f.off"),
					overriddenLabel: t("settings.overridden"),
					resetLabel: t("settings.reset"),
					overridden: state.overridden,
					text: state.text,
					onEdit,
					onReset
				});
			}
			if (kind === "secret") {
				return react_jsx_runtime.jsx(SecretField, {
					...common,
					hint: t(hintKey),
					stateLabel: state.configured ? t("f.configured") : t("f.notConfigured"),
					configured: state.configured,
					text: state.text,
					onEdit,
					onReset
				});
			}
			return react_jsx_runtime.jsx(ValueField, {
				...common,
				hint: t(hintKey),
				numeric: kind === "number",
				overriddenLabel: t("settings.overridden"),
				resetLabel: t("settings.reset"),
				invalidLabel: t("settings.invalidNumber"),
				overridden: state.overridden,
				invalid: state.invalid,
				text: state.text,
				onEdit,
				onReset
			});
		}

		/** Render the plugin settings card. */
		function ComputerUseSettingsCard(props) {
			const { t } = props;
			const state = props.useComputerUseSettingsCard((snapshot) => snapshot);
			const disabled = !state.writable;
			const fieldProps = {
				overriddenLabel: t("settings.overridden"),
				resetLabel: t("settings.reset"),
				invalidLabel: t("settings.invalidNumber"),
				disabled
			};
			return react_jsx_runtime.jsx(PluginSettingsCard, {
				t,
				titleKey: "settings.title",
				descriptionKey: "settings.description",
				state,
				onSave: props.save,
				onDiscard: props.discard,
				children: FIELD_GROUPS.map((group) => react_jsx_runtime.jsxs(react.Fragment, {
					key: group.key,
					children: [
						react_jsx_runtime.jsx("p", { className: cssDefault.groupTitle, children: t(`g.${group.key}`) }),
						group.fields.map((entry) => react_jsx_runtime.jsx(Field, {
							spec: entry.spec,
							kind: entry.kind,
							labelKey: entry.labelKey,
							hintKey: entry.hintKey,
							placeholderKey: entry.placeholderKey,
							t,
							fieldProps,
							state: state[entry.field] ?? { text: "", overridden: false, invalid: false, configured: false },
							onEdit: (text) => props.edit(entry.field, text),
							onReset: () => props.resetField(entry.field)
						}, entry.field)),
						react_jsx_runtime.jsx("div", { className: cssDefault.sep })
					]
				}))
			});
		}

		/** Bridges the `computer-use-vision` scope onto the card's staged form. */
		var ComputerUseSettingsCardController = class {
			constructor(scope) {
				this.form = new CardForm(scope, FIELD_GROUPS.flatMap((group) => group.fields.map((entry) => entry.spec)));
				this.store = this.form.bind(() => this.projection());
			}
			projection() {
				return {
					...this.form.shell(),
					...Object.fromEntries(FIELD_GROUPS.flatMap((group) => group.fields.map((entry) => [entry.field, this.form.field(entry.field)])))
				};
			}
			inject() {
				return {
					hooks: { computerUseSettingsCard: this.store },
					...this.form.actions()
				};
			}
		};

		// ------------------------------------------------------- composer switch
		/**
		 * One compact composer pill that toggles the computer_* master switch
		 * (`computer-use-control.enabled`). It mirrors the settings card's
		 * scope read/write path but stages nothing: clicking flips the value.
		 */
		var ComputerUseSwitchController = class {
			constructor(scope) {
				this.scope = scope;
				this.store = runtime.createSnapshotStore(this.projection());
				scope.subscribe(() => this.store.set(this.projection()));
			}
			projection() {
				const snapshot = this.scope.getSnapshot();
				const value = snapshot.value;
				return {
					status: snapshot.status,
					writable: snapshot.writable,
					enabled: value?.enabled === undefined ? true : Boolean(value.enabled)
				};
			}
			async toggle() {
				if (!this.projection().writable) return;
				const next = !this.projection().enabled;
				await this.scope.set("enabled", next);
			}
			inject() {
				return {
					hooks: { computerUseSwitch: this.store },
					computerUseToggle: () => this.toggle()
				};
			}
		};

		/** Render the composer pill (only when the control namespace is available). */
		function ComputerUseSwitch(props) {
			const state = props.useComputerUseSwitch((snapshot) => snapshot);
			if (state.status !== "ready") return null;
			const on = state.enabled;
			return react_jsx_runtime.jsx("button", {
				type: "button",
				className: cssDefault.switch + " " + (on ? cssDefault.switchOn : cssDefault.switchOff),
				title: props.t(on ? "switch.onHint" : "switch.offHint"),
				"aria-pressed": on,
				disabled: !state.writable,
				onClick: () => props.computerUseToggle(),
				children: on ? props.t("switch.on") : props.t("switch.off")
			});
		}

		// -------------------------------------------------------------- apply
		const NS = "computer-use";
		/** Settings namespace the card edits (the Host plugin registers it). */
		const SETTINGS_NS = "computer-use-vision";
		/** Settings namespace the composer switch edits (the Host plugin registers it). */
		const CONTROL_NS = "computer-use-control";
		/** Required client services. */
		const inject = ["slots", "settingsScope", "locale", "connection", "remote"];

		const en = {
			"settings.title": "Computer Use Vision",
			"settings.description": "Configure the vision model used by computer_observe to inspect screenshots.",
			"settings.expand": "Expand",
			"settings.collapse": "Collapse",
			"settings.unsaved": "Unsaved changes",
			"settings.readOnly": "This deployment is read-only: settings cannot be changed from the GUI.",
			"settings.overridden": "Override",
			"settings.reset": "Reset",
			"settings.invalidNumber": "Enter a valid number",
			"settings.discard": "Discard",
			"settings.save": "Save",
			"settings.saving": "Saving…",
			"settings.saveFailed": "Save failed",
			"g.vision": "Vision model",
			"f.enabled": "Enabled",
			"f.enabledHint": "Master switch for the vision model used by computer_observe.",
			"f.inherit": "Inherit",
			"f.on": "On",
			"f.off": "Off",
			"f.configured": "Configured",
			"f.notConfigured": "Not set",
			"f.baseURL": "Base URL",
			"f.baseURLHint": "OpenAI-compatible HTTPS endpoint. computer_observe sends screenshots only here.",
			"f.apiKey": "API key",
			"f.apiKeyHint": "Stored server-side; never shown again. Leave blank to keep the current value.",
			"f.model": "Model",
			"f.modelHint": "Vision-capable model name served by the endpoint.",
			"f.maxTokens": "Max tokens",
			"f.maxTokensHint": "Response token limit for vision analysis (64–8192).",
			"switch.on": "Computer Use: On",
			"switch.off": "Computer Use: Off",
			"switch.onHint": "Computer Use is enabled. Click to disable the computer_* tools.",
			"switch.offHint": "Computer Use is disabled. Click to enable the computer_* tools."
		};

		const zh = {
			"settings.title": "Computer Use 视觉模型",
			"settings.description": "配置 computer_observe 分析截图所用的视觉模型。",
			"settings.expand": "展开",
			"settings.collapse": "收起",
			"settings.unsaved": "有未保存的修改",
			"settings.readOnly": "当前部署为只读:GUI 无法修改设置。",
			"settings.overridden": "已覆盖",
			"settings.reset": "重置",
			"settings.invalidNumber": "请输入有效数字",
			"settings.discard": "放弃",
			"settings.save": "保存",
			"settings.saving": "保存中…",
			"settings.saveFailed": "保存失败",
			"g.vision": "视觉模型",
			"f.enabled": "启用",
			"f.enabledHint": "computer_observe 所用视觉模型的总开关。",
			"f.inherit": "继承",
			"f.on": "开",
			"f.off": "关",
			"f.configured": "已配置",
			"f.notConfigured": "未设置",
			"f.baseURL": "Base URL",
			"f.baseURLHint": "兼容 OpenAI 的 HTTPS 端点。computer_observe 只把截图发到这里。",
			"f.apiKey": "API Key",
			"f.apiKeyHint": "凭据仅保存在服务端,不会回显;留空表示保持原值。",
			"f.model": "模型",
			"f.modelHint": "该端点提供的支持视觉的模型名。",
			"f.maxTokens": "最大 Token",
			"f.maxTokensHint": "视觉分析的最大响应 token(64–8192)。",
			"switch.on": "电脑操作:开",
			"switch.off": "电脑操作:关",
			"switch.onHint": "Computer Use 已启用,点击可禁用 computer_* 工具。",
			"switch.offHint": "Computer Use 已禁用,点击可启用 computer_* 工具。"
		};

		// Examples are shown inside every empty input, so the user can see exactly
		// which value belongs there without having to leave the configuration card.
		const placeholders = {
			en: {
				"p.baseURL": "Example: https://api.example.com/v1",
				"p.apiKey": "OpenAI-compatible API key",
				"p.model": "Example: vision-model-name",
				"p.maxTokens": "Example: 1000"
			},
			zh: {
				"p.baseURL": "例如：https://api.example.com/v1",
				"p.apiKey": "兼容 OpenAI 的 API Key",
				"p.model": "例如：vision-model-name",
				"p.maxTokens": "例如：1000"
			}
		};

		/**
		 * Mount the settings card.
		 * @param ctx - client root context (slots, settingsScope, locale).
		 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { en: { ...en, ...placeholders.en }, zh: { ...zh, ...placeholders.zh } }), "dsh-computer-use: dictionaries");
			const settingsScope = ctx.settingsScope.bind({ namespace: SETTINGS_NS });
			const card = new ComputerUseSettingsCardController(settingsScope);
			ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
				name: "settings.plugin.item",
				key: "@crazy_th/dsh-computer-use",
				id: "@crazy_th/dsh-computer-use",
				order: 60,
				locale: NS,
				inject: () => card.inject()
			}, ComputerUseSettingsCard));

			// Composer switch: a compact pill beside the model / permission
			// pickers that toggles the computer_* master switch. It lives in the
			// `conversation.input.right` seat, which the conversation plugin
			// renders for every active session composer.
			const controlScope = ctx.settingsScope.bind({ namespace: CONTROL_NS });
			const control = new ComputerUseSwitchController(controlScope);
			ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
				name: "conversation.input.right",
				id: "@crazy_th/dsh-computer-use-switch",
				order: -40,
				locale: NS,
				inject: () => control.inject()
			}, ComputerUseSwitch));
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
