(() => {
  "use strict";

  const STORE_KEY = "deutsch-woerter";
  const DEFAULTS = {
    deDelay: 1,
    plDelay: 1,
    nextDelay: 2,
    autoNext: true,
    shuffle: true,
    speak: false,
    voice: "", // voiceURI of the chosen German voice; empty = best available
    hiddenDays: [], // days the user unticked, so newly added days start ticked
  };

  const $ = (id) => document.getElementById(id);

  // ---------- data ----------
  const days = DAYS.map((day, i) => ({
    num: i + 1,
    topic: day.topic || "",
    words: day.words.map(([fa, de, plural = "", note = ""]) => ({ fa, de, plural, note, day: i + 1 })),
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

  function esc(s) {
    return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }

  // "der Apfel" -> coloured article + noun
  function german(text, isPlural) {
    const m = text.match(ARTICLE);
    if (!m) return esc(text);
    const cls = isPlural ? "art-pl" : "art-" + m[1].toLowerCase();
    return `<span class="art ${cls}">${esc(m[1])}</span> ${esc(text.slice(m[0].length))}`;
  }

  const wordHTML = (w) => german(w.de, w.plural === PLURAL_ONLY);

  function pluralHTML(w) {
    if (!w.plural) return "";
    if (w.plural === PLURAL_ONLY) return `<span class="muted">${esc(w.plural)}</span>`;
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
  ["deDelay", "plDelay", "nextDelay"].forEach((key) => {
    const input = $(key);
    input.value = settings[key];
    input.addEventListener("change", () => {
      const v = parseFloat(input.value);
      settings[key] = Number.isFinite(v) && v >= 0 ? v : DEFAULTS[key];
      input.value = settings[key];
      save();
    });
  });

  ["autoNext", "shuffle", "speak"].forEach((key) => {
    const input = $(key);
    input.checked = settings[key];
    input.addEventListener("change", () => {
      settings[key] = input.checked;
      save();
    });
  });

  // ---------- word list ----------
  function renderList() {
    $("wordList").innerHTML = days
      .map(
        (d) => `
        <details class="day" open>
          <summary>Day ${d.num}${d.topic ? " · " + esc(d.topic) : ""} <small>${d.words.length} words</small></summary>
          <table class="words"><tbody>
            ${d.words
              .map(
                (w) => `<tr>
                  <td class="fa">${esc(w.fa)}</td>
                  <td>${wordHTML(w)}</td>
                  <td>${pluralHTML(w)}</td>
                  <td class="note">${esc(w.note)}</td>
                </tr>`
              )
              .join("")}
          </tbody></table>
        </details>`
      )
      .join("");
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
  let step = 0; // 0 = Persian, 1 = + German, 2 = + plural
  let playing = true;
  let timer = null;

  const lastStep = (w) => (w.plural ? 2 : 1);

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
    $("show").hidden = false;
    document.body.style.overflow = "hidden";
    showCard();
  }

  function close() {
    clearTimeout(timer);
    stopSpeech();
    $("show").hidden = true;
    document.body.style.overflow = "";
    if (document.fullscreenElement) document.exitFullscreen();
  }

  function render() {
    const w = deck[index];
    $("showDay").textContent = `Day ${w.day}`;
    $("showCount").textContent = `${index + 1} / ${deck.length}`;
    $("progressBar").style.width = `${((index + 1) / deck.length) * 100}%`;
    $("cardFa").textContent = w.fa;
    $("cardDe").innerHTML = wordHTML(w);
    $("cardPl").innerHTML = w.plural ? `<span class="label">Plural</span>${pluralHTML(w)}` : "";
    $("cardNote").textContent = w.note;
    $("cardDe").classList.toggle("shown", step >= 1);
    $("cardPl").classList.toggle("shown", step >= 2);
    $("cardNote").classList.toggle("shown", step >= lastStep(w));
    $("playBtn").textContent = playing ? "⏸" : "▶";
  }

  function showCard() {
    stopSpeech();
    step = 0;
    render();
    schedule();
  }

  // Wait for the next reveal, or for the next word once everything is shown.
  function schedule() {
    clearTimeout(timer);
    if (!playing) return;
    if (step < lastStep(deck[index])) {
      const delay = step === 0 ? settings.deDelay : settings.plDelay;
      timer = setTimeout(reveal, delay * 1000);
    } else if (settings.autoNext) {
      timer = setTimeout(next, settings.nextDelay * 1000);
    }
  }

  function reveal() {
    const w = deck[index];
    step++;
    render();
    if (step === 1) speak(w.de);
    if (step === 2 && w.plural !== PLURAL_ONLY) speak(w.plural);
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
    if ($("show").hidden) return;
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
  updateStart();
})();
