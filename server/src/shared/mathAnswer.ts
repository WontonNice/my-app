// Math responses keep the existing string contract. Ordinary numbers and simple
// fractions retain their legacy representation; structured expressions use the
// same LaTeX delimiters already understood by the exam and review renderers.
export function mathAnswerToLatex(value: string) {
  let source = value.trim();
  if ((source.startsWith("\\(") && source.endsWith("\\)")) || (source.startsWith("\\[") && source.endsWith("\\]"))) source = source.slice(2, -2);
  const mixed = source.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return `${mixed[1]}\\frac{${mixed[2]}}{${mixed[3]}}`;
  const fraction = source.match(/^([+-]?(?:\d*\.)?\d+|[a-z])\s*\/\s*([+-]?(?:\d*\.)?\d+|[a-z])$/i);
  if (fraction) return `\\frac{${fraction[1]}}{${fraction[2]}}`;
  return source.replace(/%/g, "\\%").replace(/\\\\%/g, "\\%");
}

export function mathAnswerFromLatex(value: string) {
  const source = value.trim();
  if (!source || !source.replace(/\\placeholder(?:\[[^\]]*\])?\{[^{}]*\}|\\(?:d?frac)|[{}\s]/g, "")) return "";
  const fraction = source.match(/^(-?)\\(?:d?frac)\{([+-]?(?:\d*\.)?\d+)\}\{([+-]?(?:\d*\.)?\d+)\}$/);
  if (fraction) return `${fraction[1]}${fraction[2]}/${fraction[3]}`;
  const mixed = source.match(/^(-?\d+)\s*\\(?:d?frac)\{(\d+)\}\{(\d+)\}$/);
  if (mixed) return `${mixed[1]} ${mixed[2]}/${mixed[3]}`;
  if (/^[+\-\d.]+(?:\\%)?$/.test(source)) return source.replace("\\%", "%");
  return `\\(${source}\\)`;
}

export function isMathAnswerComplete(value: string) {
  const source = mathAnswerToLatex(value);
  return Boolean(source.trim()) && !/\\placeholder\b|\{\s*\}|\[\s*\]/.test(source) && !/^[+\-./=<>\s]+$/.test(source);
}

// Format normalization only: no evaluation, simplification, or newly accepted
// numerical equivalents. Teacher-authored answer alternatives remain in charge.
export function normalizeMathAnswer(value: string) {
  return mathAnswerToLatex(value)
    .replace(/\\(?:left|right)\b/g, "")
    .replace(/\\dfrac\b/g, "\\frac")
    .replace(/\\leq\b/g, "\\le").replace(/\\geq\b/g, "\\ge")
    .replace(/([_^])\{([^{}])\}/g, "$1$2")
    .replace(/\\[,;! ]|\s/g, "")
    .replace(/−/g, "-");
}
