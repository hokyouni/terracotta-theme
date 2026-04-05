export type PresetName = 'warm' | 'claude' | 'custom';
export type LanguagePreset = PresetName | 'follow-global';

export interface TokenColors {
  keywords: string;
  controlFlow: string;
  operators: string;
  types: string;
  functions: string;
  parameters: string;
  variables: string;
  properties: string;
  constants: string;
  strings: string;
  templateLiterals: string;
  escapeSequences: string;
  numbers: string;
  regex: string;
  tags: string;
  attributes: string;
  decorators: string;
  comments: string;
  punctuation: string;
}

export type PartialTokenColors = Partial<TokenColors>;

export interface TokenColorRule {
  name?: string;
  scope: string | string[];
  settings: {
    foreground?: string;
    fontStyle?: string;
    background?: string;
  };
}

export interface SemanticTokenColors {
  [key: string]: string | { foreground?: string; fontStyle?: string };
}
