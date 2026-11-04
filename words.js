/*
  Word list, one block per day.
  To add a new day: copy the last block, paste it at the end of DAYS and change the words.

  Each word:  { fa: "سیب", en: "apple", de: "der Apfel", plural: "die Äpfel", note: "..." }

  fa, en  The word in each language you can pick on the page.
          If one is missing, the page shows another language instead.
  de      Nouns start with their article: "der Apfel", "die Banane", "das Ei".
          Words without an article (verbs, adverbs, sentences) are fine too: "immer".
  plural  "die Äpfel"
          Can be the same as the singular: "die Brötchen".
          "kein Plural"  the noun has no plural (das Obst). If Germans use another word
                         for "several kinds", put it in the note: "Sorten: die Obstsorten".
          "nur Plural"   the noun only exists in plural (die Eltern)
          Leave it out when the word is not a noun.
  note    optional hint shown under the word

  Verbs get a table with all their present-tense forms, shown as one slide:
    { fa: "بودن", en: "to be", de: "sein", table: [
        { fa: "من هستم", en: "I am", de: "ich bin" },
        { fa: "شما هستید (جمع)", en: "you are (plural)", de: "ihr seid", note: "Plural von du" },
    ] }
  The translation column shows first, then the German forms appear one row at a time.

  To add another language (e.g. Turkish): add tr: "..." to the words
  and { code: "tr", name: "Türkçe", dir: "ltr" } to LANGUAGES in app.js.
*/
const DAYS = [
  {
    topic: "Wie oft? · Fragen",
    words: [
      { fa: "اصلا", en: "never", de: "nie", note: "auch: gar nicht" },
      { fa: "گاهی اوقات - گاها", en: "sometimes", de: "manchmal" },
      { fa: "اغلب", en: "often", de: "oft" },
      { fa: "همیشه", en: "always", de: "immer" },
      { fa: "تقریبا همیشه", en: "almost always", de: "fast immer" },
      { fa: "تقریبا", en: "almost", de: "fast" },
      { fa: "چه کسی - کی؟", en: "who?", de: "wer?" },
      { fa: "چه کسی هستی تو؟", en: "Who are you?", de: "Wer bist du?" },
      { fa: "چگونه - چطور", en: "how?", de: "wie?" },
      { fa: "چگونه نامیده می شوی تو؟", en: "What is your name?", de: "Wie heißt du?" },
      { fa: "کجا", en: "where?", de: "wo?" },
      { fa: "کجا زندگی می کنی شما؟", en: "Where do you live? (formal)", de: "Wo wohnen Sie?", note: "du: Wo wohnst du?" },
      { fa: "از کجا", en: "where from?", de: "woher?" },
      { fa: "از کجا می آیید شما؟", en: "Where are you from? (formal)", de: "Woher kommen Sie?" },
      { fa: "تقریبا همیشه می خوریم ما تخم مرغ برای صبحانه", en: "Almost always we eat eggs for breakfast.", de: "Fast immer essen wir Eier zum Frühstück." },
      { fa: "ما می خوریم تقریبا همیشه تخم مرغ برای صبحانه", en: "We almost always eat eggs for breakfast.", de: "Wir essen fast immer Eier zum Frühstück." },
    ],
  },
  {
    topic: "Obst & Gemüse",
    words: [
      { fa: "میوه", en: "fruit", de: "das Obst", plural: "kein Plural", note: "Sorten: die Obstsorten" },
      { fa: "سبزیجات", en: "vegetables", de: "das Gemüse", plural: "die Gemüse" },
      { fa: "موز", en: "banana", de: "die Banane", plural: "die Bananen" },
      { fa: "پرتقال", en: "orange", de: "die Orange", plural: "die Orangen", note: "auch: die Apfelsine" },
      { fa: "سیب", en: "apple", de: "der Apfel", plural: "die Äpfel" },
      { fa: "لیموترش", en: "lemon", de: "die Zitrone", plural: "die Zitronen" },
      { fa: "سیب زمینی", en: "potato", de: "die Kartoffel", plural: "die Kartoffeln" },
      { fa: "هویج", en: "carrot", de: "die Karotte", plural: "die Karotten", note: "auch: die Möhre, die Möhren" },
      { fa: "سالاد", en: "salad", de: "der Salat", plural: "die Salate" },
    ],
  },
  {
    topic: "Getränke",
    words: [
      { fa: "نوشیدنی", en: "drink", de: "das Getränk", plural: "die Getränke" },
      { fa: "آب", en: "water", de: "das Wasser", plural: "die Wasser", note: "auch: die Wässer" },
      { fa: "آب میوه", en: "juice", de: "der Saft", plural: "die Säfte" },
      { fa: "آب پرتقال", en: "orange juice", de: "der Orangensaft", plural: "die Orangensäfte" },
      { fa: "آب سیب", en: "apple juice", de: "der Apfelsaft", plural: "die Apfelsäfte" },
    ],
  },
  {
    topic: "Getränke",
    words: [
      { fa: "شراب", en: "wine", de: "der Wein", plural: "die Weine" },
      { fa: "کولا", en: "cola", de: "die Cola", plural: "die Colas" },
      { fa: "شیر", en: "milk", de: "die Milch", plural: "kein Plural", note: "Sorten: die Milchsorten" },
      { fa: "شیرکافه", en: "milky coffee", de: "der Milchkaffee", plural: "die Milchkaffees" },
    ],
  },
  {
    topic: "Lebensmittel",
    words: [
      { fa: "مواد غذایی", en: "food, groceries", de: "das Lebensmittel", plural: "die Lebensmittel" },
      { fa: "مربا", en: "jam", de: "die Marmelade", plural: "die Marmeladen" },
      { fa: "پنیر", en: "cheese", de: "der Käse", plural: "die Käse" },
      { fa: "ماست", en: "yogurt", de: "der Joghurt", plural: "die Joghurts" },
      { fa: "محصولات لبنی", en: "dairy product", de: "das Milchprodukt", plural: "die Milchprodukte" },
      { fa: "روغن", en: "oil", de: "das Öl", plural: "die Öle" },
      { fa: "برنج", en: "rice", de: "der Reis", plural: "kein Plural", note: "Sorten: die Reissorten" },
      { fa: "گوشت", en: "meat", de: "das Fleisch", plural: "kein Plural", note: "Sorten: die Fleischsorten" },
      { fa: "ماهی", en: "fish", de: "der Fisch", plural: "die Fische" },
      { fa: "کره", en: "butter", de: "die Butter", plural: "kein Plural", note: "Sorten: die Buttersorten" },
      { fa: "مرغ", en: "chicken", de: "das Hähnchen", plural: "die Hähnchen", note: "das Tier: das Huhn, die Hühner" },
      { fa: "نان", en: "bread", de: "das Brot", plural: "die Brote" },
      { fa: "لازانیا", en: "lasagna", de: "die Lasagne", plural: "die Lasagnen" },
      { fa: "کروسان", en: "croissant", de: "das Croissant", plural: "die Croissants" },
      { fa: "نون همبرگری", en: "bread roll", de: "das Brötchen", plural: "die Brötchen" },
    ],
  },
  {
    topic: "Frühstück",
    words: [
      { fa: "نون تست", en: "toast", de: "der Toast", plural: "die Toasts" },
      { fa: "عسل", en: "honey", de: "der Honig", plural: "die Honige", note: "selten" },
      { fa: "تخم مرغ", en: "egg", de: "das Ei", plural: "die Eier" },
      { fa: "سوسیس", en: "sausage", de: "die Wurst", plural: "die Würste" },
      { fa: "ژامبون", en: "ham", de: "der Schinken", plural: "die Schinken" },
    ],
  },
  {
    topic: "Gemischt",
    words: [
      { fa: "گوجه", en: "tomato", de: "die Tomate", plural: "die Tomaten" },
      { fa: "شلوار جین", en: "jeans", de: "die Jeans", plural: "die Jeans" },
      { fa: "ماشین", en: "car", de: "das Auto", plural: "die Autos" },
      { fa: "بلوز زنانه", en: "blouse", de: "die Bluse", plural: "die Blusen" },
      { fa: "صبحانه غلات", en: "muesli, cereal", de: "das Müsli", plural: "die Müslis" },
      { fa: "چایی", en: "tea", de: "der Tee", plural: "die Tees" },
      { fa: "آب جو", en: "beer", de: "das Bier", plural: "die Biere" },
      { fa: "کت", en: "jacket", de: "die Jacke", plural: "die Jacken" },
      { fa: "اتوبوس", en: "bus", de: "der Bus", plural: "die Busse" },
    ],
  },
  {
    topic: "Angaben zur Person · Länder & Sprachen",
    words: [
      { fa: "نام", en: "name", de: "der Name", plural: "die Namen" },
      { fa: "نام کوچک", en: "first name", de: "der Vorname", plural: "die Vornamen" },
      { fa: "نام خانوادگی", en: "last name", de: "der Nachname", plural: "die Nachnamen", note: "auch: der Familienname" },
      { fa: "شماره موبایل", en: "mobile number", de: "die Handynummer", plural: "die Handynummern" },
      { fa: "شماره تلفن", en: "phone number", de: "die Telefonnummer", plural: "die Telefonnummern" },
      { fa: "آدرس ایمیل", en: "email address", de: "die E-Mail-Adresse", plural: "die E-Mail-Adressen" },
      { fa: "درس آلمانی", en: "German course", de: "der Deutschkurs", plural: "die Deutschkurse" },
      { fa: "موزیک", en: "music", de: "die Musik", plural: "die Musiken", note: "selten" },
      { fa: "ورزش", en: "sport", de: "der Sport", plural: "kein Plural", note: "Arten: die Sportarten" },
      { fa: "قهوه", en: "coffee", de: "der Kaffee", plural: "die Kaffees" },
      { fa: "حرف الفبا", en: "letter (of the alphabet)", de: "der Buchstabe", plural: "die Buchstaben" },
      {
        fa: "هجی کردن", en: "to spell", de: "buchstabieren",
        table: [
          { fa: "من هجی می کنم", en: "I spell", de: "ich buchstabiere" },
          { fa: "تو هجی می کنی", en: "you spell (informal)", de: "du buchstabierst" },
          { fa: "او - آن هجی می کند", en: "he · she · it spells", de: "er · sie · es buchstabiert" },
          { fa: "ما هجی می کنیم", en: "we spell", de: "wir buchstabieren" },
          { fa: "شما (جمع) هجی می کنید", en: "you spell (plural)", de: "ihr buchstabiert" },
          { fa: "آنها هجی می کنند - شما (رسمی) هجی می کنید", en: "they · you (formal) spell", de: "sie · Sie buchstabieren" },
        ],
      },
      { fa: "رشته پزشکی", en: "medicine (field of study)", de: "die Medizin", plural: "die Medizinen", note: "Plural nur im Sinn von Arznei" },
      {
        fa: "تحصیل کردن", en: "to study (at university)", de: "studieren",
        table: [
          { fa: "من تحصیل می کنم", en: "I study", de: "ich studiere" },
          { fa: "تو تحصیل می کنی", en: "you study (informal)", de: "du studierst" },
          { fa: "او - آن تحصیل می کند", en: "he · she · it studies", de: "er · sie · es studiert" },
          { fa: "ما تحصیل می کنیم", en: "we study", de: "wir studieren" },
          { fa: "شما (جمع) تحصیل می کنید", en: "you study (plural)", de: "ihr studiert" },
          { fa: "آنها تحصیل می کنند - شما (رسمی) تحصیل می کنید", en: "they · you (formal) study", de: "sie · Sie studieren" },
        ],
      },
      { fa: "آنجا", en: "there", de: "dort", note: "auch: da" },
      { fa: "یونان", en: "Greece", de: "Griechenland" },
      { fa: "یونانی", en: "Greek (language)", de: "Griechisch", note: "die Sprache" },
      { fa: "انگلیس", en: "England", de: "England" },
      { fa: "انگلیسی", en: "English (language)", de: "Englisch", note: "die Sprache" },
      { fa: "ایتالیا", en: "Italy", de: "Italien" },
      { fa: "ایتالیایی", en: "Italian (language)", de: "Italienisch", note: "die Sprache" },
      { fa: "لهستان", en: "Poland", de: "Polen" },
      { fa: "لهستانی", en: "Polish (language)", de: "Polnisch", note: "die Sprache" },
      { fa: "اسپانیا", en: "Spain", de: "Spanien" },
      { fa: "اسپانیایی", en: "Spanish (language)", de: "Spanisch", note: "die Sprache" },
      { fa: "فرانسه", en: "France", de: "Frankreich" },
      { fa: "فرانسوی", en: "French (language)", de: "Französisch", note: "die Sprache" },
    ],
  },
  {
    topic: "Familie",
    words: [
      { fa: "خانواده", en: "family", de: "die Familie", plural: "die Familien" },
      { fa: "پدر", en: "father", de: "der Vater", plural: "die Väter" },
      { fa: "مادر", en: "mother", de: "die Mutter", plural: "die Mütter" },
      { fa: "والدین", en: "parents", de: "die Eltern", plural: "nur Plural" },
      { fa: "برادر", en: "brother", de: "der Bruder", plural: "die Brüder" },
      { fa: "خواهر", en: "sister", de: "die Schwester", plural: "die Schwestern" },
      { fa: "خواهر و برادرها", en: "siblings", de: "die Geschwister", plural: "nur Plural" },
    ],
  },
  {
    topic: "Familie · Wie alt? · Tiere & Orte",
    words: [
      { fa: "پدربزرگ", en: "grandfather", de: "der Großvater", plural: "die Großväter", note: "ugs.: der Opa" },
      { fa: "مادربزرگ", en: "grandmother", de: "die Großmutter", plural: "die Großmütter", note: "ugs.: die Oma" },
      { fa: "پدربزرگ و مادربزرگ", en: "grandparents", de: "die Großeltern", plural: "nur Plural" },
      { fa: "مرد - همسر", en: "man / husband", de: "der Mann", plural: "die Männer", note: "Ehemann: mein Mann" },
      { fa: "زن - همسر", en: "woman / wife", de: "die Frau", plural: "die Frauen", note: "Ehefrau: meine Frau" },
      { fa: "پسربچه", en: "boy", de: "der Junge", plural: "die Jungen", note: "ugs.: die Jungs" },
      { fa: "دختربچه", en: "girl", de: "das Mädchen", plural: "die Mädchen", note: "immer das (wegen -chen)" },
      {
        fa: "بودن", en: "to be", de: "sein",
        table: [
          { fa: "من هستم", en: "I am", de: "ich bin" },
          { fa: "تو هستی", en: "you are (informal)", de: "du bist" },
          { fa: "او (مذکر) است", en: "he is", de: "er ist" },
          { fa: "او (مونث) است", en: "she is", de: "sie ist" },
          { fa: "آن (خنثی) است", en: "it is", de: "es ist" },
          { fa: "ما هستیم", en: "we are", de: "wir sind" },
          { fa: "شما هستید (جمع)", en: "you are (plural)", de: "ihr seid", note: "Plural von du" },
          { fa: "آنها هستند", en: "they are", de: "sie sind" },
          { fa: "شما هستید (رسمی)", en: "you are (formal)", de: "Sie sind", note: "höflich, immer groß" },
        ],
      },
      { fa: "او (مونث) چند ساله است؟", en: "How old is she?", de: "Wie alt ist sie?", note: "du: Wie alt bist du?" },
      { fa: "او (مونث) 20 ساله است.", en: "She is twenty years old.", de: "Sie ist zwanzig Jahre alt.", note: "20 = zwanzig" },
      { fa: "گربه", en: "cat", de: "die Katze", plural: "die Katzen" },
      { fa: "سگ", en: "dog", de: "der Hund", plural: "die Hunde" },
      { fa: "انسان", en: "human, person", de: "der Mensch", plural: "die Menschen" },
      { fa: "شهر", en: "city, town", de: "die Stadt", plural: "die Städte" },
      { fa: "کشور", en: "country", de: "das Land", plural: "die Länder", note: "auch: auf dem Land = nicht in der Stadt" },
      { fa: "پژوهش", en: "study (research)", de: "die Studie", plural: "die Studien", note: "≠ das Studium (an der Uni)" },
      { fa: "پونی (اسب کوچک)", en: "pony", de: "das Pony", plural: "die Ponys" },
    ],
  },
  {
    topic: "Welt & Kultur · Sport & Hobbys · Freunde & Technik · Beruf & Arbeit · Wie geht's?",
    words: [
      { fa: "جهان", en: "world", de: "die Welt", plural: "die Welten" },
      { fa: "فرهنگ", en: "culture", de: "die Kultur", plural: "die Kulturen" },
      { fa: "زندگی", en: "life", de: "das Leben", plural: "die Leben" },
      { fa: "ورزش", en: "sport", de: "der Sport", plural: "kein Plural", note: "Arten: die Sportarten" },
      { fa: "سرگرمی - تفریح", en: "hobby", de: "das Hobby", plural: "die Hobbys" },
      { fa: "توپ", en: "ball", de: "der Ball", plural: "die Bälle" },
      { fa: "فوتبال", en: "football, soccer", de: "der Fußball", plural: "die Fußbälle", note: "Plural nur für den Ball, nicht für das Spiel" },
      { fa: "دوست (مذکر)", en: "friend (male)", de: "der Freund", plural: "die Freunde" },
      { fa: "دوست (مونث)", en: "friend (female)", de: "die Freundin", plural: "die Freundinnen" },
      { fa: "موبایل", en: "mobile phone", de: "das Handy", plural: "die Handys" },
      { fa: "موبایل", en: "smartphone", de: "das Smartphone", plural: "die Smartphones" },
      { fa: "لپ‌تاپ", en: "laptop", de: "der Laptop", plural: "die Laptops", note: "auch: das Laptop" },
      { fa: "اپلیکیشن", en: "app", de: "die App", plural: "die Apps" },
      { fa: "آرایشگر (مذکر)", en: "hairdresser (male)", de: "der Friseur", plural: "die Friseure" },
      { fa: "آرایشگر (مونث)", en: "hairdresser (female)", de: "die Friseurin", plural: "die Friseurinnen" },
      { fa: "معمار (مذکر)", en: "architect (male)", de: "der Architekt", plural: "die Architekten" },
      { fa: "معمار (مونث)", en: "architect (female)", de: "die Architektin", plural: "die Architektinnen" },
      { fa: "همکار (مذکر)", en: "colleague (male)", de: "der Kollege", plural: "die Kollegen" },
      { fa: "همکار (مونث)", en: "colleague (female)", de: "die Kollegin", plural: "die Kolleginnen" },
      { fa: "رئیس (مذکر)", en: "boss (male)", de: "der Chef", plural: "die Chefs" },
      { fa: "رئیس (مونث)", en: "boss (female)", de: "die Chefin", plural: "die Chefinnen" },
      { fa: "شغل", en: "job", de: "der Job", plural: "die Jobs" },
      { fa: "کار - شغل", en: "work", de: "die Arbeit", plural: "die Arbeiten" },
      {
        fa: "کار کردن", en: "to work", de: "arbeiten",
        table: [
          { fa: "من کار می کنم", en: "I work", de: "ich arbeite" },
          { fa: "تو کار می کنی", en: "you work (informal)", de: "du arbeitest" },
          { fa: "او - آن کار می کند", en: "he · she · it works", de: "er · sie · es arbeitet" },
          { fa: "ما کار می کنیم", en: "we work", de: "wir arbeiten" },
          { fa: "شما (جمع) کار می کنید", en: "you work (plural)", de: "ihr arbeitet" },
          { fa: "آنها کار می کنند - شما (رسمی) کار می کنید", en: "they · you (formal) work", de: "sie · Sie arbeiten" },
        ],
      },
      { fa: "حالت چطوره؟", en: "How are you? (informal)", de: "Wie geht es dir?" },
      { fa: "حال شما چطور است؟", en: "How are you? (formal)", de: "Wie geht es Ihnen?" },
      { fa: "چطوری؟ - چه خبر؟", en: "How's it going?", de: "Wie geht's?", note: "ugs., kurz für: Wie geht es?" },
      { fa: "حالم ... است (خوب - عالی ...)", en: "I'm ... (good · great ...)", de: "Es geht mir ... (gut · super ...)" },
      { fa: "بد نیست - می گذره", en: "It's okay.", de: "Es geht." },
      { fa: "خب، ای - بد نیست", en: "Well, so-so.", de: "Na ja, so lala." },
      { fa: "تو چطور؟", en: "And you? (informal)", de: "Und dir?" },
      { fa: "شما چطور؟", en: "And you? (formal)", de: "Und Ihnen?" },
      { fa: "باحال", en: "cool", de: "cool", note: "ugs." },
      { fa: "و", en: "and", de: "und" },
      { fa: "یا", en: "or", de: "oder" },
      { fa: "اما", en: "but", de: "aber" },
      { fa: "اما - چرا (در جواب سؤال منفی)", en: "but · yes (to a negative question)", de: "doch", note: "Kommst du nicht? – Doch!" },
      { fa: "تا بعد", en: "See you soon!", de: "Bis bald!" },
      { fa: "خداحافظ", en: "Goodbye!", de: "Auf Wiedersehen!" },
      { fa: "کوچک", en: "small", de: "klein" },
      { fa: "بزرگ", en: "big · tall", de: "groß" },
      { fa: "اون کیه؟", en: "Who is that?", de: "Wer ist das?" },
      { fa: "اونا کین؟", en: "Who are they?", de: "Wer sind sie?", note: "≠ Wer sind Sie? (شما کی هستید؟ رسمی)" },
      { fa: "خب پس اون چیه؟", en: "Well, what is that then?", de: "Na, was ist denn das?" },
    ],
  },
];
