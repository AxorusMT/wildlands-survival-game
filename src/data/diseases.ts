import type { Disease } from '../core/types.ts';

// Fictional game illnesses and their in-game treatments; not medical advice.
export const DISEASES: Record<string, Disease> = {
  dysentery: {
    name: 'Dysentery',
    cause: 'Untreated water or rotten food',
    treat: 'Herbal rehydration tea',
    item: 'herbal_tea',
  },
  fever: {
    name: 'Fever',
    cause: 'Raw meat or rotten food',
    treat: 'Willow fever remedy',
    item: 'fever_remedy',
  },
  wound: {
    name: 'Infected wound',
    cause: 'Animal bite and poor hygiene',
    treat: 'Antiseptic poultice or cultured antibiotic',
    item: 'poultice',
  },
  poisoning: {
    name: 'Venom poisoning',
    cause: 'Scorpion sting',
    treat: 'Antivenom or cultured antibiotic',
    item: 'antivenom',
  },
};
