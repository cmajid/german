#!/usr/bin/env node
// Checks words.js and prints one day, so the whole file never has to be read.
// Usage: node .claude/skills/add-words/scripts/check.js [day]   (default: last day)
// Exits 1 if it finds problems.
"use strict";

const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "../../../../words.js"), "utf8");
const DAYS = new Function(`${src}\nreturn DAYS;`)();

const dayNum = Number(process.argv[2]) || DAYS.length;
const day = DAYS[dayNum - 1];
if (!day) {
  console.error(`No day ${dayNum}; there are ${DAYS.length}.`);
  process.exit(1);
}

const ARTICLE = /^(der|die|das)\s+/;
const KNOWN_FIELDS = new Set(["fa", "en", "de", "plural", "note", "table"]);
const problems = [];

function checkEntry(w) {
  const name = w.de || w.fa || JSON.stringify(w);
  const report = (text) => problems.push(`${name}: ${text}`);

  for (const field of ["fa", "en", "de"]) if (!w[field]) report(`missing ${field}`);
  for (const key of Object.keys(w)) if (!KNOWN_FIELDS.has(key)) report(`unknown field "${key}"`);
  if (/[يك]/.test(w.fa || "")) report("fa has an Arabic ي or ك; use Persian ی or ک");

  const isNoun = ARTICLE.test(w.de || "");
  if (isNoun && !w.plural && !w.table) report('noun without plural (use "kein Plural" or "nur Plural")');
  if (!isNoun && w.plural) report("plural on a word without an article");
  if (w.plural && !["kein Plural", "nur Plural"].includes(w.plural) && !w.plural.startsWith("die ")) {
    report(`plural "${w.plural}" should start with "die "`);
  }
  (w.table || []).forEach(checkEntry);
}

day.words.forEach(checkEntry);

// Line numbers, so only the relevant part of the file gets read.
const lines = src.trimEnd().split("\n");
const starts = lines.flatMap((line, i) => (line === "  {" ? [i + 1] : []));
if (starts.length !== DAYS.length) problems.push('every day block must open with a "  {" line');
const firstLine = starts[dayNum - 1];
const lastLine = dayNum < DAYS.length ? starts[dayNum] - 1 : lines.length - 1;

// The same word elsewhere, ignoring the article, so a different article shows up too.
const bare = (de) => de.replace(ARTICLE, "").toLowerCase();
const seen = new Set();
const repeats = [];
for (const w of day.words) {
  if (seen.has(bare(w.de || ""))) problems.push(`${w.de}: listed twice in this day`);
  seen.add(bare(w.de || ""));
  DAYS.forEach((other, i) => {
    if (i === dayNum - 1) return;
    for (const o of other.words) {
      if (bare(o.de) === bare(w.de || "")) {
        repeats.push(`  Day ${i + 1}: ${[o.fa, o.de, o.plural, o.note].filter(Boolean).join(" | ")}`);
      }
    }
  });
}

const row = (w) => [w.fa, w.en, w.de, w.plural, w.note].filter(Boolean).join(" | ");
const total = DAYS.reduce((sum, d) => sum + d.words.length, 0);

console.log(`${DAYS.length} days, ${total} words`);
console.log(`End of file: Read words.js offset=${lines.length - 2} limit=3`);
console.log(`Day ${dayNum} "${day.topic}", ${day.words.length} words, lines ${firstLine}-${lastLine}:`);
for (const w of day.words) {
  console.log(`  ${row(w)}`);
  for (const r of w.table || []) console.log(`    ${row(r)}`);
}
if (repeats.length) console.log(`Also in other days:\n${repeats.join("\n")}`);

// Only a hint, because words like "morgen" look like an infinitive too.
const INFINITIVE = /^(sich )?[a-zäöüß]+(en|eln|ern)$/;
const verbs = day.words.filter((w) => INFINITIVE.test(w.de || "") && !w.table).map((w) => w.de);
if (verbs.length) console.log(`Verbs without a table? ${verbs.join(", ")}`);

if (problems.length) {
  console.log(`Problems:\n${problems.map((p) => `  ${p}`).join("\n")}`);
  process.exit(1);
}
console.log("Problems: none");
