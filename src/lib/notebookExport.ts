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

export function buildAlgorithmText(exp: ExperimentItem): string {
  const header = `${exp.codeLabel}: ${exp.title} Algorithm\nAim: ${exp.aim}\n`;
  const steps = exp.algorithm
    .map((step, idx) => `${idx + 1}. ${step}`)
    .join("\n");
  return `${header}\n${steps}\n`;
}

export function buildVivaText(exp: ExperimentItem): string {
  const header = `${exp.codeLabel}: ${exp.title} Important Viva Questions\n`;
  const qa = exp.vivaQuestions
    .map(
      (item, idx) =>
        `Q${idx + 1}. ${item.question}\nAnswer: ${item.answer}`
    )
    .join("\n\n");
  return `${header}\n${qa}\n`;
}

export function buildLabRecordMarkdown(exp: ExperimentItem): string {
  const lines: string[] = [
    `# ${exp.codeLabel}: ${exp.title}`,
    "",
    `**Aim:** ${exp.aim}`,
    "",
    `- **Category:** ${exp.category}`,
    `- **Dataset:** ${exp.datasetName} (${exp.datasetSetup})`,
    `- **Runtime:** ${exp.runtime}`,
    `- **Optimizer:** ${exp.optimizer}`,
    `- **Loss:** ${exp.loss}`,
    `- **Epochs / Batch Size:** ${exp.epochs} / ${exp.batchSize}`,
    "",
    "## Algorithm",
    "",
    ...exp.algorithm.map((step, idx) => `${idx + 1}. ${step}`),
    "",
    "## Model Topology",
    "",
    ...exp.layers.map((layer, idx) => `${idx + 1}. **${layer.name}** (${layer.detail})`),
    "",
    "## Keras 3 Code",
    "",
    "```python",
    exp.code,
    "```",
    "",
    "## Important Viva Questions & Answers",
    "",
    ...exp.vivaQuestions.flatMap((item, idx) => [
      `### Q${idx + 1}. ${item.question}`,
      "",
      item.answer,
      "",
    ]),
  ];

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
