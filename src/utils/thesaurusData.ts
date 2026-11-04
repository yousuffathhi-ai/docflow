/**
 * Offline built-in Thesaurus dictionary for DocEditor
 */

export interface ThesaurusEntry {
  synonyms: string[];
  antonyms?: string[];
  definition: string;
  partOfSpeech: string;
}

export const THESAURUS_DICTIONARY: Record<string, ThesaurusEntry> = {
  create: {
    definition: 'Bring something into existence.',
    partOfSpeech: 'verb',
    synonyms: ['generate', 'produce', 'design', 'establish', 'construct', 'author', 'devise', 'originate'],
    antonyms: ['destroy', 'dismantle', 'terminate'],
  },
  develop: {
    definition: 'Grow or cause to grow and become more mature, advanced, or elaborate.',
    partOfSpeech: 'verb',
    synonyms: ['expand', 'advance', 'evolve', 'cultivate', 'enhance', 'build', 'formulate'],
    antonyms: ['regress', 'deteriorate'],
  },
  important: {
    definition: 'Of great significance or value; likely to have a profound effect on success or survival.',
    partOfSpeech: 'adjective',
    synonyms: ['crucial', 'vital', 'essential', 'paramount', 'significant', 'critical', 'pivotal'],
    antonyms: ['trivial', 'minor', 'insignificant'],
  },
  system: {
    definition: 'A set of things working together as parts of a mechanism or an interconnecting network.',
    partOfSpeech: 'noun',
    synonyms: ['framework', 'network', 'structure', 'architecture', 'scheme', 'methodology', 'organization'],
  },
  effective: {
    definition: 'Successful in producing a desired or intended result.',
    partOfSpeech: 'adjective',
    synonyms: ['productive', 'potent', 'efficacious', 'fruitful', 'successful', 'competent'],
    antonyms: ['ineffective', 'useless'],
  },
  implement: {
    definition: 'Put a decision, plan, or agreement into effect.',
    partOfSpeech: 'verb',
    synonyms: ['execute', 'deploy', 'enact', 'apply', 'operationalize', 'fulfill'],
    antonyms: ['postpone', 'cancel'],
  },
  improve: {
    definition: 'Make or become better.',
    partOfSpeech: 'verb',
    synonyms: ['upgrade', 'enhance', 'refine', 'boost', 'ameliorate', 'optimize'],
    antonyms: ['degrade', 'worsen'],
  },
  strategy: {
    definition: 'A plan of action or policy designed to achieve a major or overall aim.',
    partOfSpeech: 'noun',
    synonyms: ['plan', 'roadmap', 'blueprint', 'approach', 'tactic', 'masterplan'],
  },
  manage: {
    definition: 'Be in charge of (a business, organization, or undertaking); administer.',
    partOfSpeech: 'verb',
    synonyms: ['oversee', 'supervise', 'direct', 'coordinate', 'govern', 'orchestrate'],
  },
  report: {
    definition: 'An account given of a particular matter, especially in the form of an official document.',
    partOfSpeech: 'noun',
    synonyms: ['account', 'summary', 'record', 'dossier', 'document', 'review', 'briefing'],
  },
  analysis: {
    definition: 'Detailed examination of the elements or structure of something.',
    partOfSpeech: 'noun',
    synonyms: ['investigation', 'evaluation', 'scrutiny', 'examination', 'audit', 'breakdown'],
  },
  deliver: {
    definition: 'Bring and hand over to the proper recipient or accomplish a promise.',
    partOfSpeech: 'verb',
    synonyms: ['provide', 'produce', 'furnish', 'supply', 'fulfill', 'dispatch'],
  },
  objective: {
    definition: 'A thing aimed at or sought; a goal.',
    partOfSpeech: 'noun',
    synonyms: ['goal', 'target', 'aim', 'milestone', 'ambition', 'purpose'],
  },
  collaborate: {
    definition: 'Work jointly on an activity, especially to produce or create something.',
    partOfSpeech: 'verb',
    synonyms: ['cooperate', 'partner', 'team up', 'join forces', 'conspire'],
    antonyms: ['disagree', 'compete'],
  },
};

export function lookupThesaurus(word: string): ThesaurusEntry | null {
  const clean = word.toLowerCase().trim();
  if (THESAURUS_DICTIONARY[clean]) {
    return THESAURUS_DICTIONARY[clean];
  }
  // Try stemming basic suffix: -ed, -ing, -s
  const stemmed = clean.replace(/(ing|ed|s|ly)$/, '');
  if (THESAURUS_DICTIONARY[stemmed]) {
    return THESAURUS_DICTIONARY[stemmed];
  }
  return null;
}
