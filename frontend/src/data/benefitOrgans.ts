export const BENEFIT_ORGANS = [
  'INSS',
  'SIAPE',
  'GOVERNO',
  'PREFEITURA',
  'FGTS / CLT',
  'FORÇAS ARMADAS',
  'VEÍCULOS',
  'BOLSA FAMÍLIA'
] as const;

export type BenefitOrgan = typeof BENEFIT_ORGANS[number];
