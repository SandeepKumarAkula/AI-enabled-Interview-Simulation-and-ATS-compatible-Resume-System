/**
 * ATS Scoring Utilities
 * - Normalization
 * - Simple Platt-style calibration (logistic)
 * - Ensemble helpers (median, weighted mean, calibrated blend)
 */

export function clamp(n: number, min = 0, max = 100) {
  if (Number.isNaN(n) || !isFinite(n)) return min
  return Math.max(min, Math.min(max, n))
}

export function normalizeToPercent(value: number, sourceMin = 0, sourceMax = 100) {
  if (!isFinite(value)) return 0
  if (sourceMax === sourceMin) return clamp(value)
  const p = ((value - sourceMin) / (sourceMax - sourceMin)) * 100
  return clamp(p, 0, 100)
}

// Simple Platt-style logistic calibration. alpha and beta can be fit offline.
export function calibrateLogistic(percentScore: number, alpha = 1.0, beta = 0.0) {
  // percentScore expected 0-100
  const x = percentScore / 100
  const z = alpha * x + beta
  const p = 1 / (1 + Math.exp(-Math.max(Math.min(z, 50), -50)))
  return clamp(p * 100, 0, 100)
}

export function median(arr: number[]) {
  const s = [...arr].sort((a, b) => a - b)
  if (s.length === 0) return 0
  const mid = Math.floor(s.length / 2)
  return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

export function weightedMean(values: number[], weights?: number[]) {
  if (!weights || weights.length !== values.length) {
    // equal weighting
    const sum = values.reduce((a, b) => a + b, 0)
    return values.length ? sum / values.length : 0
  }
  let num = 0
  let den = 0
  for (let i = 0; i < values.length; i++) {
    const w = isFinite(weights[i]) ? Math.max(0, weights[i]) : 0
    num += values[i] * w
    den += w
  }
  return den === 0 ? 0 : num / den
}

export function ensembleScore(scores: number[], options?: { weights?: number[]; validationScore?: number; calibration?: { alpha?: number; beta?: number } }) {
  const normalized = scores.map(s => clamp(s))
  const med = median(normalized)
  const mean = weightedMean(normalized, options?.weights)

  // calibrated mean using logistic transform (defaults no-op)
  const alpha = options?.calibration?.alpha ?? 1.0
  const beta = options?.calibration?.beta ?? 0.0
  const calibrated = calibrateLogistic(mean, alpha, beta)

  // Blend with validationScore (if provided) to increase robustness
  let final = calibrated
  if (typeof options?.validationScore === 'number') {
    const v = clamp(options!.validationScore)
    // give validation 30% weight, calibrated 70%
    final = clamp((calibrated * 0.7) + (v * 0.3))
  }

  return {
    median: Math.round(med),
    mean: Math.round(mean),
    calibrated: Math.round(calibrated),
    final: Math.round(final)
  }
}

export default {
  clamp,
  normalizeToPercent,
  calibrateLogistic,
  median,
  weightedMean,
  ensembleScore
}

// Industry-standard category weightings used across ATS scoring (sum ~= 100)
export const INDUSTRY_WEIGHTS_STANDARD: Record<string, number> = {
  technical: 30,
  impact: 25,
  leadership: 12,
  communication: 10,
  industry: 8,
  certifications: 5,
  jobfit: 7,
  soft_skills: 3
}

// Apply leniency percent to a score (e.g., 10% leniency increases score by 10%)
export function applyLeniency(score: number, percent = 10) {
  if (!isFinite(score)) return clamp(score)
  const factor = 1 + (Number(percent) / 100)
  return clamp(Math.round(score * factor), 0, 100)
}

// Return multiplicative leniency multiplier (1 + pct/100). Uses env ATS_LENIENCY_PERCENT.
export function getLeniencyMultiplier(): number {
  const pct = parseFloat(process.env.ATS_LENIENCY_PERCENT || '10')
  if (!isFinite(pct)) return 1.1
  const bounded = Math.max(0, Math.min(100, pct))
  return 1 + bounded / 100
}

export { clamp as clampScore, normalizeToPercent as normalizeScore }

