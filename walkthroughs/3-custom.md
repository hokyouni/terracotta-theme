# Custom Colors / 自定义颜色

When `terracotta.colorPreset` (or a per-language override) is set to `"custom"`, the extension uses `terracotta.customColors` for that language. Any token category you leave unset falls back to the **warm** preset.

## Token categories / Token 分类

| Category | Covers |
|---|---|
| `keywords` | `const`, `function`, `import`, `class`, … |
| `controlFlow` | `if`, `else`, `for`, `while`, `return`, … |
| `operators` | `+`, `-`, `===`, `=>`, `:`, … |
| `types` | Class names, interfaces, enums, structs |
| `functions` | Function and method names |
| `parameters` | Function parameters |
| `variables` | Variable names |
| `properties` | Object property names |
| `constants` | Constants, enum members |
| `strings` | String literals |
| `templateLiterals` | Template expression punctuation `${}` |
| `escapeSequences` | `\n`, `\t`, `%s`, `{0}` |
| `numbers` | Numeric literals |
| `regex` | Regular expressions |
| `tags` | HTML/JSX/CSS tags and selectors |
| `attributes` | HTML/JSX attribute names |
| `decorators` | `@decorator`, `#[derive]` |
| `comments` | Inline and block comments |
| `punctuation` | Brackets and delimiters |

## Example / 示例

```jsonc
// settings.json
{
  "terracotta.colorPreset": "custom",
  "terracotta.customColors": {
    "keywords":   "#7F77DD",   // purple
    "strings":    "#1D9E75",   // teal
    "numbers":    "#D85A30",   // orange
    "functions":  "#185FA5",   // blue
    "comments":   "#73726C",   // gray
    "types":      "#993C1D"    // red-brown
  }
}
```

> **Tip:** Use `terracotta.enableDynamicColors: false` to freeze the injected colors and manually edit `editor.tokenColorCustomizations` without the extension overwriting your changes.
