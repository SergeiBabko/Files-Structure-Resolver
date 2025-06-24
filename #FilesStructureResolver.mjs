import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const rootPath = path.dirname(__filename);

class FSRSettings {
  static CREATE_OUTPUT_TXT = true;
  static CREATE_OUTPUT_MD = false;
  static CREATE_OUTPUT_JSON = false;

  static ENABLE_LOGGING = false;

  static IGNORE_DOT_FILES = true;

  static IGNORED_NAMES = [
    '#FilesStructure.md',
    '#FilesStructure.txt',
    '#FilesStructure.json',
    '#FilesStructureResolver.bat',
    '#FilesStructureResolver.mjs',
  ];
}

class ResultType {
  static SCANNED = 'Scanned';
  static SKIPPED = 'Skipped';
}

class NodeType {
  static FILE = 'File';
  static DIR = 'Folder';
  static SYSTEM = 'System';
  static LINK = 'Link';
}

class FolderType {
  static DIR = 'dir';
  static DIR_OPEN = 'dir_open';
}

class IconTypes {
  static dir = '📁';
  static dir_open = '📂';
  static file = '📄';
  static unknown = '📄';
  static image = '🖼️';
  static video = '🎞️';
  static audio = '🎵';
  static document = '📋';
  static pdf = '📓';
  static book = '📙';
  static code = '📝';
  static archive = '🗃️';
  static spreadsheet = '📊';
  static presentation = '📽️';
  static font = '🔤';
  static executable = '⚙️';
  static android = '🤖';
  static ios = '📱';
  static database = '🗄️';
  static disk = '💿';
  static log = '📜';
  static config = '🛠️';
  static script = '🖥️';
  static markdown = '📑';
  static makefile = '🔧';
  static security = '🔒';
  static backup = '💾';
  static docker = '🐳';
  static temp = '🧹';
  static utility = '🧰';
}

class FileTypeMap {
  static image = [
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp', '.psd',
    '.tiff', '.tif', '.heic', '.raw', '.arw', '.cr2', '.nef', '.orf', '.sr2',
  ];
  static video = [
    '.mp4', '.avi', '.mkv', '.mov', '.webm',
  ];
  static audio = [
    '.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a',
  ];
  static document = [
    '.doc', '.docx', '.txt', '.rtf', '.md',
  ];
  static pdf = [
    '.pdf',
  ];
  static book = [
    '.epub', '.mobi', '.azw', '.azw3', '.fb2', '.djvu', '.cbz', '.cbr',
  ];
  static code = [
    '.js', '.ts', '.json', '.html', '.css', '.py', '.java', '.cpp',
    '.c', '.cs', '.sh', '.rb', '.php', '.go', '.rs', '.xml', '.yaml', '.yml',
  ];
  static archive = [
    '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz',
  ];
  static spreadsheet = [
    '.xls', '.xlsx', '.ods', '.csv',
  ];
  static presentation = [
    '.ppt', '.pptx', '.odp',
  ];
  static font = [
    '.ttf', '.otf', '.woff', '.woff2', '.eot',
  ];
  static android = [
    '.apk',
  ];
  static ios = [
    '.ipa',
  ];
  static executable = [
    '.exe', '.bat', '.bin', '.msi', '.app',
  ];
  static database = [
    '.sql', '.db', '.sqlite', '.mdb', '.accdb',
  ];
  static disk = [
    '.iso', '.img', '.dmg',
  ];
  static log = [
    '.log',
  ];
  static config = [
    '.ini', '.cfg', '.conf', '.env', '.toml',
  ];
  static script = [
    '.sh', '.bat', '.ps1',
  ];
  static markdown = [
    '.md', '.markdown',
  ];
  static makefile = [
    '.makefile',
  ];
  static security = [
    '.key', '.pem', '.cert', '.csr', '.crt',
  ];
  static backup = [
    '.bak', '.backup', '.old',
  ];
  static docker = [
    '.dockerfile',
  ];
  static temp = [
    '.tmp', '.temp', '.swp',
  ];
  static utility = [
    '.psm1', '.psd1',
  ];
}

class FilesStructureResolver {
  #scannedNodes = 0;

  resolve() {
    LoggerUtils.printHeader();
    LoggerUtils.cyan(`Scanned Directory: ${rootPath}`);
    LoggerUtils.indent('-');
    this.#performanceWrapper(this.#prepareOutputs.bind(this));
    LoggerUtils.printFooter();
  }

  #prepareOutputs() {
    LoggerUtils.cyan(`Building the Node Tree structure...`);
    const treeOutput = this.#buildNodeTree(rootPath);
    LoggerUtils.indent('-');

    if (FSRSettings.CREATE_OUTPUT_TXT) {
      LoggerUtils.cyan('Preparing Text Output...');
      const txtOutput = this.#convertToPresentation(treeOutput, false);
      this.#saveToTextOutput(txtOutput);
      if (FSRSettings.CREATE_OUTPUT_MD || FSRSettings.CREATE_OUTPUT_JSON) LoggerUtils.indent();
    }

    if (FSRSettings.CREATE_OUTPUT_MD) {
      LoggerUtils.cyan('Preparing Markdown Output...');
      const mdOutput = this.#convertToPresentation(treeOutput, true);
      this.#saveToMarkdownOutput(mdOutput);
      if (FSRSettings.CREATE_OUTPUT_JSON) LoggerUtils.indent();
    }

    if (FSRSettings.CREATE_OUTPUT_JSON) {
      LoggerUtils.cyan('Preparing JSON Output...');
      this.#saveToJsonOutput(treeOutput);
    }
  }

  #buildNodeTree(currentPath, depth = 0) {
    this.#scannedNodes++;
    const stats = this.#getStats(currentPath);
    const name = path.basename(currentPath);
    const isDotted = FSRSettings.IGNORE_DOT_FILES && name.startsWith('.');
    const isIgnored = FSRSettings.IGNORED_NAMES.some(ignoredName => name.toLowerCase() === ignoredName.toLowerCase());

    // Skip ignored or system files
    if (isDotted || isIgnored || !stats || stats.isSymbolicLink()) {
      const nodeType =
        !stats ? NodeType.SYSTEM :
          stats.isSymbolicLink() ? NodeType.LINK :
            stats.isFile() ? NodeType.FILE : NodeType.DIR;
      this.#printFileLog(ResultType.SKIPPED, nodeType, currentPath);
      return null;
    }

    // Prepare files
    if (stats.isFile()) {
      this.#printFileLog(ResultType.SCANNED, NodeType.FILE, currentPath);
      const iconType = this.#getIconType(path.extname(name).toLowerCase());
      return {
        name,
        type: NodeType.FILE,
        iconType,
        icon: this.#getIcon(iconType),
        path: currentPath,
        size: this.#formatSize(stats.size),
        rawSize: stats.size,
        depth,
      };
    }

    // Prepare folders
    let folderSize = 0;
    const children = [];
    fs.readdirSync(currentPath).forEach(child => {
      const childNode = this.#buildNodeTree(path.join(currentPath, child), depth + 1);
      if (childNode) {
        children.push(childNode);
        folderSize += childNode.rawSize ?? 0;
      }
    });

    children.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === NodeType.DIR ? -1 : 1;
    });

    this.#printFileLog(ResultType.SCANNED, NodeType.DIR, currentPath);
    const iconType = children.length ? FolderType.DIR_OPEN : FolderType.DIR;
    return {
      name,
      type: NodeType.DIR,
      iconType,
      icon: this.#getIcon(iconType),
      path: currentPath,
      size: this.#formatSize(folderSize),
      rawSize: folderSize,
      depth,
      children,
    };
  }

  #convertToPresentation(treeRoot, useMdLinks) {
    const lineSeparator = useMdLinks ? '  \n' : '\n';
    const formattedName = this.#formatName(treeRoot.path, treeRoot.path, useMdLinks);
    const size = useMdLinks ? `\`(${treeRoot.size})\`` : `(${treeRoot.size})`;
    let outputStr = `${treeRoot.icon} ${formattedName} ${size}${lineSeparator}`;

    if (!treeRoot.children) return outputStr;

    const lastIndex = treeRoot.children.length - 1;

    treeRoot.children.forEach((child, i) => {
      outputStr += this.#printTree(child, [], i === lastIndex, useMdLinks, lineSeparator) + lineSeparator;
    });

    return outputStr;
  }

  #printTree(node, ancestorsHasSibling = [], isLast, useMdLinks, lineSeparator) {
    let prefix = '';
    let emptyLine = '';
    const lines = [];
    const space = useMdLinks ? ' ' : ' ';
    const size = useMdLinks ? `\`(${node.size})\`` : `(${node.size})`;
    const formattedName = this.#formatName(node.path, node.name, useMdLinks);

    for (let i = 0; i < node.depth - 1; i++) {
      prefix += ancestorsHasSibling[i] ? '│' + space.repeat(4) : space.repeat(5);
      emptyLine = prefix.trimEnd();
    }

    if (node.depth > 0) prefix += isLast ? '└── ' : '├── ';

    lines.push(prefix + `${node.icon} ${formattedName} ${size}`);

    if (isLast && emptyLine && node.iconType !== FolderType.DIR_OPEN) {
      lines.push(emptyLine);
    }

    if (node.children?.length) {
      const lastIndex = node.children.length - 1;

      node.children.forEach((child, idx) => {
        const childAncestors = [...ancestorsHasSibling];
        childAncestors[node.depth - 1] = !isLast;
        lines.push(this.#printTree(child, childAncestors, idx === lastIndex, useMdLinks, lineSeparator));
      });
    }

    return lines.join(lineSeparator);
  }

  #performanceWrapper(callback) {
    const startTime = Date.now();
    callback();
    const endTime = Date.now();
    const performance = this.#formatPerformance(endTime - startTime);
    LoggerUtils.indent('-');
    LoggerUtils.cyan(`Scanned Nodes: ${this.#scannedNodes}`);
    LoggerUtils.cyan(`Processing Time: ${performance}`);
    LoggerUtils.indent('-');
    LoggerUtils.indent();
  }

  #formatPerformance(ms) {
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor(ms % 1000);

    const pad = (n, len = 2) => String(n).padStart(len, '0');
    const padMs = (n) => String(n).padStart(3, '0');

    if (hours) {
      return `${pad(hours)}.${pad(minutes)}.${pad(seconds)}:${padMs(milliseconds)} (h.m.s:ms)`;
    } else if (minutes) {
      return `${pad(minutes)}.${pad(seconds)}:${padMs(milliseconds)} (m.s:ms)`;
    } else if (seconds) {
      return `${seconds}:${padMs(milliseconds)} (s:ms)`;
    } else {
      return `${milliseconds} (ms)`;
    }
  }

  #getStats(currentPath) {
    let stats;
    try {
      stats = fs.lstatSync(currentPath);
    } catch (err) {
      switch (err.code) {
        case 'EPERM':
        case 'ENOENT':
          return;
        default:
          LoggerUtils.red(err);
          return;
      }
    }
    return stats;
  }

  #formatName(nodePath, nodeName, useMdLinks) {
    if (!useMdLinks) return nodeName;

    let absolutePath = nodePath.split(path.sep).join('/');

    if (/^[a-zA-Z]:/.test(absolutePath)) absolutePath = '/' + absolutePath;

    return `<a href="file://${absolutePath}">${nodeName}</a>`;
  }

  #saveToTextOutput(output) {
    const outputFile = path.join(rootPath, '#FilesStructure.txt');
    fs.writeFileSync(outputFile, output, 'utf-8');
    LoggerUtils.green(`Files Structure saved to Text: ${outputFile}`);
  }

  #saveToMarkdownOutput(output) {
    const outputFile = path.join(rootPath, '#FilesStructure.md');
    fs.writeFileSync(outputFile, output, 'utf-8');
    LoggerUtils.green(`Files Structure saved to Markdown: ${outputFile}`);
  }

  #saveToJsonOutput(output) {
    const outputFile = path.join(rootPath, '#FilesStructure.json');
    const json = JSON.stringify(output, null, 2);
    fs.writeFileSync(outputFile, json, 'utf-8');
    LoggerUtils.green(`Files Structure saved to JSON: ${outputFile}`);
  }

  #getIcon(type) {
    return IconTypes[type] || IconTypes.unknown;
  }

  #printFileLog(resultType, nodeType, nodePath) {
    if (!FSRSettings.ENABLE_LOGGING) return;
    const message = `[${resultType} ${nodeType}]: ${nodePath}`;
    const logger = resultType === ResultType.SKIPPED ? LoggerUtils.yellow : LoggerUtils.log;
    logger(message);
  }

  #getIconType(ext) {
    for (const [type, extensions] of Object.entries(FileTypeMap)) {
      if (extensions.includes(ext)) return type;
    }
    return 'unknown';
  }

  #formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  }
}

export class LoggerUtils {
  static printHeader() {
    LoggerUtils.clear();
    LoggerUtils.magenta(
      `╔═════════════════════════════════╗
║     File Structure Resolver     ║
╚═════════════════════════════════╝`
    );
    LoggerUtils.indent();
  }

  static printFooter() {
    LoggerUtils.magenta(
      `╔═════════════════════════════════╗
║       Thank You For Using       ║
║     File Structure Resolver     ║
║                                 ║
║       © 2025 Sergei Babko       ║
║       All Rights Reserved       ║
╚═════════════════════════════════╝`
    );
    LoggerUtils.indent();
  }

  static clear() {
    console.clear();
  }

  static log(...args) {
    console.log(...args);
  }

  static indent(indentSymbol) {
    if (indentSymbol) {
      LoggerUtils.log(indentSymbol.repeat(100));
    } else {
      LoggerUtils.log();
    }
  }

  static cyan(message) {
    LoggerUtils.log('\x1b[96m%s\x1b[0m', message);
  }

  static green(message) {
    LoggerUtils.log('\x1b[92m%s\x1b[0m', message);
  }

  static yellow(message) {
    LoggerUtils.log('\x1b[93m%s\x1b[0m', message);
  }

  static red(message) {
    LoggerUtils.log('\x1b[91m%s\x1b[0m', message);
  }

  static magenta(message) {
    LoggerUtils.log('\x1b[95m%s\x1b[0m', message);
  }
}

new FilesStructureResolver().resolve();
