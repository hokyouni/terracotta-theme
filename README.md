# Terracotta

Warm earthy tones for VS Code, built around an ivory paper background, slate text, and clay accents.

适用于 VS Code 的暖土色主题，以象牙白纸感背景、石板黑前景和陶土橙强调色为核心。

## Overview | 简介

Terracotta is a light theme extension inspired by warm editorial surfaces and Claude-like calm contrast. It adds a dynamic preset system on top of the bundled theme so you can switch between a warm default palette, a Claude-flavored preset, and fully custom token colors.

Terracotta 是一个浅色主题扩展，灵感来自温暖的纸张质感界面与 Claude 风格的克制对比。它在内置主题之上提供动态预设系统，可在默认暖色、Claude 风格和完全自定义配色之间切换。

## Color Palette | 色板

| Color | Hex | Role |
| --- | --- | --- |
| Ivory | `#FAF9F5` | Background / 背景 |
| Slate | `#141413` | Foreground / 前景文字 |
| Clay | `#D97757` | Accent / 强调色 |
| Sky | `#6A9BCC` | Blue accents / 蓝色强调 |
| Olive | `#788C5D` | Green accents / 绿色强调 |
| Fig | `#C46686` | Magenta accents / 洋李紫强调 |

## Features | 特性

- Three presets: `warm`, `claude`, and `custom` for different highlighting styles.
- `Terracotta: Switch Color Preset` command for fast preset switching from the Command Palette.
- Warm, paper-like UI designed for long reading and writing sessions.

- 提供三种预设：`warm`、`claude`、`custom`，适配不同的语法高亮风格。
- 支持 `Terracotta: Switch Color Preset` 命令，可在命令面板中快速切换配色预设。
- 整体界面强调温暖、纸感和长时间阅读时的舒适度。

## Installation | 安装

### Marketplace

1. Open Extensions in VS Code.
2. Search for `Terracotta`.
3. Click Install.
4. Run `Preferences: Color Theme` and select `Terracotta Light`.

1. 在 VS Code 中打开扩展市场。
2. 搜索 `Terracotta`。
3. 点击安装。
4. 执行 `Preferences: Color Theme`，选择 `Terracotta Light`。

### From VSIX

1. Build or download the `.vsix` package.
2. Run `Extensions: Install from VSIX...`.
3. Select the generated Terracotta package.
4. Switch your color theme to `Terracotta Light`.

1. 构建或下载 `.vsix` 安装包。
2. 执行 `Extensions: Install from VSIX...`。
3. 选择生成的 Terracotta 安装包。
4. 将颜色主题切换为 `Terracotta Light`。

## Usage | 使用方法

1. Apply `Terracotta Light` as your active color theme.
2. Open Settings and search for `terracotta`.
3. Choose a global preset with `terracotta.colorPreset`.
4. Optionally override specific languages with `terracotta.languages`.
5. Use `Terracotta: Switch Color Preset` when you want to change presets quickly.

1. 将 `Terracotta Light` 设置为当前颜色主题。
2. 打开设置并搜索 `terracotta`。
3. 通过 `terracotta.colorPreset` 选择全局预设。
4. 如有需要，可通过 `terracotta.languages` 为特定语言单独指定预设。
5. 需要快速切换时，执行 `Terracotta: Switch Color Preset` 命令。

## Configuration | 配置项

### Core Settings | 核心设置

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `terracotta.colorPreset` | `string` | `warm` | Global preset: `warm`, `claude`, or `custom`. 全局预设，可选 `warm`、`claude`、`custom`。 |
| `terracotta.languages` | `object` | `{}` | Per-language preset overrides keyed by VS Code language ID. 按 VS Code 语言 ID 指定单独预设。 |
| `terracotta.customColors` | `object` | `{}` | Custom token colors used by the `custom` preset. `custom` 预设使用的自定义语法颜色。 |
| `terracotta.italicComments` | `boolean` | `true` | Render comments in italic. 注释使用斜体。 |
| `terracotta.italicKeywords` | `boolean` | `false` | Render keywords in italic. 关键字使用斜体。 |
| `terracotta.boldHeadings` | `boolean` | `true` | Render Markdown and LaTeX headings in bold. Markdown 和 LaTeX 标题使用粗体。 |
| `terracotta.enableDynamicColors` | `boolean` | `true` | Enable live token color injection for the active preset. 启用当前预设的动态语法颜色注入。 |

### `terracotta.customColors.*` Keys | 自定义颜色键

| Key | Purpose |
| --- | --- |
| `keywords` | Keywords and storage modifiers. 关键字与声明修饰符。 |
| `controlFlow` | Flow control keywords such as `if`, `for`, `return`. 流程控制关键字。 |
| `operators` | Operators and operator-like punctuation. 运算符与相关符号。 |
| `types` | Types, classes, interfaces, enums. 类型、类、接口、枚举。 |
| `functions` | Function and method names. 函数与方法名。 |
| `parameters` | Parameters and arguments. 参数名。 |
| `variables` | Local and global variables. 变量名。 |
| `properties` | Object properties and record fields. 对象属性与字段。 |
| `constants` | Constants and enum members. 常量与枚举成员。 |
| `strings` | String literals. 字符串字面量。 |
| `templateLiterals` | Template literal punctuation and interpolation. 模板字符串与插值符号。 |
| `escapeSequences` | Escapes and formatting placeholders. 转义序列与格式占位符。 |
| `numbers` | Numeric literals. 数字字面量。 |
| `regex` | Regular expression literals. 正则表达式。 |
| `tags` | HTML, JSX, and selector tags. HTML、JSX 与选择器标签。 |
| `attributes` | Attribute and prop names. 属性名与 props 名。 |
| `decorators` | Decorators and language attributes. 装饰器与语言属性。 |
| `comments` | Inline and block comments. 行内与块注释。 |
| `punctuation` | Brackets, delimiters, and structure symbols. 括号、分隔符与结构性标点。 |

## Example Configuration | 配置示例

```json
{
  "workbench.colorTheme": "Terracotta Light",
  "terracotta.colorPreset": "warm",
  "terracotta.languages": {
    "python": "claude",
    "css": "custom"
  },
  "terracotta.customColors": {
    "keywords": "#D97757",
    "strings": "#788C5D",
    "types": "#6A9BCC"
  }
}
```

## Screenshots | 截图

Place your marketplace screenshots here before publishing:

- Placeholder: `screenshots/editor.png`
- Placeholder: `screenshots/markdown.png`
- Placeholder: `screenshots/settings.png`

发布前可在这里替换为市场截图：

- 占位文件：`screenshots/editor.png`
- 占位文件：`screenshots/markdown.png`
- 占位文件：`screenshots/settings.png`

## Commands | 命令

- `Terracotta: Switch Color Preset` switches between `warm`, `claude`, and `custom`.

- `Terracotta: Switch Color Preset` 用于在 `warm`、`claude` 和 `custom` 之间切换。

## License | 许可

Apache License 2.0. See the bundled `LICENSE` file.

基于 Apache License 2.0 发布，详见扩展内附带的 `LICENSE` 文件。
