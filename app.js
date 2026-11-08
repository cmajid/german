(() => {
  "use strict";

  const STORE_KEY = "deutsch-woerter";

  // Languages you learn German from. Each word in words.js has a text per code.
  const LANGUAGES = [
    { code: "fa", name: "فارسی", dir: "rtl" },
    { code: "en", name: "English", dir: "ltr" },
  ];
  // Dropdown choices: each language on its own, plus all of them together.
  const LANG_OPTIONS = [
    ...LANGUAGES.map((l) => ({ value: l.code, label: l.name })),
    { value: LANGUAGES.map((l) => l.code).join(","), label: LANGUAGES.map((l) => l.name).join(" + ") },
  ];

  // Personal pronouns, shown above the play / pause button on slides that use one.
  const PRONOUNS = [
    { de: "ich", fa: "من", en: "I" },
    { de: "du", fa: "تو", en: "you" },
    { de: "er · sie · es", fa: "او · آن", en: "he · she · it" },
    { de: "wir", fa: "ما", en: "we" },
    { de: "ihr", fa: "شما (جمع)", en: "you (pl.)" },
    { de: "sie · Sie", fa: "آنها · شما (رسمی)", en: "they · you (formal)" },
  ];

  const DEFAULTS = {
    lang: "fa", // a LANG_OPTIONS value
    delay: 3, // seconds before each reveal and before the next word
    autoNext: true,
    shuffle: true,
    speak: false,
    showRules: true, // article rules from articles.js next to nouns
    voice: "", // voiceURI of the chosen German voice; empty = best available
    hiddenDays: [], // days the user unticked, so newly added days start ticked
  };

  const $ = (id) => document.getElementById(id);

  // ---------- data ----------
  const days = DAYS.map((day, i) => ({
    num: i + 1,
    topic: day.topic || "",
    words: day.words.map((w) => {
      // Older format: [fa, de, plural, note]
      if (Array.isArray(w)) {
        const [fa, de, plural = "", note = ""] = w;
        return { fa, de, plural, note, day: i + 1 };
      }
      // A table is one slide: { fa, en, de, table: [{ fa, en, de, note }, ...] }
      const rows = w.table && w.table.map((r) => ({ ...r, note: r.note || "" }));
      return { ...w, plural: w.plural || "", note: w.note || "", rows, day: i + 1 };
    }),
  }));

  // ---------- settings ----------
  const settings = load();

  function load() {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch {}
    const s = { ...DEFAULTS, ...saved };
    if (!Array.isArray(s.hiddenDays)) s.hiddenDays = [];
    if (!LANG_OPTIONS.some((o) => o.value === s.lang)) s.lang = DEFAULTS.lang;
    return s;
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(settings));
    } catch {}
  }

  // ---------- formatting ----------
  const ARTICLE = /^(der|die|das)\s+/i;
  const PLURAL_ONLY = "nur Plural";
  const NO_PLURAL = "kein Plural";
  // Whole words only: matches "Wie alt ist sie?", not "die Welt" or "süßes".
  const USES_PRONOUN = /(?<!\p{L})(ich|du|er|sie|es|wir|ihr)(?!\p{L})/iu;

  function esc(s) {
    return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }

  // ---------- article rules (articles.js) ----------
  // Longest ending first, so "Mädchen" is checked against …chen before …en.
  const RULES = [...ARTICLE_RULES].sort((a, b) => b.ending.length - a.ending.length);
  const NOUN = /^(der|die|das)\s+([\p{L}-]+)$/iu;

  // "die Zeitung" -> { rule: …ung → die, fits: true }. null when rules are off or none applies.
  function ruleFor(w) {
    if (!settings.showRules || w.plural === PLURAL_ONLY) return null;
    const m = w.de.match(NOUN);
    if (!m) return null;
    const noun = m[2].toLowerCase();
    // An ending must leave something before it: "das Ei" is not checked against …ei.
    const rule = RULES.find((r) => noun.length > r.ending.length && noun.endsWith(r.ending));
    return rule ? { rule, fits: rule.article === m[1].toLowerCase() } : null;
  }

  // Small label under the word: "…ung → die · 99%", or the same plus "exception".
  function ruleHTML(match) {
    if (!match) return "";
    const { rule, fits } = match;
    return `<span class="rule${fits ? "" : " exception"}">…${esc(rule.ending)} → <span class="art art-${rule.article}">${rule.article}</span> · ${esc(rule.share)}${fits ? "" : ` <b>exception</b>`}</span>`;
  }

  // "der Apfel" -> coloured article + noun. With a rule match, the noun's ending is marked too.
  function german(text, isPlural, match) {
    const m = text.match(ARTICLE);
    if (!m) return esc(text);
    const cls = isPlural ? "art-pl" : "art-" + m[1].toLowerCase();
    const noun = text.slice(m[0].length);
    let nounHTML = esc(noun);
    if (match) {
      const cut = noun.length - match.rule.ending.length;
      const endCls = match.fits ? `fits ${cls}` : `miss miss-${match.rule.article}`;
      nounHTML = `${esc(noun.slice(0, cut))}<span class="ending ${endCls}">${esc(noun.slice(cut))}</span>`;
    }
    return `<span class="art ${cls}">${esc(m[1])}</span> ${nounHTML}`;
  }

  const wordHTML = (w) => german(w.de, w.plural === PLURAL_ONLY, ruleFor(w));

  const promptLangs = () => settings.lang.split(",").map((code) => LANGUAGES.find((l) => l.code === code));

  // One element per chosen language, e.g. <td lang="fa" dir="rtl">سیب</td>.
  // With a single language, a missing translation falls back to another language instead of a blank.
  function translations(item, tag, cls = "") {
    const langs = promptLangs();
    return langs
      .map((lang) => {
        let extra = "";
        if (!item[lang.code] && langs.length === 1) {
          lang = LANGUAGES.find((l) => item[l.code]) || lang;
          extra = " fallback";
        }
        return `<${tag} class="${cls}${extra}" lang="${lang.code}" dir="${lang.dir}">${esc(item[lang.code] || "")}</${tag}>`;
      })
      .join("");
  }

  function pluralHTML(w) {
    if (!w.plural) return "";
    if (w.plural === PLURAL_ONLY || w.plural === NO_PLURAL) return `<span class="muted">${esc(w.plural)}</span>`;
    return german(w.plural, true);
  }

  // ---------- day picker ----------
  function renderDays() {
    $("dayChips").innerHTML = days
      .map(
        (d) => `
        <label class="chip" title="${esc(d.topic)}">
          <input type="checkbox" value="${d.num}" ${settings.hiddenDays.includes(d.num) ? "" : "checked"}>
          Day ${d.num} <small>${d.words.length}</small>
        </label>`
      )
      .join("");
  }

  $("dayChips").addEventListener("change", (e) => {
    const n = Number(e.target.value);
    settings.hiddenDays = settings.hiddenDays.filter((d) => d !== n);
    if (!e.target.checked) settings.hiddenDays.push(n);
    save();
    renderList();
    updateStart();
  });

  document.querySelectorAll("[data-select]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const mode = btn.dataset.select;
      settings.hiddenDays = days
        .map((d) => d.num)
        .filter((n) => mode === "none" || (mode === "last" && n !== days.length));
      save();
      renderDays();
      renderList();
      updateStart();
    })
  );

  const selectedWords = () =>
    days.filter((d) => !settings.hiddenDays.includes(d.num)).flatMap((d) => d.words);

  function updateStart() {
    const n = selectedWords().length;
    $("startBtn").textContent = n ? `▶ Start slideshow · ${n} words` : "Select at least one day";
    $("startBtn").disabled = !n;
  }

  // ---------- settings form ----------
  function setDelay(seconds) {
    const { min, max } = $("delay");
    settings.delay = Math.min(max, Math.max(min, Math.round(seconds * 10) / 10));
    $("delay").value = settings.delay;
    save();
  }

  $("delay").value = settings.delay;
  $("delay").addEventListener("change", (e) => {
    const v = parseFloat(e.target.value);
    setDelay(Number.isFinite(v) ? v : DEFAULTS.delay);
  });

  ["autoNext", "shuffle", "speak", "showRules"].forEach((key) => {
    const input = $(key);
    input.checked = settings[key];
    input.addEventListener("change", () => {
      settings[key] = input.checked;
      save();
      if (key === "showRules") renderList();
    });
  });

  // ---------- word list ----------
  function renderList() {
    const shown = days.filter((d) => !settings.hiddenDays.includes(d.num));
    if (!shown.length) {
      $("wordList").innerHTML = `<p class="list-empty">No day selected.</p>`;
      return;
    }
    $("wordList").innerHTML = shown
      .map(
        (d) => `
        <details class="day" open>
          <summary>Day ${d.num}${d.topic ? " · " + esc(d.topic) : ""} <small>${d.words.length} words</small></summary>
          <table class="words"><tbody>
            ${d.words
              .map(
                (w) => `<tr>
                  ${translations(w, "td", "src")}
                  <td>${wordHTML(w)}${ruleHTML(ruleFor(w))}</td>
                  <td>${pluralHTML(w)}</td>
                  <td class="note">${esc(w.note)}</td>
                </tr>` +
                (w.rows || [])
                  .map(
                    (r) => `<tr class="sub">
                      ${translations(r, "td", "src")}
                      <td>${german(r.de)}</td>
                      <td></td>
                      <td class="note">${esc(r.note)}</td>
                    </tr>`
                  )
                  .join("")
              )
              .join("")}
          </tbody></table>
        </details>`
      )
      .join("");
  }

  // ---------- language picker (page header and slideshow) ----------
  const langSelects = document.querySelectorAll(".lang-select");

  langSelects.forEach((select) => {
    select.innerHTML = LANG_OPTIONS.map((o) => `<option value="${o.value}">${esc(o.label)}</option>`).join("");
    select.value = settings.lang;
    select.addEventListener("change", () => {
      select.blur(); // give the arrow keys back to the slideshow
      setLang(select.value);
    });
  });

  function setLang(value) {
    settings.lang = value;
    save();
    langSelects.forEach((s) => (s.value = value));
    renderList();
    renderPronouns();
    if (!$("show").hidden) {
      $("cardTable").innerHTML = tableHTML(deck[index]);
      render();
    }
  }

  // ---------- speech ----------
  const canSpeak = "speechSynthesis" in window;
  let germanVoices = [];

  // Natural-sounding voices first; macOS novelty voices (Eddy, Grandma, ...) last.
  function voiceScore(v) {
    let score = 0;
    if (/premium|enhanced|natural|neural|online/i.test(v.name)) score += 4;
    if (/google|microsoft/i.test(v.name)) score += 3;
    if (/^de[-_]DE/i.test(v.lang)) score += 2;
    if (/anna|petra|markus|yannick|helena|katja|conrad/i.test(v.name)) score += 1;
    if (/eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley/i.test(v.name)) score -= 5;
    return score;
  }

  // Browsers fill the voice list asynchronously, so this runs again on "voiceschanged".
  function loadVoices() {
    germanVoices = speechSynthesis
      .getVoices()
      .filter((v) => /^de([-_]|$)/i.test(v.lang))
      .sort((a, b) => voiceScore(b) - voiceScore(a));

    const select = $("voice");
    select.innerHTML = germanVoices
      .map((v) => `<option value="${esc(v.voiceURI)}">${esc(v.name)} (${esc(v.lang)})</option>`)
      .join("");
    if (germanVoices.some((v) => v.voiceURI === settings.voice)) select.value = settings.voice;
    select.disabled = $("testVoice").disabled = !germanVoices.length;
    $("voiceHint").hidden = germanVoices.length > 0;
  }

  if (canSpeak) {
    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
  } else {
    $("speak").closest("label").hidden = true;
    $("voiceRow").hidden = true;
  }

  $("voice").addEventListener("change", (e) => {
    settings.voice = e.target.value;
    save();
  });

  $("testVoice").addEventListener("click", () => {
    stopSpeech();
    say("der Apfel, die Äpfel");
  });

  function say(text) {
    const u = new SpeechSynthesisUtterance(text);
    const voice = germanVoices.find((v) => v.voiceURI === settings.voice) || germanVoices[0];
    u.lang = voice ? voice.lang : "de-DE";
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }

  function speak(text) {
    if (settings.speak && canSpeak && text) say(text);
  }

  function stopSpeech() {
    if (canSpeak) speechSynthesis.cancel();
  }

  // ---------- slideshow ----------
  let deck = [];
  let index = 0;
  let step = 0; // 0 = translation, 1 = + German, 2 = + plural (tables: 2.. = + one row each)
  let playing = true;
  let timer = null;
  let pageScroll = 0; // where the word list was when the slideshow opened

  const lastStep = (w) => (w.rows ? w.rows.length + 1 : w.plural ? 2 : 1);

  // Translation column is visible from the start; each German cell is revealed in turn.
  function tableHTML(w) {
    return (w.rows || [])
      .map(
        (r) => `<tr>
          ${translations(r, "td", "src")}
          <td class="reveal" lang="de">${german(r.de)}${r.note ? `<small>${esc(r.note)}</small>` : ""}</td>
        </tr>`
      )
      .join("");
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildDeck() {
    deck = selectedWords();
    if (settings.shuffle) shuffle(deck);
  }

  function start() {
    buildDeck();
    if (!deck.length) return;
    index = 0;
    playing = true;
    pageScroll = window.scrollY;
    $("show").hidden = false;
    document.documentElement.classList.add("show-open");
    showCard();
  }

  function close() {
    clearTimeout(timer);
    stopSpeech();
    $("show").hidden = true;
    document.documentElement.classList.remove("show-open");
    window.scrollTo(0, pageScroll); // the page was hidden, so put the reader back where they were
    if (document.fullscreenElement) document.exitFullscreen();
  }

  function render() {
    const w = deck[index];
    $("showDay").textContent = `Day ${w.day}`;
    $("showCount").textContent = `${index + 1} / ${deck.length}`;
    $("progressBar").style.width = `${((index + 1) / deck.length) * 100}%`;
    $("cardPrompt").innerHTML = translations(w, "div");
    $("cardDe").innerHTML = wordHTML(w);
    $("cardRule").innerHTML = ruleHTML(ruleFor(w));
    $("cardPl").innerHTML = w.plural ? `<span class="label">Plural</span>${pluralHTML(w)}` : "";
    $("cardNote").textContent = w.note;
    $("cardDe").classList.toggle("shown", step >= 1);
    $("cardRule").classList.toggle("shown", step >= 1);
    $("cardPl").classList.toggle("shown", step >= 2);
    $("cardNote").classList.toggle("shown", step >= lastStep(w));
    $("cardTable").querySelectorAll(".reveal").forEach((td, i) => td.classList.toggle("shown", step >= i + 2));
    $("card").classList.toggle("is-table", !!w.rows);
    $("pronouns").hidden = !USES_PRONOUN.test(w.de);
    $("playBtn").classList.toggle("paused", !playing);
    $("playBtn").setAttribute("aria-label", playing ? "Pause" : "Play");
  }

  function showCard() {
    stopSpeech();
    step = 0;
    $("cardTable").innerHTML = tableHTML(deck[index]);
    render();
    schedule();
  }

  function renderPronouns() {
    $("pronouns").innerHTML = PRONOUNS.map(
      (p) => `<div class="pronoun"><span lang="de">${esc(p.de)}</span>${translations(p, "small")}</div>`
    ).join("");
  }

  // Wait for the next reveal, or for the next word once everything is shown.
  function schedule() {
    clearTimeout(timer);
    if (!playing) return;
    const w = deck[index];
    if (step < lastStep(w)) {
      timer = setTimeout(reveal, settings.delay * 1000);
    } else if (settings.autoNext) {
      timer = setTimeout(next, settings.delay * 1000);
    }
  }

  // Keyboard shortcuts have no button to show their effect, so they say it briefly.
  let toastTimer = null;
  function toast(text) {
    $("toast").textContent = text;
    $("toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ($("toast").hidden = true), 1200);
  }

  function changeDelay(by) {
    setDelay(settings.delay + by);
    schedule();
    toast(`${by < 0 ? "Faster" : "Slower"} · ${settings.delay} s`);
  }

  function toggleMute() {
    if (!canSpeak) return toast("Sound isn't available here");
    settings.speak = $("speak").checked = !settings.speak;
    save();
    if (!settings.speak) stopSpeech();
    toast(settings.speak ? "Sound on" : "Muted");
  }

  function reveal() {
    const w = deck[index];
    step++;
    render();
    if (step === 1) speak(w.de);
    else if (w.rows) speak(w.rows[step - 2].de);
    else if (w.plural !== PLURAL_ONLY && w.plural !== NO_PLURAL) speak(w.plural);
    schedule();
  }

  // Space / → / tap: show the next part, or move on when the card is complete.
  function advance() {
    if (step < lastStep(deck[index])) reveal();
    else next();
  }

  function next() {
    index++;
    if (index >= deck.length) {
      buildDeck(); // start a new round, reshuffled
      index = 0;
    }
    showCard();
  }

  function prev() {
    if (index > 0) index--;
    showCard();
  }

  function togglePlay() {
    playing = !playing;
    render();
    schedule();
  }

  // Blur after click so Space doesn't also re-press the focused button.
  function onClick(id, fn) {
    $(id).addEventListener("click", (e) => {
      e.currentTarget.blur();
      fn();
    });
  }

  onClick("startBtn", start);
  onClick("closeBtn", close);
  onClick("prevBtn", prev);
  onClick("nextBtn", advance);
  onClick("playBtn", togglePlay);
  $("card").addEventListener("click", advance);

  if (!document.fullscreenEnabled) $("fsBtn").hidden = true;
  onClick("fsBtn", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else $("show").requestFullscreen();
  });

  document.addEventListener("keydown", (e) => {
    if ($("show").hidden || e.target.tagName === "SELECT") return;
    switch (e.key) {
      case " ":
      case "Enter":
      case "ArrowRight":
        advance();
        break;
      case "ArrowLeft":
        prev();
        break;
      case "p":
      case "P":
        togglePlay();
        break;
      case "m":
      case "M":
        toggleMute();
        break;
      case "ArrowUp":
        changeDelay(-0.5);
        break;
      case "ArrowDown":
        changeDelay(0.5);
        break;
      case "Escape":
        close();
        break;
      default:
        return;
    }
    e.preventDefault();
  });

  renderDays();
  renderList();
  renderPronouns();
  updateStart();
})();
