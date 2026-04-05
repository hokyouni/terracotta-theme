import * as vscode from 'vscode';
import { buildGlobalRules, buildLanguageRules, buildSemanticRules } from './scopes';
import { resolvePreset } from './presets';
import { PresetName, PartialTokenColors, TokenColorRule } from './types';

const THEME_LABEL = 'Terracotta Light';
const CONFIG_ROOT = 'terracotta';

// ─── Locale helpers ───────────────────────────────────────────────────────────

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

// ─── Activation ───────────────────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext): void {
  // Command: switch preset
  context.subscriptions.push(
    vscode.commands.registerCommand('terracotta.switchPreset', switchPresetCommand)
  );

  // Initial apply
  applyTokenColors();

  // React to settings changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration(CONFIG_ROOT)) {
        applyTokenColors();
      }
    })
  );
}

export function deactivate(): void {
  // Leave injected rules in place so the theme still renders correctly
  // if the extension is temporarily disabled.
}

// ─── Command: switch preset ────────────────────────────────────────────────────

async function switchPresetCommand(): Promise<void> {
  const items: (vscode.QuickPickItem & { value: PresetName })[] = [
    { label: `$(flame) ${messages.presetWarm}`,   description: messages.presetWarmDesc,   value: 'warm' },
    { label: `$(robot) ${messages.presetClaude}`, description: messages.presetClaudeDesc, value: 'claude' },
    { label: `$(gear) ${messages.presetCustom}`,  description: messages.presetCustomDesc, value: 'custom' },
  ];

  const current = vscode.workspace.getConfiguration(CONFIG_ROOT).get<PresetName>('colorPreset', 'warm');
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

// ─── Core color injection ─────────────────────────────────────────────────────

function applyTokenColors(): void {
  const config = vscode.workspace.getConfiguration(CONFIG_ROOT);

  if (!config.get<boolean>('enableDynamicColors', true)) {
    return;
  }

  const globalPreset    = config.get<PresetName>('colorPreset', 'warm');
  const langOverrides   = config.get<Record<string, string>>('languages', {});
  const customColors    = config.get<PartialTokenColors>('customColors', {});
  const italicComments  = config.get<boolean>('italicComments', true);
  const italicKeywords  = config.get<boolean>('italicKeywords', false);
  const boldHeadings    = config.get<boolean>('boldHeadings', true);

  // 1. Universal rules from the global preset
  const globalColors = resolvePreset(globalPreset, customColors);
  const globalRules = buildGlobalRules(globalColors, italicComments, italicKeywords, boldHeadings);

  // 2. Language-specific supplement rules (appended after global, so they win on equal specificity)
  const langRules: TokenColorRule[] = [];
  for (const [langId, presetName] of Object.entries(langOverrides)) {
    if (presetName === 'follow-global') continue;
    const resolved = resolvePreset(presetName as PresetName, customColors);
    langRules.push(...buildLanguageRules(langId, resolved, italicComments, italicKeywords, boldHeadings));
  }

  const allRules = [...globalRules, ...langRules];

  // 3. Inject tokenColorCustomizations scoped to Terracotta Light only
  vscode.workspace.getConfiguration('editor').update(
    'tokenColorCustomizations',
    { [`[${THEME_LABEL}]`]: { textMateRules: allRules } },
    vscode.ConfigurationTarget.Global
  );

  // 4. Inject semantic token overrides scoped to Terracotta Light only
  vscode.workspace.getConfiguration('editor').update(
    'semanticTokenColorCustomizations',
    { [`[${THEME_LABEL}]`]: buildSemanticRules(globalColors) },
    vscode.ConfigurationTarget.Global
  );
}
