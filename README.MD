# 📂 Files Structure Resolver

**FilesStructureResolver** is a Node.js script that generates a visual, emoji-enhanced tree view of the current
directory's file structure, including file types, sizes, and icons.

It outputs the result to files named `#FilesStructure.txt` (by default), and can optionally generate `#FilesStructure.md` and `#FilesStructure.json` outputs.

---

## 🔧 Features

- Highly configurable output behavior via booleans
- Recursively scans directories and files
- Shows total folder size next to folder names
- Groups files by type with relevant emoji icons:
    - 📁 Closed folder
    - 📂 Open folder
    - 📄 File
    - 🖼️ Image
    - 🎞️ Video
    - 🎵 Audio
    - 📋 Document
    - 📓 PDF
    - 📙 Ebook / Book
    - 📝 Code
    - 🗃️ Archive
    - 📊 Spreadsheet
    - 📽️ Presentation
    - 🔤 Font
    - ⚙️ Executable
    - 🤖 Android
    - 📱 iOS
    - 🗄️ Database
    - 💿 Disk image
    - 📜 Log
    - 🛠️ Config
    - 🖥️ Script
    - 📑 Markdown
    - 🔧 Makefile / Build
    - 🔒 Security
    - 💾 Backup
    - 🐳 Docker
    - 🧹 Temp
    - 🧰 Utility
- Skips:
    - Symbolic links
    - Some system folders
    - Hidden dotfiles (e.g. `.idea`, `.git`)
    - Files listed in an ignore list including output files (`#FilesStructure.md`, `#FilesStructure.txt`, `#FilesStructure.json`, `#FilesStructureResolver.bat`, `#FilesStructureResolver.mjs`)
- Sorts output ascending with directories first, then files
- Outputs human-readable sizes (`B`, `KB`, `MB`, etc.) with two decimal precision
- Supports output in three formats:
  - Text (`#FilesStructure.txt`) - default output
  - Markdown with clickable file links (`#FilesStructure.md`)
  - JSON (`#FilesStructure.json`)

---

## 🚀 Usage

1. **Ensure you have [Node.js](https://nodejs.org/en) installed**
2. **Place the script in the root folder you want to analyze**
3. **Run the script via `#FilesStructureResolver.bat` or run it directly in terminal:**

```bash
node "#FilesStructureResolver.mjs"
````

4. **Check the outputs:**  
   By default, `#FilesStructure.txt` will be created.  
   If enabled, `#FilesStructure.md` and/or `#FilesStructure.json` will also be generated.

---

## ⚙️ Configuration

Inside `#FilesStructureResolver.mjs`, you can configure output behavior:

```js
static CREATE_OUTPUT_TXT = true;    // Generate text output file (default: true)
static CREATE_OUTPUT_MD = false;    // Generate markdown output file (default: false)
static CREATE_OUTPUT_JSON = false;  // Generate JSON output file (default: false)

static ENABLE_LOGGING = false;      // Enable detailed console logging (default: false)

static IGNORE_DOT_FILES = true;     // Skip hidden dotfiles and folders (default: true)

static IGNORED_NAMES = [            // Files to always ignore during scan
  '#FilesStructure.md',
  '#FilesStructure.txt',
  '#FilesStructure.json',
  '#FilesStructureResolver.bat',
  '#FilesStructureResolver.mjs',
];
```

Modify these flags at the top of the script to suit your needs.

---

## 📁 Output Location

```txt
#FilesStructure.md
#FilesStructure.txt
#FilesStructure.json
```

* Located in the directory where the script is run.
* Automatically overwritten with each run.

---

## 📄 Example Output: #FilesStructure.txt

```cs
📂 D:\Projects\My Project (5.78 MB)
├── 📂 assets (2.34 MB)
│    ├── 📂 archives (12.50 KB)
│    │    ├── 🗃️ fonts.7z (10.25 KB)
│    │    └── 🗃️ old_backup.zip (20.18 KB)
│    │
│    ├── 🖼️ background.jpg (967.32 KB)
│    ├── 🎵 click.mp3 (224.52 KB)
│    ├── 📽️ intro.pptx (912.51 KB)
│    └── 🖼️ logo.png (256.12 KB)
│
├── 📂 build (642.55 KB)
│    ├── ⚙️ app.exe (512.00 KB)
│    └── 🗃️ archive.zip (130.55 KB)
│
├── 📂 docs (204.22 KB)
│    ├── 📂 logs (20.00 KB)
│    │    └── 📜 install.log (20.00 KB)
│    │
│    ├── 📋 guide.md (123.45 KB)
│    └── 📓 terms.pdf (80.77 KB)
│
├── 📂 src (2.41 MB)
│    ├── 📂 components (125.00 KB)
│    │    ├── 📂 icons (90.75 KB)
│    │    │    ├── 🖼️ icon1.svg (12.00 KB)
│    │    │    └── 🖼️ icon2.svg (8.75 KB)
│    │    │
│    │    ├── 📝 header.js (15.50 KB)
│    │    └── 📝 footer.js (14.75 KB)
│    │
│    ├── 📝 app.ts (61.02 KB)
│    ├── 📝 config.yaml (1.44 MB)
│    ├── 📝 index.js (13.21 KB)
│    └── 📝 utils.js (899.32 KB)
│
├── 📁 empty (0 B)
├── 🤖 app-release-android.apk (58.16 KB)
├── 📱 app-release-ios.ipa (58.34 KB)
├── 🛠️ environment (0.12 KB)
└── 📋 README.MD (4.12 KB)
```
