/*
  Article rules: which noun endings usually go with der, die or das.
  The page checks every noun in words.js ("die Zeitung") against these endings.
  If the ending fits, the ending is highlighted and the rule is shown next to the word.
  If the noun has a different article, the rule is still shown, marked as an exception.

  Each rule:  { ending: "ung", article: "die", share: "99%" }

  ending   the last letters of the noun, lower case
  article  der, die or das
  share    how often the rule holds, shown as it is: "90%", "almost always"

  The longest matching ending wins, so "das Mädchen" uses …chen (das), not …en (der).
  Plural-only nouns (die Eltern) are not checked, since their "die" is the plural.
  The full notes, with examples and the rules that depend on meaning, are in articles.md.
*/
const ARTICLE_RULES = [
  // From the lesson slides
  { ending: "er", article: "der", share: "90%" },
  { ending: "en", article: "der", share: "90%" },
  { ending: "ig", article: "der", share: "99%" },
  { ending: "ling", article: "der", share: "99%" },
  { ending: "or", article: "der", share: "95%" },
  { ending: "ismus", article: "der", share: "100%" },
  { ending: "ent", article: "der", share: "97%" },
  { ending: "ant", article: "der", share: "95%" },

  { ending: "e", article: "die", share: "90%" },
  { ending: "heit", article: "die", share: "100%" },
  { ending: "keit", article: "die", share: "100%" },
  { ending: "ung", article: "die", share: "99%" },
  { ending: "schaft", article: "die", share: "100%" },
  { ending: "ion", article: "die", share: "99%" },
  { ending: "ät", article: "die", share: "99%" },
  { ending: "ur", article: "die", share: "95%" },
  { ending: "ei", article: "die", share: "98%" },
  { ending: "in", article: "die", share: "100%" },
  { ending: "ik", article: "die", share: "98%" },

  { ending: "chen", article: "das", share: "100%" },
  { ending: "lein", article: "das", share: "100%" },
  { ending: "ment", article: "das", share: "95%" },
  { ending: "um", article: "das", share: "95%" },
  { ending: "el", article: "das", share: "85%" },
  { ending: "ma", article: "das", share: "85%" },
  { ending: "o", article: "das", share: "85%" },

  // Extra endings (not from the slides)
  { ending: "ist", article: "der", share: "almost always" },
  { ending: "eur", article: "der", share: "almost always" },
  { ending: "ich", article: "der", share: "mostly" },
  { ending: "ie", article: "die", share: "almost always" },
  { ending: "anz", article: "die", share: "almost always" },
  { ending: "enz", article: "die", share: "almost always" },
  { ending: "tum", article: "das", share: "mostly" },
  { ending: "nis", article: "das", share: "mostly" },
];
