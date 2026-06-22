# Hooman Language — VS Code Extension

Syntax highlighting and language support for the **Hooman** scripting language (`.hmn`), which transpiles to TypeScript.

---

## Features

- Full syntax highlighting for all Hooman constructs
- Auto-closing `<>` angle brackets
- Indentation rules for `do`/`end` and `shape` blocks
- Bundled **Hooman Dark** color theme (optional)
- Comment support (`//`)

### Highlighted constructs

| Construct | Keywords |
|---|---|
| Variable declaration | `create`, `store`, `in` |
| Functions | `callable`, `call`, `with`, `as` |
| Classes | `template`, `shape`, `assemble` |
| Loops | `loop`, `do`, `end` |
| Types | `text`, `number`, `boolean`, `void`, `list of` |
| Arrays | `add`, `remove`, `item`, `of`, `length` |
| Output | `print` |
| Imports | `use`, `from` |
| Self reference | `self` |
| Boolean literals | `true`, `false` |

---

## Installation

### From source (`.vsix`)

1. Install the VS Code Extension CLI if you haven't already:
   ```
   npm install -g @vscode/vsce
   ```
2. Inside this folder, run:
   ```
   vsce package
   ```
   This produces `hooman-language-1.0.0.vsix`.
3. In VS Code, open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:
   ```
   Extensions: Install from VSIX...
   ```
   Select the `.vsix` file.

### Development mode (no packaging needed)

1. Copy this folder to your VS Code extensions directory:
   - **macOS/Linux:** `~/.vscode/extensions/hooman-language`
   - **Windows:** `%USERPROFILE%\.vscode\extensions\hooman-language`
2. Restart VS Code (or run `Developer: Reload Window`).

---

## Optional: Use the Hooman Dark theme

1. Open the Command Palette → `Preferences: Color Theme`
2. Select **Hooman Dark**

---

## Example

```hmn
template <Dog>
shape
    <text> as <name>
    <number> as <age>

    assemble with <text as name, number as age>
    do
        store <name> in self<name>
        store <age> in self<age>
    end

    callable <text> as <greet>
    do
        print <Woof! I'm <self<name>> and I'm <self<age>> years old.>
    end
end

create <Dog> as <buddy> with <<Buddy>, <3>>
call <buddy<greet>>
```

---

## Language Reference

See `LANGUAGE_MANIFEST.md` for the full Hooman language specification.
