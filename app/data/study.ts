// STUDY DATA - Phase 3
// Beginner idea: Every passage gets a study card.
// Context = who wrote, to whom, when, why.
// People/Places/Themes = tap to explore connections (start of knowledge graph).

export type StudyEntry = {
  ref: string; // e.g. "Genesis 1", "John 1"
  context: {
    author: string;
    audience: string;
    setting: string;
    purpose: string;
    summary: string;
  };
  people: { name: string; desc: string }[];
  places: { name: string; desc: string }[];
  themes: { name: string; desc: string }[];
  connections: string[]; // other passages
  questions: string[];
};

export const STUDY_DATA: Record<string, StudyEntry> = {
  'Genesis 1': {
    ref: 'Genesis 1',
    context: {
      author: 'Traditionally Moses',
      audience: 'Israelites in wilderness',
      setting: 'Beginning of creation, no date - timeless start',
      purpose: 'Show God as creator, orderly and good',
      summary: 'God creates light, sky, land, sun, animals, and humans in His image. Everything is very good.',
    },
    people: [{ name: 'God', desc: 'Creator who speaks and it happens. Loving and orderly.' }],
    places: [
      { name: 'Heaven', desc: 'Sky above, home God made first.' },
      { name: 'Earth', desc: 'Dry land God gathered from waters.' },
    ],
    themes: [
      { name: 'Creation', desc: 'God made everything from nothing by His word.' },
      { name: 'Image of God', desc: 'Humans reflect God - worth and purpose (Gen 1:27).' },
      { name: 'Goodness', desc: 'Repeated: God saw it was good.' },
    ],
    connections: ['Genesis 2', 'John 1', 'Psalms 19', 'Hebrews 11:3', 'Revelation 21'],
    questions: ['What does this say about God?', 'What does it say about humans?', 'What word repeats? Why?'],
  },
  'Genesis 2': {
    ref: 'Genesis 2',
    context: {
      author: 'Traditionally Moses',
      audience: 'Israelites',
      setting: 'Garden of Eden, close-up of Day 6',
      purpose: 'Show personal God who forms man and gives relationship',
      summary: 'Closer look: God breathes life into Adam, plants garden, makes Eve as helper.',
    },
    people: [
      { name: 'Adam', desc: 'First man, formed from dust, given breath of life.' },
      { name: 'Eve', desc: 'First woman, made from Adam, partner not servant.' },
    ],
    places: [{ name: 'Eden', desc: 'Garden God planted - perfect home with work + rest.' }],
    themes: [
      { name: 'Relationship', desc: 'It is not good for man to be alone (Gen 2:18).' },
      { name: 'Work', desc: 'God put man to tend garden - work is good before sin.' },
    ],
    connections: ['Genesis 1', 'Genesis 3', 'Matthew 19:4-6'],
    questions: ['How is God personal here?', 'What does marriage show?'],
  },
  'John 1': {
    ref: 'John 1',
    context: {
      author: 'Apostle John',
      audience: 'All people, especially new believers (~AD 85-95)',
      setting: 'Ephesus, reminding of Genesis 1: In beginning was Word',
      purpose: 'Prove Jesus is God who became human',
      summary: 'Jesus is the Word, Light, Life. John Baptist points to Him. Word became flesh.',
    },
    people: [
      { name: 'Jesus (Word)', desc: 'Eternal God who became human (v14).' },
      { name: 'John the Baptist', desc: 'Witness who points to Jesus, not himself.' },
    ],
    places: [{ name: 'Judea / Jordan', desc: 'Where John baptized, preparing way.' }],
    themes: [
      { name: 'Word', desc: 'Greek Logos - Jesus is God speaking to us.' },
      { name: 'Light vs Darkness', desc: 'Jesus shines, darkness cannot win (v5).' },
      { name: 'Grace', desc: 'Full of grace and truth (v14).' },
    ],
    connections: ['Genesis 1', 'Genesis 2', 'Isaiah 9:2', '1 John 1'],
    questions: ['What does Word mean?', 'How is Jesus like Genesis 1 creation?', 'What does v14 change for you?'],
  },
};

// People index for Explore tab (graph start)
export const PEOPLE_INDEX = [
  { name: 'Abraham', desc: 'Father of faith. Covenant, promise.', passages: ['Genesis 12', 'Genesis 15', 'Romans 4', 'Hebrews 11'] },
  { name: 'Moses', desc: 'Leader who freed Israel, gave law.', passages: ['Exodus 20', 'Deuteronomy 34', 'Hebrews 11'] },
  { name: 'David', desc: 'Shepherd to king. Faith, repentance.', passages: ['1 Samuel 16', '2 Samuel 11', 'Psalms 23', 'Acts 13'] },
  { name: 'Jesus', desc: 'Word made flesh. Center of Bible.', passages: ['John 1', 'Matthew 5', 'Romans 8', 'Revelation 21'] },
  { name: 'Paul', desc: 'Apostle to nations. Grace, faith.', passages: ['Acts 9', 'Romans 8', 'Galatians 3'] },
];

export const THEMES_INDEX = [
  { name: 'Faith', desc: 'Trust God even when unseen.', passages: ['Genesis 15:6', 'Hebrews 11', 'Romans 4'] },
  { name: 'Covenant', desc: 'God promise: I will be your God.', passages: ['Genesis 12', 'Exodus 20', 'Jeremiah 31'] },
  { name: 'Love', desc: 'God love, love neighbor.', passages: ['John 3:16', '1 Corinthians 13', '1 John 4'] },
  { name: 'Prayer', desc: 'Talk with God.', passages: ['Psalms 23', 'Matthew 6', 'Philippians 4:6'] },
];
