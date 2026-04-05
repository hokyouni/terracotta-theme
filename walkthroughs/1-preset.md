# Color Presets / 配色方案

Terracotta ships with two hand-crafted palettes:

| Preset | Description |
|--------|-------------|
| **warm** *(default)* | Warm neutral tones. Clay orange `#D97757` as the primary accent. Complements the ivory background. |
| **claude** | Exact colors from Claude.ai's web interface syntax highlighter — adapted for the light background. |
| **custom** | You control every token category. Start from `terracotta.customColors` in settings. |

---

**Switch with one click:** the `$(paintcan)` button in the status bar shows your current preset and opens this picker.

**Switch via Command Palette:** `Ctrl/Cmd+Shift+P` → **Terracotta: Switch Color Preset**

---

**Warm preset preview:**
```python
# keywords: clay · strings: olive · types: sky blue
from dataclasses import dataclass

@dataclass
class Config:
    host: str = "localhost"
    port: int = 8080
```

**Claude preset preview:**
```python
# keywords: #7F77DD purple · strings: #1D9E75 teal · types: #993C1D red-brown
from dataclasses import dataclass

@dataclass
class Config:
    host: str = "localhost"
    port: int = 8080
```
