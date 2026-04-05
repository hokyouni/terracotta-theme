import * as vscode from 'vscode';
import { buildGlobalRules, buildLanguageRules, buildSemanticRules } from './scopes';
import { resolvePreset } from './presets';
import { PresetName, PartialTokenColors, TokenColorRule, TokenColors } from './types';

const THEME_LABEL = 'Terracotta Light';
const CONFIG_ROOT = 'terracotta';
const VALID_PRESETS = new Set(['warm', 'claude', 'custom']);

// ─── Locale helpers ───────────────────────────────────────────────────────────

// Evaluated once at module load — stable for the lifetime of the extension process.
const isChinese = vscode.env.language.toLowerCase().startsWith('zh');

function t(en: string, zh: string): string {
  return isChinese ? zh : en;
}

const messages = {
  presetWarm:       t('Warm',   '暖色调'),
  presetClaude:     t('Claude', 'Claude 风格'),
  presetCustom:     t('Custom', '自定义'),
  presetWarmDesc:   t('Warm neutral, clay orange accent', '暖中性色，陶土橙强调色'),
  presetClaudeDesc: t('Claude.ai web interface replica',  'Claude.ai 网页版配色复刻'),
  presetCustomDesc: t('Use your custom colors',           '使用自定义配色'),
  quickPickTitle:   t('Select color preset',              '选择配色方案'),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isOurThemeActive(): boolean {
  return vscode.workspace.getConfiguration('workbench').get<string>('colorTheme') === THEME_LABEL;
}

/** Validates a user-supplied preset name at runtime; falls back to 'warm' with a warning. */
function safePreset(name: string): PresetName {
  if (VALID_PRESETS.has(name)) return name as PresetName;
  console.warn(`[Terracotta] Unknown preset "${name}", falling back to "warm"`);
  return 'warm';
}

// ─── Activation ───────────────────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('terracotta.switchPreset', switchPresetCommand)
  );

  applyTokenColors();

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration(CONFIG_ROOT)) {
        applyTokenColors();
      }
      if (event.affectsConfiguration('workbench.colorTheme')) {
        if (isOurThemeActive()) {
          applyTokenColors();    // re-apply when the user switches to our theme
        } else {
          clearInjectedRules(); // clean up when the user switches away
        }
      }
    })
  );
}

export function deactivate(): Promise<void> {
  return clearInjectedRules();
}

// ─── Command: switch preset ────────────────────────────────────────────────────

async function switchPresetCommand(): Promise<void> {
  const items: (vscode.QuickPickItem & { value: PresetName })[] = [
    { label: `$(flame) ${messages.presetWarm}`,   description: messages.presetWarmDesc,   value: 'warm' },
    { label: `$(robot) ${messages.presetClaude}`, description: messages.presetClaudeDesc, value: 'claude' },
    { label: `$(gear) ${messages.presetCustom}`,  description: messages.presetCustomDesc, value: 'custom' },
  ];

  const current = vscode.workspace.getConfiguration(CONFIG_ROOT).get<string>('colorPreset', 'warm');
  items.forEach(item => { if (item.value === current) item.picked = true; });

  const selected = await vscode.window.showQuickPick(items, {
    title: messages.quickPickTitle,
    placeHolder: current,
  });

  if (selected) {
    await vscode.workspace.getConfiguration(CONFIG_ROOT).update(
      'colorPreset',
      selected.value,
      vscode.ConfigurationTarget.Global
    );
  }
}

// ─── Settings injection ────────────────────────────────────────────────────────

async function applyTokenColors(): Promise<void> {
  const config = vscode.workspace.getConfiguration(CONFIG_ROOT);

  if (!config.get<boolean>('enableDynamicColors', true)) {
    return;
  }

  const globalPreset   = safePreset(config.get<string>('colorPreset', 'warm'));
  const langOverrides  = config.get<Record<string, string>>('languages', {});
  const customColors   = config.get<PartialTokenColors>('customColors', {});
  const italicComments = config.get<boolean>('italicComments', true);
  const italicKeywords = config.get<boolean>('italicKeywords', false);
  const boldHeadings   = config.get<boolean>('boldHeadings', true);

  const globalColors = resolvePreset(globalPreset, customColors);
  const globalRules  = buildGlobalRules(globalColors, italicComments, italicKeywords, boldHeadings);

  const langRules: TokenColorRule[] = [];
  const langSemanticColors: Record<string, TokenColors> = {};

  for (const [langId, rawPreset] of Object.entries(langOverrides)) {
    if (rawPreset === 'follow-global') continue;
    const resolved = resolvePreset(safePreset(rawPreset), customColors);
    langRules.push(...buildLanguageRules(langId, resolved, italicComments, boldHeadings));
    langSemanticColors[langId] = resolved;
  }

  try {
    // Sequential awaits: avoid concurrent writes racing on the same settings file
    await vscode.workspace.getConfiguration('editor').update(
      'tokenColorCustomizations',
      { [`[${THEME_LABEL}]`]: { textMateRules: [...globalRules, ...langRules] } },
      vscode.ConfigurationTarget.Global
    );

    await vscode.workspace.getConfiguration('editor').update(
      'semanticTokenColorCustomizations',
      { [`[${THEME_LABEL}]`]: buildSemanticRules(globalColors, italicComments, langSemanticColors) },
      vscode.ConfigurationTarget.Global
    );
  } catch (err) {
    console.error('[Terracotta] Failed to apply token colors:', err);
  }
}

/** Surgically removes only the Terracotta-owned keys from the user's settings. */
async function clearInjectedRules(): Promise<void> {
  try {
    const editorConfig = vscode.workspace.getConfiguration('editor');

    const tokenInspect = editorConfig.inspect<Record<string, unknown>>('tokenColorCustomizations');
    const tokenColors  = { ...(tokenInspect?.globalValue ?? {}) };
    if (`[${THEME_LABEL}]` in tokenColors) {
      delete tokenColors[`[${THEME_LABEL}]`];
      await editorConfig.update(
        'tokenColorCustomizations',
        Object.keys(tokenColors).length > 0 ? tokenColors : undefined,
        vscode.ConfigurationTarget.Global
      );
    }

    const semanticInspect = editorConfig.inspect<Record<string, unknown>>('semanticTokenColorCustomizations');
    const semanticColors  = { ...(semanticInspect?.globalValue ?? {}) };
    if (`[${THEME_LABEL}]` in semanticColors) {
      delete semanticColors[`[${THEME_LABEL}]`];
      await editorConfig.update(
        'semanticTokenColorCustomizations',
        Object.keys(semanticColors).length > 0 ? semanticColors : undefined,
        vscode.ConfigurationTarget.Global
      );
    }
  } catch (err) {
    // Best-effort cleanup — settings may be unavailable during shutdown
    console.error('[Terracotta] Failed to clear injected rules:', err);
  }
}
