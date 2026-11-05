/**
 * Background Dictionary and Auto-Correct Service
 * Identifies common misspellings and automatically corrects or suggests fixes.
 */

const COMMON_TYPOS: Record<string, string> = {
  teh: 'the',
  taht: 'that',
  waht: 'what',
  nad: 'and',
  adn: 'and',
  recieve: 'receive',
  recieved: 'received',
  recieving: 'receiving',
  seperate: 'separate',
  seperated: 'separated',
  seperation: 'separation',
  definately: 'definitely',
  definitly: 'definitely',
  occured: 'occurred',
  occuring: 'occurring',
  untill: 'until',
  accomodate: 'accommodate',
  accomodation: 'accommodation',
  alot: 'a lot',
  wich: 'which',
  goverment: 'government',
  governer: 'governor',
  thier: 'their',
  thre: 'there',
  truely: 'truly',
  wierd: 'weird',
  beleive: 'believe',
  beleived: 'believed',
  beleif: 'belief',
  calender: 'calendar',
  collegue: 'colleague',
  colleages: 'colleagues',
  commited: 'committed',
  commiting: 'committing',
  concious: 'conscious',
  embarass: 'embarrass',
  embarassed: 'embarrassed',
  enviroment: 'environment',
  existance: 'existence',
  farenheit: 'fahrenheit',
  foriegn: 'foreign',
  freind: 'friend',
  freinds: 'friends',
  garantee: 'guarantee',
  guarentee: 'guarantee',
  harrass: 'harass',
  hight: 'height',
  independant: 'independent',
  independance: 'independence',
  interupt: 'interrupt',
  knowlege: 'knowledge',
  liasion: 'liaison',
  libary: 'library',
  millenium: 'millennium',
  mispell: 'misspell',
  mispelled: 'misspelled',
  neccessary: 'necessary',
  necesary: 'necessary',
  noticable: 'noticeable',
  ocasion: 'occasion',
  occasionaly: 'occasionally',
  pariament: 'parliament',
  peice: 'piece',
  playwrite: 'playwright',
  posession: 'possession',
  potatos: 'potatoes',
  tomatos: 'tomatoes',
  preceed: 'precede',
  privelege: 'privilege',
  priviledge: 'privilege',
  pronounciation: 'pronunciation',
  publically: 'publicly',
  questionaire: 'questionnaire',
  realy: 'really',
  refered: 'referred',
  refering: 'referring',
  religous: 'religious',
  rember: 'remember',
  resistence: 'resistance',
  rythm: 'rhythm',
  sence: 'sense',
  sieze: 'seize',
  succesful: 'successful',
  succesfully: 'successfully',
  supercede: 'supersede',
  suprise: 'surprise',
  suprised: 'surprised',
  tatoo: 'tattoo',
  tendancy: 'tendency',
  tommorrow: 'tomorrow',
  tomorow: 'tomorrow',
  tounge: 'tongue',
  unforseen: 'unforeseen',
  usefull: 'useful',
  vehical: 'vehicle',
  vicious: 'vicious',
  writting: 'writing',
  yeild: 'yield',
};

const STORAGE_KEY = 'doceditor_autocorrect_enabled';

export function isAutoCorrectEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored !== null ? stored === 'true' : true;
}

export function setAutoCorrectEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, String(enabled));
}

/**
 * Checks a word and returns the corrected form if a match is found,
 * matching TitleCase or UPPERCASE where appropriate.
 */
export function correctWord(word: string): string | null {
  if (!word) return null;
  const lower = word.toLowerCase();
  const correction = COMMON_TYPOS[lower];
  if (!correction) return null;

  // Preserve case
  if (word === word.toUpperCase() && word.length > 1) {
    return correction.toUpperCase();
  }
  if (word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()) {
    return correction.charAt(0).toUpperCase() + correction.slice(1);
  }
  return correction;
}

export interface TypoDetection {
  word: string;
  replacement: string;
  count: number;
}

/**
 * Scans text and counts all detected typos
 */
export function findDocumentTypos(plainText: string): TypoDetection[] {
  if (!plainText) return [];
  const tokens = plainText.match(/\b[A-Za-z]+(?:'[A-Za-z]+)?\b/g) || [];
  const map = new Map<string, { replacement: string; count: number }>();

  for (const token of tokens) {
    const fixed = correctWord(token);
    if (fixed && fixed.toLowerCase() !== token.toLowerCase()) {
      const existing = map.get(token);
      if (existing) {
        existing.count++;
      } else {
        map.set(token, { replacement: fixed, count: 1 });
      }
    }
  }

  return Array.from(map.entries()).map(([word, { replacement, count }]) => ({
    word,
    replacement,
    count,
  }));
}
