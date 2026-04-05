import { TokenColors, TokenColorRule, SemanticTokenColors } from './types';

function rule(
  name: string,
  scope: string | string[],
  foreground: string,
  fontStyle = ''
): TokenColorRule {
  const settings: TokenColorRule['settings'] = { foreground };
  if (fontStyle !== '') settings.fontStyle = fontStyle;
  return { name, scope, settings };
}

// ─── Universal rules (no language prefix) ────────────────────────────────────
// These cover ~95% of all languages via shared TextMate scope conventions.

export function buildGlobalRules(
  c: TokenColors,
  italicComments: boolean,
  italicKeywords: boolean,
  boldHeadings: boolean
): TokenColorRule[] {
  const commentStyle = italicComments ? 'italic' : '';
  const keywordStyle = italicKeywords ? 'italic' : '';
  const headingStyle = boldHeadings ? 'bold' : '';

  return [
    // Comments
    rule('Comment', ['comment', 'punctuation.definition.comment'], c.comments, commentStyle),

    // Keywords
    rule('Keyword', ['keyword', 'storage', 'storage.modifier'], c.keywords, keywordStyle),
    rule('Control flow', [
      'keyword.control',
      'keyword.control.flow',
      'keyword.other.unit',
      'storage.type',
    ], c.controlFlow, keywordStyle),

    // Operators
    rule('Operator', [
      'keyword.operator',
      'keyword.operator.assignment',
      'keyword.operator.comparison',
      'keyword.operator.logical',
      'keyword.operator.arithmetic',
      'punctuation.separator.key-value',
    ], c.operators),

    // Types
    rule('Type / Class', [
      'entity.name.type',
      'entity.name.class',
      'entity.name.interface',
      'entity.name.struct',
      'entity.name.enum',
      'support.type',
      'support.class',
      'support.type.primitive',
      'support.type.builtin',
    ], c.types),

    // Functions
    rule('Function / Method', [
      'entity.name.function',
      'entity.name.method',
      'entity.name.method.js',
      'support.function',
      'variable.function',
    ], c.functions),

    // Parameters
    rule('Parameter', [
      'variable.parameter',
      'variable.parameter.function.language.special',
    ], c.parameters),

    // Variables
    rule('Variable', [
      'variable',
      'variable.other',
      'variable.other.readwrite',
    ], c.variables),

    // Properties
    rule('Property', [
      'variable.other.property',
      'variable.other.member',
      'meta.property-name',
      'support.variable.property',
      'support.type.property-name',
    ], c.properties),

    // Constants / Enums
    rule('Constant', [
      'constant',
      'constant.language',
      'constant.language.boolean',
      'constant.language.null',
      'constant.language.undefined',
      'variable.other.constant',
      'variable.other.enummember',
    ], c.constants),

    // Strings
    rule('String', [
      'string',
      'string.quoted',
      'string.quoted.single',
      'string.quoted.double',
      'string.quoted.triple',
      'punctuation.definition.string.begin',
      'punctuation.definition.string.end',
    ], c.strings),

    // Template literals
    rule('Template literal', [
      'string.template',
      'string.interpolated',
      'punctuation.definition.template-expression.begin',
      'punctuation.definition.template-expression.end',
      'meta.template.expression',
    ], c.templateLiterals),

    // Escape sequences
    rule('Escape / placeholder', [
      'constant.character.escape',
      'constant.other.placeholder',
    ], c.escapeSequences),

    // Numbers
    rule('Number', [
      'constant.numeric',
      'constant.numeric.integer',
      'constant.numeric.float',
      'constant.numeric.hex',
      'constant.numeric.octal',
      'constant.numeric.binary',
    ], c.numbers),

    // Regex
    rule('Regex', [
      'string.regexp',
      'punctuation.definition.group.regexp',
      'constant.character.character-class.regexp',
      'keyword.operator.quantifier.regexp',
    ], c.regex),

    // Tags
    rule('Tag', [
      'entity.name.tag',
      'punctuation.definition.tag',
      'punctuation.definition.tag.begin',
      'punctuation.definition.tag.end',
    ], c.tags),

    // Attributes
    rule('Attribute', [
      'entity.other.attribute-name',
      'entity.other.attribute-name.html',
    ], c.attributes),

    // Decorators
    rule('Decorator', [
      'entity.name.function.decorator',
      'meta.decorator',
      'meta.decorator punctuation.decorator',
      'punctuation.decorator',
    ], c.decorators),

    // Punctuation (subtle, lower priority)
    rule('Punctuation', [
      'punctuation.definition',
      'meta.brace.round',
      'meta.brace.square',
      'meta.brace.curly',
    ], c.punctuation),

    // ── Markdown ──────────────────────────────────────────────────────────────
    rule('Markdown heading', [
      'markup.heading',
      'markup.heading.markdown',
      'entity.name.section.markdown',
    ], c.tags, headingStyle),

    rule('Markdown bold', 'markup.bold', c.variables, 'bold'),
    rule('Markdown italic', 'markup.italic', c.variables, 'italic'),
    rule('Markdown code', [
      'markup.inline.raw.string.markdown',
      'markup.fenced_code.block.markdown',
    ], c.constants),
    rule('Markdown link', 'markup.underline.link.markdown', c.strings, 'underline'),
    rule('Markdown link title', 'string.other.link.title.markdown', c.types),
    rule('Markdown list bullet', 'markup.list.bullet.markdown', c.operators),
    rule('Markdown separator', 'meta.separator.markdown', c.comments),
    rule('Markdown lang', 'fenced_code.block.language.markdown', c.keywords),
  ];
}

// ─── Language-specific supplement rules ───────────────────────────────────────
// Prefixed scopes override the universal rules for one language.

export function buildLanguageRules(
  langId: string,
  c: TokenColors,
  italicComments: boolean,
  boldHeadings: boolean
): TokenColorRule[] {
  switch (langId) {
    case 'javascript':
    case 'javascriptreact':
      return jsRules(c);
    case 'typescript':
    case 'typescriptreact':
      return tsRules(c);
    case 'vue':
      return vueRules(c, italicComments);
    case 'python':
      return pythonRules(c, italicComments);
    case 'rust':
      return rustRules(c);
    case 'go':
      return goRules(c);
    case 'c':
      return cRules(c);
    case 'cpp':
      return cppRules(c);
    case 'html':
      return htmlRules(c);
    case 'css':
    case 'scss':
    case 'less':
      return cssRules(c);
    case 'json':
    case 'jsonc':
      return jsonRules(c);
    case 'shellscript':
    case 'bash':
    case 'sh':
      return shellRules(c);
    case 'yaml':
      return yamlRules(c);
    case 'toml':
      return tomlRules(c);
    case 'markdown':
      return markdownRules(c, boldHeadings);
    case 'latex':
    case 'tex':
      return latexRules(c, italicComments);
    default:
      return [];
  }
}

// ── JavaScript ────────────────────────────────────────────────────────────────
function jsRules(c: TokenColors): TokenColorRule[] {
  return [
    rule('JS: JSDoc type', 'variable.other.jsdoc', c.types),
    rule('JS: import/export keyword', 'keyword.control.import.js', c.keywords),
  ];
}

// ── TypeScript ────────────────────────────────────────────────────────────────
function tsRules(c: TokenColors): TokenColorRule[] {
  return [
    rule('TS: type annotation', 'meta.type.annotation entity.name.type', c.types),
    rule('TS: generic type param', 'meta.type.parameters entity.name.type', c.parameters),
    rule('TS: interface keyword', 'storage.type.interface.ts', c.keywords),
    rule('TS: enum member', 'variable.other.enummember.ts', c.constants),
    rule('TS: decorator', [
      'meta.decorator.ts',
      'meta.decorator.ts entity.name.function.ts',
    ], c.decorators),
    rule('TS: JSX element', [
      'support.class.component.tsx',
      'support.class.component.ts',
    ], c.types),
    rule('TS: JSX tag', [
      'entity.name.tag.tsx',
      'entity.name.tag.ts',
    ], c.tags),
  ];
}

// ── Vue ───────────────────────────────────────────────────────────────────────
function vueRules(c: TokenColors, italicComments: boolean): TokenColorRule[] {
  const commentStyle = italicComments ? 'italic' : '';
  return [
    // Vue directives
    rule('Vue: directive', [
      'entity.other.attribute-name.html.vue',
    ], c.keywords),
    rule('Vue: directive modifier', 'meta.attribute.directive.html', c.keywords),
    rule('Vue: script lang comment', 'text.html.vue meta.lang.ts comment', c.comments, commentStyle),
    // Component tag
    rule('Vue: component', 'entity.name.tag.html.vue', c.types),
  ];
}

// ── Python ────────────────────────────────────────────────────────────────────
function pythonRules(c: TokenColors, italicComments: boolean): TokenColorRule[] {
  const commentStyle = italicComments ? 'italic' : '';
  return [
    rule('Python: self / cls', 'variable.parameter.function.language.special.python', c.parameters, 'italic'),
    rule('Python: decorator', [
      'entity.name.function.decorator.python',
      'meta.function.decorator.python entity.name.function',
    ], c.decorators),
    rule('Python: builtin constant', 'constant.language.python', c.constants),
    rule('Python: logical operator', 'keyword.operator.logical.python', c.controlFlow),
    rule('Python: exception name', 'support.type.exception.python', c.types),
    rule('Python: f-string expression', [
      'meta.fstring.python',
      'string.interpolated.python',
      'punctuation.definition.template-expression.begin.python',
      'punctuation.definition.template-expression.end.python',
    ], c.templateLiterals),
    rule('Python: type hint', 'meta.function.parameters.annotation.python', c.types),
    rule('Python: docstring', 'string.quoted.docstring.multi.python', c.comments, commentStyle),
  ];
}

// ── Rust ──────────────────────────────────────────────────────────────────────
function rustRules(c: TokenColors): TokenColorRule[] {
  return [
    rule('Rust: lifetime', [
      'keyword.other.lifetime.rust',
      'storage.modifier.lifetime.rust',
      'entity.name.lifetime.rust',
    ], c.parameters),
    rule('Rust: attribute macro', [
      'meta.attribute.rust',
      'meta.attribute.rust entity.name.function.rust',
    ], c.decorators),
    rule('Rust: function macro', 'entity.name.function.macro.rust', c.functions),
    rule('Rust: primitive type', 'entity.name.type.primitive.rust', c.types),
    rule('Rust: keyword (pub, impl, trait, where)', [
      'keyword.other.rust',
      'storage.type.rust',
    ], c.keywords),
    rule('Rust: enum variant', 'entity.name.type.rust', c.types),
    rule('Rust: self', 'variable.language.self.rust', c.parameters),
    rule('Rust: char literal', 'string.quoted.single.rust', c.constants),
    rule('Rust: number suffix', 'storage.type.numeric.rust', c.types),
  ];
}

// ── Go ────────────────────────────────────────────────────────────────────────
function goRules(c: TokenColors): TokenColorRule[] {
  return [
    rule('Go: type keyword', 'keyword.type.go', c.keywords),
    rule('Go: builtin type', 'support.type.builtin.go', c.types),
    rule('Go: rune literal', 'constant.other.rune.go', c.constants),
    rule('Go: import path', 'entity.name.import.go', c.strings),
    rule('Go: package name', 'entity.name.package.go', c.types),
    rule('Go: predeclared identifier', 'support.function.builtin.go', c.functions),
  ];
}

// ── C ─────────────────────────────────────────────────────────────────────────
function cRules(c: TokenColors): TokenColorRule[] {
  return [
    rule('C: storage type', 'storage.type.c', c.types),
    rule('C: struct type', 'entity.name.type.c', c.types),
    rule('C: preprocessor', [
      'keyword.other.preprocessor.c',
      'meta.preprocessor.c',
    ], c.decorators),
    rule('C: preprocessor constant', 'constant.other.variable.mac-classic.c', c.constants),
    rule('C: macro invocation', 'entity.name.function.preprocessor.c', c.decorators),
  ];
}

// ── C++ ───────────────────────────────────────────────────────────────────────
function cppRules(c: TokenColors): TokenColorRule[] {
  return [
    ...cRules(c),
    rule('C++: storage type', 'storage.type.cpp', c.types),
    rule('C++: template type param', 'entity.name.type.template.cpp', c.parameters),
    rule('C++: namespace resolution', 'entity.name.scope-resolution.cpp', c.types),
    rule('C++: template type in call', 'meta.template.call.cpp entity.name.type', c.types),
    rule('C++: overloaded operator', 'keyword.operator.overload.cpp', c.operators),
  ];
}

// ── HTML ──────────────────────────────────────────────────────────────────────
function htmlRules(c: TokenColors): TokenColorRule[] {
  return [
    rule('HTML: tag name', 'entity.name.tag.html', c.tags),
    rule('HTML: tag punctuation', [
      'punctuation.definition.tag.begin.html',
      'punctuation.definition.tag.end.html',
      'punctuation.definition.tag.html',
    ], c.tags),
    rule('HTML: attribute name', 'entity.other.attribute-name.html', c.attributes),
    rule('HTML: attribute value', [
      'string.quoted.double.html',
      'string.quoted.single.html',
    ], c.strings),
    rule('HTML: doctype', 'meta.tag.sgml.doctype.html', c.comments),
    rule('HTML: entity', 'constant.character.entity.html', c.escapeSequences),
  ];
}

// ── CSS / SCSS / Less ─────────────────────────────────────────────────────────
function cssRules(c: TokenColors): TokenColorRule[] {
  return [
    rule('CSS: element selector', 'entity.name.tag.css', c.tags),
    rule('CSS: class selector', 'entity.other.attribute-name.class.css', c.types),
    rule('CSS: id selector', 'entity.other.attribute-name.id.css', c.constants),
    rule('CSS: pseudo-class / pseudo-element', [
      'entity.other.attribute-name.pseudo-class.css',
      'entity.other.attribute-name.pseudo-element.css',
    ], c.keywords),
    rule('CSS: property name', [
      'support.type.property-name.css',
      'support.type.property-name.scss',
      'support.type.property-name.less',
      'meta.property-name.css',
    ], c.properties),
    rule('CSS: property value keyword', 'support.constant.property-value.css', c.constants),
    rule('CSS: color value', 'constant.other.color.rgb-value.css', c.numbers),
    rule('CSS: unit', 'keyword.other.unit.css', c.operators),
    rule('CSS: variable / custom property', [
      'variable.css',
      'variable.scss',
      'variable.other.less',
    ], c.variables),
    rule('CSS: at-rule keyword', [
      'keyword.control.at-rule.css',
      'keyword.control.at-rule.scss',
    ], c.keywords),
    rule('CSS: selector combinator', 'keyword.operator.combinator.css', c.operators),
    rule('CSS: important', 'keyword.other.important.css', c.keywords),
    rule('CSS: SCSS mixin', 'entity.name.function.scss', c.functions),
    rule('CSS: SCSS interpolation', 'punctuation.definition.interpolation', c.templateLiterals),
  ];
}

// ── JSON / JSONC ───────────────────────────────────────────────────────────────
function jsonRules(c: TokenColors): TokenColorRule[] {
  return [
    rule('JSON: key', [
      'support.type.property-name.json',
      'string.quoted.double.json meta.object-literal.key',
    ], c.properties),
    rule('JSON: string value', 'string.quoted.double.json', c.strings),
    rule('JSON: constant', 'constant.language.json', c.constants),
    rule('JSON: number', 'constant.numeric.json', c.numbers),
  ];
}

// ── Shell / Bash ──────────────────────────────────────────────────────────────
function shellRules(c: TokenColors): TokenColorRule[] {
  return [
    rule('Shell: control', 'keyword.control.shell', c.controlFlow),
    rule('Shell: command', 'entity.name.command.shell', c.functions),
    rule('Shell: variable', [
      'variable.other.normal.shell',
      'variable.other.bracket.shell',
      'variable.other.special.shell',
    ], c.variables),
    rule('Shell: string double', 'string.quoted.double.shell', c.strings),
    rule('Shell: string single', 'string.quoted.single.shell', c.strings),
    rule('Shell: interpolation', [
      'meta.string.interpolation.shell',
      'punctuation.definition.string.interpolated.shell',
    ], c.templateLiterals),
    rule('Shell: option flag', 'constant.other.option.shell', c.operators),
    rule('Shell: redirect', 'keyword.operator.redirect.shell', c.operators),
    rule('Shell: heredoc', 'string.unquoted.heredoc.shell', c.strings),
    rule('Shell: shebang', 'comment.line.shebang.shell', c.decorators),
  ];
}

// ── YAML ──────────────────────────────────────────────────────────────────────
function yamlRules(c: TokenColors): TokenColorRule[] {
  return [
    rule('YAML: key', [
      'meta.mapping.key.yaml string',
      'entity.name.tag.yaml',
    ], c.properties),
    rule('YAML: anchor / alias', [
      'punctuation.definition.anchor.yaml',
      'punctuation.definition.alias.yaml',
      'entity.name.type.anchor.yaml',
    ], c.constants),
    rule('YAML: boolean', 'constant.language.boolean.yaml', c.constants),
    rule('YAML: null', 'constant.language.null.yaml', c.constants),
    rule('YAML: number', [
      'constant.numeric.integer.yaml',
      'constant.numeric.float.yaml',
    ], c.numbers),
    rule('YAML: string', [
      'string.unquoted.plain.out.yaml',
      'string.quoted.double.yaml',
      'string.quoted.single.yaml',
    ], c.strings),
    rule('YAML: sequence bullet', 'punctuation.definition.block.sequence.item.yaml', c.operators),
    rule('YAML: document marker', 'punctuation.definition.document.yaml', c.operators),
    rule('YAML: merge key', 'constant.language.merge.yaml', c.keywords),
  ];
}

// ── TOML ──────────────────────────────────────────────────────────────────────
function tomlRules(c: TokenColors): TokenColorRule[] {
  return [
    rule('TOML: key', 'support.type.property-name.toml', c.properties),
    rule('TOML: section header', 'entity.name.section.toml', c.types),
    rule('TOML: string', [
      'string.quoted.double.toml',
      'string.quoted.single.toml',
      'string.quoted.triple.toml',
    ], c.strings),
    rule('TOML: boolean', 'constant.language.boolean.toml', c.constants),
    rule('TOML: number', [
      'constant.numeric.integer.toml',
      'constant.numeric.float.toml',
    ], c.numbers),
    rule('TOML: table brackets', [
      'punctuation.definition.table.toml',
      'punctuation.definition.array.toml',
    ], c.tags),
  ];
}

// ── Markdown ──────────────────────────────────────────────────────────────────
function markdownRules(c: TokenColors, boldHeadings: boolean): TokenColorRule[] {
  const headingStyle = boldHeadings ? 'bold' : '';
  return [
    // These are more specific overrides on top of the global markdown rules
    rule('Markdown: h1', 'markup.heading.1.markdown', c.tags, headingStyle),
    rule('Markdown: h2-h6', [
      'markup.heading.2.markdown',
      'markup.heading.3.markdown',
      'markup.heading.4.markdown',
      'markup.heading.5.markdown',
      'markup.heading.6.markdown',
    ], c.properties, headingStyle),
    rule('Markdown: blockquote', 'markup.quote.markdown', c.comments),
    rule('Markdown: table header', 'markup.bold.markdown', c.types, 'bold'),
    rule('Markdown: strike', 'markup.strikethrough.markdown', c.comments),
  ];
}

// ── LaTeX ─────────────────────────────────────────────────────────────────────
function latexRules(c: TokenColors, italicComments: boolean): TokenColorRule[] {
  const commentStyle = italicComments ? 'italic' : '';
  return [
    rule('LaTeX: control sequence', 'support.function.latex', c.keywords),
    rule('LaTeX: preamble commands', [
      'keyword.control.preamble.latex',
      'support.class.latex',
    ], c.decorators),
    rule('LaTeX: environment name', 'support.class.latex', c.types),
    rule('LaTeX: argument', 'variable.parameter.latex', c.parameters),
    rule('LaTeX: reference / cite', 'constant.other.reference.latex', c.constants),
    rule('LaTeX: math mode', [
      'string.other.math.latex',
      'meta.math.block.latex',
    ], c.numbers),
    rule('LaTeX: comment', 'comment.line.percentage.latex', c.comments, commentStyle),
    rule('LaTeX: begin/end punctuation', [
      'punctuation.definition.begin.latex',
      'punctuation.definition.end.latex',
    ], c.punctuation),
  ];
}

// ─── Semantic token colors ────────────────────────────────────────────────────

function semanticEntry(c: TokenColors, italicComments: boolean): SemanticTokenColors {
  return {
    'keyword':                 c.keywords,
    'number':                  c.numbers,
    'regexp':                  c.regex,
    'operator':                c.operators,
    'string':                  c.strings,
    'comment':                 italicComments
                                 ? { foreground: c.comments, fontStyle: 'italic' }
                                 : c.comments,
    'type':                    c.types,
    'class':                   c.types,
    'interface':               c.types,
    'enum':                    c.types,
    'struct':                  c.types,
    'typeParameter':           c.parameters,
    'parameter':               c.parameters,
    'variable':                c.variables,
    'variable.defaultLibrary': c.constants,
    'property':                c.properties,
    'function':                c.functions,
    'function.defaultLibrary': c.functions,
    'method':                  c.functions,
    'decorator':               c.decorators,
    'macro':                   c.decorators,
    'namespace':               c.types,
    'enumMember':              c.constants,
    'selfKeyword':             c.parameters,
  };
}

export function buildSemanticRules(
  globalColors: TokenColors,
  italicComments: boolean,
  langOverrides: Record<string, TokenColors> = {}
): SemanticTokenColors {
  const rules: SemanticTokenColors = semanticEntry(globalColors, italicComments);

  // Per-language semantic overrides using "tokenType:languageId" scoping syntax.
  // This mirrors the per-language TextMate rules so both highlighting systems stay in sync.
  for (const [langId, lc] of Object.entries(langOverrides)) {
    const lang = semanticEntry(lc, italicComments);
    for (const [token, value] of Object.entries(lang)) {
      rules[`${token}:${langId}`] = value;
    }
  }

  return rules;
}
