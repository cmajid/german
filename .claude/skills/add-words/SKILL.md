---
name: add-words
description: >-
  Add German vocabulary to this app's words.js cheaply. Use this whenever the user
  sends a slide or screenshot of German words (usually with Persian translations),
  even an image with no text at all, pastes a word list, or says something like
  "روز ۱۱ امه", "اینا رو اضافه کن", "add these words" or "day 12". Also use it to
  fix or move an existing word.
---

# Add words

Lessons arrive as screenshots of slides, often several per day. Only `words.js` changes. The app renders every entry generically, so there is no need to read `app.js`, `index.html`, `style.css`, the README or the whole of `words.js`; reading them is what used to make this task expensive.

## Steps

1. See where things stand:
   ```bash
   git status --short words.js; node .claude/skills/add-words/scripts/check.js
   ```
   This prints the last day, its line range and the exact `Read` range for the end of the file.
2. Pick the day. A day the user names wins. Otherwise, if `words.js` has uncommitted changes, extend the last day, because the user is still sending that day's slides. Otherwise start a new day.
3. Read only the range the script printed (`Edit` needs a prior `Read`), then edit. For the last day or a new day, anchor on the end of the file, which occurs only once:
   ```
       ],
     },
   ];
   ```
   For an earlier day, run `check.js <day>` and read that day's line range.
4. Run `check.js` again (with the day number if it isn't the last day). Fix any problems. If it lists a word under "Also in other days", keep the plural and article consistent with that entry unless that entry is wrong.
5. Reply in the user's language (usually Persian), briefly: the day, the number of words added, and only what differs from the slide. Don't list all the words again, since the user already has the slide.

Don't commit until the user says so: more slides may be coming, and a push to `main` publishes the live site. When asked, use the commit message `Day N`.

## Verifying

`check.js` runs the file and validates each entry, which is enough for a data-only edit. Skip screenshots and full-page reads. If a harness reminder asks for a browser check, or the user does, one call is enough: `preview_start` with name `german-words` (navigate to reload if it was already open), then `javascript_tool` with:

```js
[...document.getElementById('wordList').lastElementChild.querySelectorAll('tr')].map(r => r.innerText)
```

Also run `read_console_messages` with `onlyErrors` if the rows look wrong. If `app.js`, `index.html` or `style.css` changed, this skill's shortcut doesn't apply; verify normally.

## Entry format

```js
{ fa: "سیب", en: "apple", de: "der Apfel", plural: "die Äpfel", note: "..." }
```

A new day goes at the end of `DAYS`. Topics are in German, with parts joined by ` · `:

```js
  {
    topic: "Welt & Kultur · Sport & Hobbys",
    words: [
      { fa: "جهان", en: "world", de: "die Welt", plural: "die Welten" },
    ],
  },
```

- **fa**: copy it from the slide, using Persian ی and ک. Separate alternatives with ` - ` rather than `/`.
- **en**: slides don't have this, so add it yourself. Disambiguate where it helps: `(formal)`, `(language)`, `(informal)`.
- **de**: nouns start with their article. Verbs, adverbs, countries and sentences have no article and no `plural`.
- **plural**: always written out with `die`, never as slide shorthand:

  | Slide | `plural` |
  |---|---|
  | `die Welt, -en` | `die Welten` |
  | `das Leben, -` | `die Leben` |
  | `das Hobby, -s` | `die Hobbys` |
  | `der Ball, -(ä)e` | `die Bälle` |

  No plural: `plural: "kein Plural"`. If Germans use another word for several kinds, put it in the note, e.g. `de: "das Obst", plural: "kein Plural", note: "Sorten: die Obstsorten"`. Plural-only nouns: `de: "die Eltern", plural: "nur Plural"`.
- **note**: optional, short and in German, only when useful. Existing patterns: `auch: ...`, `ugs.: ...`, `selten`, `≠ das Studium (an der Uni)`.

When a slide shows a whole conjugation, make it one table entry. The app shows it as one slide:

```js
{
  fa: "بودن", en: "to be", de: "sein",
  table: [
    { fa: "من هستم", en: "I am", de: "ich bin" },
    { fa: "شما هستید (جمع)", en: "you are (plural)", de: "ihr seid", note: "Plural von du" },
  ],
},
```

## Slides have mistakes

Check the German on each row rather than copying it blindly, because the user is learning from this list. Slides have shown a wrong article (`das Kultur` for `die Kultur`) and a rare plural as if it were normal (`der Sport, -e`). When you are sure, write the correct form and tell the user what you changed. When you aren't sure, or a row is cut off in the screenshot, ask rather than guess.
