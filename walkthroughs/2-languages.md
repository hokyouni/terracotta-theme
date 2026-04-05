# Per-Language Presets / 按语言配色

You can use a different color preset for each language without changing the global one.

## How to configure / 如何配置

Open settings (`Ctrl/Cmd+,`) and add:

```jsonc
// settings.json
{
  "terracotta.colorPreset": "warm",       // global default
  "terracotta.languages": {
    "python":     "claude",               // Python uses the Claude palette
    "css":        "custom",               // CSS uses your custom colors
    "markdown":   "follow-global"         // Markdown follows the global preset (default)
  }
}
```

## Common language IDs / 常用语言 ID

| Language | ID |
|---|---|
| JavaScript | `javascript` |
| TypeScript | `typescript` |
| JSX / TSX | `javascriptreact` / `typescriptreact` |
| Vue | `vue` |
| Python | `python` |
| Rust | `rust` |
| Go | `go` |
| C / C++ | `c` / `cpp` |
| HTML | `html` |
| CSS / SCSS | `css` / `scss` |
| JSON | `json` |
| YAML / TOML | `yaml` / `toml` |
| Shell | `shellscript` |
| Markdown | `markdown` |
| LaTeX | `latex` |

> **Tip:** Not sure of a file's language ID? Click the language indicator in the bottom-right of VS Code's status bar.
