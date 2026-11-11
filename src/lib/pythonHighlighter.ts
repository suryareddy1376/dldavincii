export type TokenKind =
  | "comment"
  | "string"
  | "keyword"
  | "keras"
  | "number"
  | "magic"
  | "plain";

export interface CodeToken {
  kind: TokenKind;
  text: string;
}

const KEYWORDS = new Set([
  "import",
  "from",
  "as",
  "def",
  "class",
  "return",
  "for",
  "in",
  "if",
  "elif",
  "else",
  "try",
  "except",
  "with",
  "lambda",
  "not",
  "and",
  "or",
  "is",
  "True",
  "False",
  "None",
  "raise",
  "while",
  "break",
  "continue",
  "pass",
]);

const KERAS_SYMBOLS = new Set([
  "keras",
  "layers",
  "tf",
  "np",
  "pd",
  "plt",
  "Sequential",
  "Model",
  "Input",
  "Dense",
  "Conv2D",
  "MaxPooling2D",
  "MaxPool2D",
  "AveragePooling2D",
  "Dropout",
  "Flatten",
  "BatchNormalization",
  "SimpleRNN",
  "LSTM",
  "GRU",
  "RandomFlip",
  "RandomRotation",
  "RandomZoom",
  "RandomTranslation",
  "Resizing",
  "Rescaling",
  "Adam",
  "SGD",
  "RMSprop",
  "Adadelta",
  "Nadam",
  "Adamax",
  "EarlyStopping",
  "ModelCheckpoint",
  "TensorBoard",
  "ExponentialDecay",
  "RandomNormal",
  "BinaryAccuracy",
  "VGG16",
  "StandardScaler",
  "MinMaxScaler",
]);

export function tokenizePythonLine(line: string): CodeToken[] {
  if (line.trimStart().startsWith("%")) {
    return [{ kind: "magic", text: line }];
  }

  const tokens: CodeToken[] = [];
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    // Line comment
    if (ch === "#") {
      tokens.push({ kind: "comment", text: line.slice(i) });
      break;
    }

    // Prefixed or standard string literal
    if (
      ((ch === "f" || ch === "r" || ch === "b") &&
        (line[i + 1] === '"' || line[i + 1] === "'")) ||
      ch === '"' ||
      ch === "'"
    ) {
      const start = i;
      if (ch !== '"' && ch !== "'") {
        i += 1;
      }
      const quote = line[i];
      i += 1;
      while (i < line.length) {
        if (line[i] === "\\" && i + 1 < line.length) {
          i += 2;
          continue;
        }
        if (line[i] === quote) {
          i += 1;
          break;
        }
        i += 1;
      }
      tokens.push({ kind: "string", text: line.slice(start, i) });
      continue;
    }

    // Numeric literal (including scientific notation)
    if (
      /[0-9]/.test(ch) &&
      (i === 0 || !/[A-Za-z0-9_]/.test(line[i - 1]))
    ) {
      const rest = line.slice(i);
      const match = rest.match(/^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);
      if (match) {
        tokens.push({ kind: "number", text: match[0] });
        i += match[0].length;
        continue;
      }
    }

    // Identifier
    if (/[A-Za-z_]/.test(ch)) {
      const rest = line.slice(i);
      const match = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/);
      if (match) {
        const word = match[0];
        let kind: TokenKind = "plain";
        if (KEYWORDS.has(word)) {
          kind = "keyword";
        } else if (KERAS_SYMBOLS.has(word)) {
          kind = "keras";
        }
        tokens.push({ kind, text: word });
        i += word.length;
        continue;
      }
    }

    // Fallback plain characters
    let end = i + 1;
    while (
      end < line.length &&
      line[end] !== "#" &&
      line[end] !== '"' &&
      line[end] !== "'" &&
      !/[A-Za-z0-9_]/.test(line[end])
    ) {
      end += 1;
    }
    tokens.push({ kind: "plain", text: line.slice(i, end) });
    i = end;
  }

  return tokens;
}

export function extractCodeSections(
  code: string
): Array<{ label: string; line: number }> {
  const sections: Array<{ label: string; line: number }> = [];
  const lines = code.split("\n");
  lines.forEach((raw, idx) => {
    const trimmed = raw.trim();
    const match = trimmed.match(/^#\s*(\d+\..+)$/);
    if (match) {
      sections.push({ label: match[1].replace(/-/g, " "), line: idx + 1 });
    }
  });
  return sections;
}
