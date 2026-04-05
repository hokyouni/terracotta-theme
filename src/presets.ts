import { TokenColors, PartialTokenColors, PresetName } from './types';

// Warm neutral palette — primary accent: clay #D97757
// Designed to complement the UI's ivory/charcoal aesthetic
export const warmPreset: TokenColors = {
  keywords:         '#C6613F',
  controlFlow:      '#B85F3D',
  operators:        '#5E5D59',
  types:            '#3F79AA',
  functions:        '#B85F3D',
  parameters:       '#946A1E',
  variables:        '#141413',
  properties:       '#5E5D59',
  constants:        '#C6613F',
  strings:          '#4D6E3E',
  templateLiterals: '#6A9BCC',
  escapeSequences:  '#B85F3D',
  numbers:          '#946A1E',
  regex:            '#946A1E',
  tags:             '#C6613F',
  attributes:       '#946A1E',
  decorators:       '#A64C6A',
  comments:         '#87867F',
  punctuation:      '#87867F',
};

// Extracted from Claude.ai web interface (saved_resource.html, style block 6)
// Claude uses a custom syntax highlighter (not hljs) with these exact light-mode colors:
//   .kw=#7F77DD  .str=#1D9E75  .num=#D85A30  .fn=#185FA5  .dec=#BA7517
//   .ty=#993C1D  .rx=#993556   .sel=#7F77DD  .prop=#185FA5 .at=#3B6D11
//   .val=#D85A30 .var=#D85A30  .lt=#BA7517   .mac=#993556  .unit=#993C1D
//   .cm=rgba(115,114,108,1)=#73726C (italic)
export const claudePreset: TokenColors = {
  keywords:         '#7F77DD',  // .kw
  controlFlow:      '#7F77DD',  // .kw
  operators:        '#73726C',  // --color-text-tertiary (no explicit class)
  types:            '#993C1D',  // .ty
  functions:        '#185FA5',  // .fn
  parameters:       '#D85A30',  // .var (closest mapping)
  variables:        '#D85A30',  // .var
  properties:       '#185FA5',  // .prop
  constants:        '#BA7517',  // .lt (literals)
  strings:          '#1D9E75',  // .str
  templateLiterals: '#1D9E75',  // .str
  escapeSequences:  '#993556',  // .mac / .rx
  numbers:          '#D85A30',  // .num
  regex:            '#993556',  // .rx
  tags:             '#7F77DD',  // .sel (CSS selectors = HTML tags)
  attributes:       '#3B6D11',  // .at
  decorators:       '#BA7517',  // .dec
  comments:         '#73726C',  // .cm = var(--color-text-tertiary) light
  punctuation:      '#73726C',  // default text-tertiary
};

export function resolvePreset(name: PresetName, customColors: PartialTokenColors): TokenColors {
  if (name === 'claude') {
    return claudePreset;
  }
  if (name === 'custom') {
    return { ...warmPreset, ...customColors };
  }
  return warmPreset;
}
