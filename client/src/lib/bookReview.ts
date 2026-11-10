/** Replace only the reviewed group's selection; preserve every other question. */
export function keepBookQuestion(selected: string[], group: string[], keep: string) {
  if (!group.includes(keep)) return selected;
  return [...new Set([...selected.filter(id => !group.includes(id)), keep])];
}

export function latestPassageAttempt(attempts: {completedAt: string}[]) {
  return attempts.reduce<string | undefined>((latest, attempt) => {
    const date = Date.parse(attempt.completedAt);
    return Number.isFinite(date) && (!latest || date > Date.parse(latest)) ? attempt.completedAt : latest;
  }, undefined);
}
