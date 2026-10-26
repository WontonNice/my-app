import type { ExamNumberLineResponse } from '../../../server/src/shared/examTypes';

export function clampNumberLineValue(config: Pick<ExamNumberLineResponse, 'min' | 'max'>, value: number) {
  const clamped = Math.max(config.min, Math.min(config.max, value));
  return Number(clamped.toFixed(10));
}

export function numberLineTicks(config: Pick<ExamNumberLineResponse, 'min' | 'max' | 'tickStep' | 'labelStep'>) {
  return Array.from({length: Math.floor((config.max - config.min) / config.tickStep + 1e-9) + 1}, (_, i) => {
    const value = Number((config.min + i * config.tickStep).toFixed(10));
    const labelIndex = (value - config.min) / (config.labelStep && config.labelStep > 0 ? config.labelStep : config.tickStep);
    return {value, showLabel: Math.abs(labelIndex - Math.round(labelIndex)) < 1e-8};
  });
}
