/*
  Word list, one block per day.
  To add a new day: copy the last block, paste it at the end of DAYS and change the words.

  Each word is an array:  [persian, german, plural, note]

  german  Nouns start with their article: "der Apfel", "die Banane", "das Ei".
          Words without an article (verbs, adverbs, sentences) are fine too: "immer".
  plural  "die Äpfel"
          Can be the same as the singular: "die Brötchen".
          No common plural: write what Germans say instead and add a note,
            e.g. "die Obstsorten", "kein üblicher Plural".
          "nur Plural"  the noun only exists in plural (die Eltern)
          ""            not a noun, or leave it out
  note    optional hint shown under the word

  A table (e.g. a verb with all its forms) can be one slide instead of many:
    { fa: "بودن", de: "sein", table: [["من هستم", "ich bin"], ["شما هستید (جمع)", "ihr seid", "note"], ...] }
  The Persian column shows first, then the German forms appear one row at a time.
*/
const DAYS = [
  {
    topic: "Wie oft? · Fragen",
    words: [
      ["اصلا", "nie", "", "auch: gar nicht"],
      ["گاهی اوقات - گاها", "manchmal"],
      ["اغلب", "oft"],
      ["همیشه", "immer"],
      ["تقریبا همیشه", "fast immer"],
      ["تقریبا", "fast"],
      ["چه کسی - کی؟", "wer?"],
      ["چه کسی هستی تو؟", "Wer bist du?"],
      ["چگونه - چطور", "wie?"],
      ["چگونه نامیده می شوی تو؟", "Wie heißt du?"],
      ["کجا", "wo?"],
      ["کجا زندگی می کنی شما؟", "Wo wohnen Sie?", "", "du: Wo wohnst du?"],
      ["از کجا", "woher?"],
      ["از کجا می آیید شما؟", "Woher kommen Sie?"],
      ["تقریبا همیشه می خوریم ما تخم مرغ برای صبحانه", "Fast immer essen wir Eier zum Frühstück."],
      ["ما می خوریم تقریبا همیشه تخم مرغ برای صبحانه", "Wir essen fast immer Eier zum Frühstück."],
    ],
  },
  {
    topic: "Obst & Gemüse",
    words: [
      ["میوه", "das Obst", "die Obstsorten", "kein üblicher Plural"],
      ["سبزیجات", "das Gemüse", "die Gemüse"],
      ["موز", "die Banane", "die Bananen"],
      ["پرتقال", "die Orange", "die Orangen", "auch: die Apfelsine"],
      ["سیب", "der Apfel", "die Äpfel"],
      ["لیموترش", "die Zitrone", "die Zitronen"],
      ["سیب زمینی", "die Kartoffel", "die Kartoffeln"],
      ["هویج", "die Karotte", "die Karotten", "auch: die Möhre, die Möhren"],
      ["سالاد", "der Salat", "die Salate"],
    ],
  },
  {
    topic: "Getränke",
    words: [
      ["نوشیدنی", "das Getränk", "die Getränke"],
      ["آب", "das Wasser", "die Wasser", "auch: die Wässer"],
      ["آب میوه", "der Saft", "die Säfte"],
      ["آب پرتقال", "der Orangensaft", "die Orangensäfte"],
      ["آب سیب", "der Apfelsaft", "die Apfelsäfte"],
    ],
  },
  {
    topic: "Getränke",
    words: [
      ["شراب", "der Wein", "die Weine"],
      ["کولا", "die Cola", "die Colas"],
      ["شیر", "die Milch", "die Milchsorten", "kein üblicher Plural"],
      ["شیرکافه", "der Milchkaffee", "die Milchkaffees"],
    ],
  },
  {
    topic: "Lebensmittel",
    words: [
      ["مواد غذایی", "das Lebensmittel", "die Lebensmittel"],
      ["مربا", "die Marmelade", "die Marmeladen"],
      ["پنیر", "der Käse", "die Käse"],
      ["ماست", "der Joghurt", "die Joghurts"],
      ["محصولات لبنی", "das Milchprodukt", "die Milchprodukte"],
      ["روغن", "das Öl", "die Öle"],
      ["برنج", "der Reis", "die Reissorten", "kein üblicher Plural"],
      ["گوشت", "das Fleisch", "die Fleischsorten", "kein üblicher Plural"],
      ["ماهی", "der Fisch", "die Fische"],
      ["کره", "die Butter", "die Buttersorten", "kein üblicher Plural"],
      ["مرغ", "das Hähnchen", "die Hähnchen", "das Tier: das Huhn, die Hühner"],
      ["نان", "das Brot", "die Brote"],
      ["لازانیا", "die Lasagne", "die Lasagnen"],
      ["کروسان", "das Croissant", "die Croissants"],
      ["نون همبرگری", "das Brötchen", "die Brötchen"],
    ],
  },
  {
    topic: "Frühstück",
    words: [
      ["نون تست", "der Toast", "die Toasts"],
      ["عسل", "der Honig", "die Honige", "selten"],
      ["تخم مرغ", "das Ei", "die Eier"],
      ["سوسیس", "die Wurst", "die Würste"],
      ["ژامبون", "der Schinken", "die Schinken"],
    ],
  },
  {
    topic: "Gemischt",
    words: [
      ["گوجه", "die Tomate", "die Tomaten"],
      ["شلوار جین", "die Jeans", "die Jeans"],
      ["ماشین", "das Auto", "die Autos"],
      ["بلوز زنانه", "die Bluse", "die Blusen"],
      ["صبحانه غلات", "das Müsli", "die Müslis"],
      ["چایی", "der Tee", "die Tees"],
      ["آب جو", "das Bier", "die Biere"],
      ["کت", "die Jacke", "die Jacken"],
      ["اتوبوس", "der Bus", "die Busse"],
    ],
  },
  {
    topic: "Angaben zur Person · Länder & Sprachen",
    words: [
      ["نام", "der Name", "die Namen"],
      ["نام کوچک", "der Vorname", "die Vornamen"],
      ["نام خانوادگی", "der Nachname", "die Nachnamen", "auch: der Familienname"],
      ["شماره موبایل", "die Handynummer", "die Handynummern"],
      ["شماره تلفن", "die Telefonnummer", "die Telefonnummern"],
      ["آدرس ایمیل", "die E-Mail-Adresse", "die E-Mail-Adressen"],
      ["درس آلمانی", "der Deutschkurs", "die Deutschkurse"],
      ["موزیک", "die Musik", "die Musiken", "selten"],
      ["ورزش", "der Sport", "die Sportarten", "kein üblicher Plural"],
      ["قهوه", "der Kaffee", "die Kaffees"],
      ["حرف الفبا", "der Buchstabe", "die Buchstaben"],
      ["هجی کردن", "buchstabieren"],
      ["رشته پزشکی", "die Medizin", "die Medizinen", "Plural nur im Sinn von Arznei"],
      ["تحصیل کردن", "studieren"],
      ["آنجا", "dort", "", "auch: da"],
      ["یونان", "Griechenland"],
      ["یونانی", "Griechisch", "", "die Sprache"],
      ["انگلیس", "England"],
      ["انگلیسی", "Englisch", "", "die Sprache"],
      ["ایتالیا", "Italien"],
      ["ایتالیایی", "Italienisch", "", "die Sprache"],
      ["لهستان", "Polen"],
      ["لهستانی", "Polnisch", "", "die Sprache"],
      ["اسپانیا", "Spanien"],
      ["اسپانیایی", "Spanisch", "", "die Sprache"],
      ["فرانسه", "Frankreich"],
      ["فرانسوی", "Französisch", "", "die Sprache"],
    ],
  },
  {
    topic: "Familie",
    words: [
      ["خانواده", "die Familie", "die Familien"],
      ["پدر", "der Vater", "die Väter"],
      ["مادر", "die Mutter", "die Mütter"],
      ["والدین", "die Eltern", "nur Plural"],
      ["برادر", "der Bruder", "die Brüder"],
      ["خواهر", "die Schwester", "die Schwestern"],
      ["خواهر و برادرها", "die Geschwister", "nur Plural"],
    ],
  },
  {
    topic: "Familie · Personen · Wie alt?",
    words: [
      ["پدربزرگ", "der Großvater", "die Großväter", "ugs.: der Opa"],
      ["مادربزرگ", "die Großmutter", "die Großmütter", "ugs.: die Oma"],
      ["پدربزرگ و مادربزرگ", "die Großeltern", "nur Plural"],
      ["مرد - همسر", "der Mann", "die Männer", "Ehemann: mein Mann"],
      ["زن - همسر", "die Frau", "die Frauen", "Ehefrau: meine Frau"],
      ["پسربچه", "der Junge", "die Jungen", "ugs.: die Jungs"],
      ["دختربچه", "das Mädchen", "die Mädchen", "immer das (wegen -chen)"],
      {
        fa: "بودن",
        de: "sein",
        table: [
          ["من هستم", "ich bin"],
          ["تو هستی", "du bist"],
          ["او (مذکر) است", "er ist"],
          ["او (مونث) است", "sie ist"],
          ["آن (خنثی) است", "es ist"],
          ["ما هستیم", "wir sind"],
          ["شما هستید (جمع)", "ihr seid", "Plural von du"],
          ["آنها هستند", "sie sind"],
          ["شما هستید (رسمی)", "Sie sind", "höflich, immer groß"],
        ],
      },
      ["او (مونث) چند ساله است؟", "Wie alt ist sie?", "", "du: Wie alt bist du?"],
      ["او (مونث) 20 ساله است.", "Sie ist zwanzig Jahre alt.", "", "20 = zwanzig"],
    ],
  },
];
