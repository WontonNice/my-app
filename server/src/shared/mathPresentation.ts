/** Presentation only. Stored expressions, choices and grading values stay unchanged. */
export function legibleMathExpression(expression: string) {
  const primes=expression.replace(/([A-Za-z0-9])\\prime\b/g, '$1^{\\prime}');
  return /\\frac\b/.test(primes) && !/\\(?:displaystyle|textstyle)\b/.test(primes) ? `\\displaystyle{${primes}}` : primes;
}
