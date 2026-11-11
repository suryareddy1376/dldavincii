import type { ExperimentItem } from "@/data/experiments";

export function buildSinglePythonFile(exp: ExperimentItem): string {
  const header = [
    `# ${exp.codeLabel}: ${exp.title}`,
    `# Aim: ${exp.aim}`,
    `# Runtime: ${exp.runtime} | Dataset: ${exp.datasetName}`,
    "",
  ].join("\n");
  return `${header}${exp.code}\n`;
}

export function buildAllPythonBundle(
  setupCommand: string,
  experiments: ExperimentItem[]
): string {
  const lines = [
    "# Deep Learning Lab: all experiments in Keras",
    `# Setup (Colab): ${setupCommand}`,
    "",
  ];

  for (const exp of experiments) {
    lines.push("# " + "=".repeat(72));
    lines.push(`# ${exp.codeLabel}: ${exp.title}`);
    lines.push(`# Aim: ${exp.aim}`);
    lines.push("# " + "=".repeat(72));
    lines.push("");
    lines.push(exp.code);
    lines.push("");
    lines.push("");
  }

  return lines.join("\n");
}

export function triggerTextDownload(
  filename: string,
  content: string,
  mimeType = "text/plain;charset=utf-8"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
