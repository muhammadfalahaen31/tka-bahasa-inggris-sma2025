// ==========================================
// DATA SOURCE: BANK SOAL & PEMBAHASAN TKA BAHASA INGGRIS SMA 2025 (WAJIB)
// VERBATIM FIDELITY: 100% MATCH TO OFFICIAL SOURCE MODULE (TEXTS 1–4 | QUESTIONS 1–20)
// ==========================================

const TKA_DATA = {
  meta: {
    title: "BANK SOAL & PEMBAHASAN TKA BAHASA INGGRIS SMA 2025 (WAJIB)",
    subtitle: "Identifikasi Jenis Teks, Naskah Soal Asli (1–20), Kunci Jawaban Lengkap, Bukti Tekstual & Analisis Pengecoh",
    developer: "Muhammad Falahaen Jiddan, M.Pd. Gr.",
    school: "SMA Plus PGRI Cibinong & SMA Plus PGRI Cibinong (Reguler)",
    totalQuestions: 20
  },

  strategies: [
    {
      id: "summarizing",
      name: "1. SUMMARIZING NARRATIVE TEXT / POIN UTAMA",
      type: "Summarizing Narrative Text",
      quickQuestion: "Which option best reflects the Orientation, Complication, Resolution, and Moral of the story?",
      formula: "Orientation + Complication + Resolution + Moral Value = Accurate Summary",
      steps: [
        "Identifikasi struktur generik teks: awal mula kejadian (Beginning), konflik utama (Problem), penyelesaian (Solution), dan pesan moral (Lesson).",
        "Eliminasi opsi yang memuat alur cerita fiktif atau fakta yang bertentangan dengan teks bacaan.",
        "Pilih rangkuman yang mencakup keseluruhan alur secara seimbang, bukan hanya penggalan adegan."
      ]
    },
    {
      id: "moral_message",
      name: "2. MORAL MESSAGE / PESAN MORAL",
      type: "Moral Message",
      quickQuestion: "What universal life lesson does the author want to teach through the characters' actions?",
      formula: "Character Action → Consequence → Universal Moral Lesson",
      steps: [
        "Perhatikan kalimat penutup atau koda cerita (biasanya di paragraf terakhir).",
        "Bedakan amanat moral filosofis yang mendalam dari kesimpulan harfiah/pribadi yang sempit.",
        "Pada soal Multi-Select (MCMA), pilih semua pernyataan nilai kebajikan yang didukung langsung oleh narasi."
      ]
    },
    {
      id: "cause_effect",
      name: "3. CAUSE AND EFFECT / INFERENCE",
      type: "Cause and Effect / Inference",
      quickQuestion: "Why did a character make a specific decision or take a certain action?",
      formula: "Character Motive + Text Clue = Cause and Effect Link",
      steps: [
        "Cari paragraf terjadinya dialog atau peristiwa yang ditanyakan.",
        "Perhatikan alasan emosional atau motif logis tokoh (misal: rasa terhibur, empati, atau janji).",
        "Hindari asumsi pribadi yang tidak tertulis atau bertentangan dengan situasi di teks."
      ]
    },
    {
      id: "predicting_ending",
      name: "4. PREDICTING STORY ENDING",
      type: "Predicting Story Ending",
      quickQuestion: "Based on moral conventions, what plausible outcome is anticipated?",
      formula: "Fable Moral Convention + Character Bond = Logical Ending",
      steps: [
        "Dalam fabel klasik anak, kebaikan hati tokoh biasanya dibalas dengan kesetiaan, persahabatan, atau pertolongan timbal balik.",
        "Eliminasi prediksi yang bernada pesimistis atau bertentangan dengan kaidah nilai moral cerita anak."
      ]
    },
    {
      id: "character_portrayal",
      name: "5. CHARACTER PORTRAYAL & TRAIT EVALUATION",
      type: "Character Portrayal",
      quickQuestion: "Which exact sentences illustrate the character's personality and behavior?",
      formula: "Direct Action / Speech Quote → Verified Character Trait",
      steps: [
        "Bedakan kalimat yang menggambarkan setting/tindakan fisik biasa dari kalimat yang benar-benar memancarkan sifat watak tokoh.",
        "Verifikasi apakah ucapan, reaksi kemarahan, rasa humor, atau rasa terima kasih menunjukkan sifat karakter tersebut."
      ]
    },
    {
      id: "explicit_detail",
      name: "6. EXPLICIT DETAIL INFORMATION",
      type: "Explicit Detail Information",
      quickQuestion: "What does the text explicitly state regarding the keyword?",
      formula: "Question Keyword → Exact Point/Paragraph Verification",
      steps: [
        "Temukan kata kunci pertanyaan di dalam infografis atau teks bacaan.",
        "Baca secara cermat poin/kalimat yang bersangkutan.",
        "Pilih jawaban yang secara harfiah dan eksplisit menyatakan informasi tersebut."
      ]
    },
    {
      id: "categorization",
      name: "7. CATEGORIZATION (TIME vs SELF MANAGEMENT)",
      type: "Categorization",
      quickQuestion: "Does the technique relate to time scheduling or personal self-regulation?",
      formula: "Technique Nature → Time Scheduling vs Emotional/Self-Control",
      steps: [
        "Time Management berfokus pada pembagian jam, interval kerja-istirahat, dan rutinitas jadwal belajar.",
        "Self Management berfokus pada sikap mental, pengelolaan emosi, ketekunan, dan motivasi diri."
      ]
    },
    {
      id: "sequence_points",
      name: "8. SEQUENCE OF KEY POINTS",
      type: "Sequence of Key Points",
      quickQuestion: "Which chronological chain best reflects the numbered infographic points?",
      formula: "Step 1 → Step 2 → Step 3 → Step 4 (Coherent Flow)",
      steps: [
        "Cocokkan setiap mata rantai langkah dengan poin-poin infografis.",
        "Eliminasi opsi yang menambahkan aktivitas tidak relevan di luar teks (seperti makan bergizi, mendengarkan musik santai, dll.)."
      ]
    },
    {
      id: "authors_purpose",
      name: "9. AUTHOR'S PURPOSE",
      type: "Author's Purpose",
      quickQuestion: "Why did the author publish this infographic or story?",
      formula: "Target Audience Need + Text Content = Author's Purpose",
      steps: [
        "Identifikasi tujuan komunikatif teks: memberi panduan praktis (to guide), mendorong kebiasaan positif (to encourage), atau mengedukasi manajemen waktu (to show time management).",
        "Hindari pilihan yang mengeklaim hal negatif atau menyimpang dari tujuan edukatif."
      ]
    },
    {
      id: "chronological_summary",
      name: "10. CHRONOLOGICAL SUMMARY",
      type: "Chronological Summary",
      quickQuestion: "Which sequence accurately follows the narrative plot from beginning to end?",
      formula: "Orientation → Inciting Incident → Climax → Falling Action → Resolution",
      steps: [
        "Periksa urutan waktu terjadinya setiap peristiwa dari Paragraf 1 hingga Paragraf terakhir.",
        "Pastikan tidak ada peristiwa awal yang tertukar dengan peristiwa akhir."
      ]
    },
    {
      id: "contextual_meaning",
      name: "11. CONTEXTUAL PHRASE MEANING",
      type: "Contextual Phrase Meaning",
      quickQuestion: "What is the figurative meaning of the phrase in its specific sentence setting?",
      formula: "Figurative Phrase + Surrounding Description = Contextual Meaning",
      steps: [
        "Jangan menerjemahkan secara harfiah kata per kata.",
        "Lihat suasana yang digambarkan sebelum dan sesudah kalimat kiasan tersebut."
      ]
    },
    {
      id: "implied_main_idea",
      name: "12. IMPLIED MAIN IDEA & EVALUATION",
      type: "Implied Main Idea",
      quickQuestion: "What is the overarching implied message of the descriptive text?",
      formula: "Physical Features + Ecological Value = Implied Message (Preservation/Appreciation)",
      steps: [
        "Gabungkan keindahan fisik dan fungsi ekologis yang dijabarkan dalam seluruh teks.",
        "Tarik kesimpulan utama bahwa keindahan alam tersebut merupakan kekayaan bernilai tinggi yang wajib dilestarikan."
      ]
    }
  ],

  texts: [
    // ==========================================
    // TEKS 1: NARRATIVE TEXT (FABLE)
    // ==========================================
    {
      id: 1,
      number: "Jenis Teks 1",
      genre: "Narrative Text (Fable)",
      title: "The Lion and the Mouse",
      questionRange: "Soal Nomor 1 – 5",
      sourceCitation: "Source: https://www.vedantu.com/stories/the-lion-and-the-mouse",
      paragraphs: [
        "Once upon a time, in a thick jungle in Africa, there lived a strong and fierce lion. Every afternoon, the lion would rest under the cool shade of a big tree after walking through the forest.",
        "One day, while he was sleeping, a playful little mouse passed by. The mouse saw the lion's thick mane and was curious. He climbed up and began to jump around on the lion's head, playing in his mane.",
        "The lion woke up suddenly and was not happy at all. He quickly caught the mouse in his big paw and roared, \"Who dares to wake me up?\" He was very angry and almost killed the mouse.",
        "Scared and shaking, the mouse begged the lion, \"Please don't kill me! I didn't mean to bother you. If you let me go, I promise I'll help you one day.\"",
        "The lion laughed loudly. \"You? Help me? That's funny.\" But the lion was feeling kind, so he let the mouse go free.",
        "A few days later, the lion was walking through the jungle again when he fell into a trap. A net set by hunters caught him, and he couldn't escape. He tried to bite and tear the ropes, but they were too strong. The lion roared loudly, hoping someone would come.",
        "The mouse heard the roar and ran to help. He saw the lion trapped and quickly started to chew the ropes with his sharp teeth. After some time, the net broke, and the lion was free.",
        "The lion looked at the mouse with surprise and said, \"Thank you! You really saved my life.\"",
        "The mouse smiled and said, \"I told you I would help you one day.\"",
        "From that moment on, the lion and the mouse became close friends. The lion learned that even small creatures can do great things, and we all need help sometimes."
      ],
      vocabulary: [
        {
          word: "fierce",
          pos: "adjective",
          meaning: "garang / buas / gagah perkasa",
          context: "Once upon a time, in a thick jungle in Africa, there lived a strong and fierce lion.",
          pronunciation: "/fɪəs/",
          example: "The fierce lion protected his pride from intruders."
        },
        {
          word: "mane",
          pos: "noun",
          meaning: "surai leher singa / rambut tebal di sekitar kepala singa",
          context: "The mouse saw the lion's thick mane and was curious.",
          pronunciation: "/meɪn/",
          example: "The male lion had a majestic dark mane."
        },
        {
          word: "curious",
          pos: "adjective",
          meaning: "penasaran / ingin tahu",
          context: "The mouse saw the lion's thick mane and was curious.",
          pronunciation: "/ˈkjʊəriəs/",
          example: "The curious child asked many questions about nature."
        },
        {
          word: "roared",
          pos: "verb (past)",
          meaning: "mengaum keras / bersuara menggelegar",
          context: "He quickly caught the mouse in his big paw and roared, \"Who dares to wake me up?\"",
          pronunciation: "/rɔːd/",
          example: "The tiger roared loudly across the river valley."
        },
        {
          word: "begged",
          pos: "verb (past)",
          meaning: "memohon dengan sangat / mengiba",
          context: "Scared and shaking, the mouse begged the lion, \"Please don't kill me!\"",
          pronunciation: "/bɛɡd/",
          example: "The prisoner begged for mercy before the king."
        },
        {
          word: "bother",
          pos: "verb",
          meaning: "mengganggu / merepotkan",
          context: "\"I didn't mean to bother you. If you let me go, I promise I'll help you one day.\"",
          pronunciation: "/ˈbɒðə(r)/",
          example: "Please do not bother your sister while she is studying."
        },
        {
          word: "trap",
          pos: "noun",
          meaning: "perangkap / jeratan",
          context: "...the lion was walking through the jungle again when he fell into a trap.",
          pronunciation: "/træp/",
          example: "The rabbit narrowly avoided the hidden trap."
        },
        {
          word: "hunters",
          pos: "noun",
          meaning: "para pemburu",
          context: "A net set by hunters caught him, and he couldn't escape.",
          pronunciation: "/ˈhʌntəz/",
          example: "The hunters tracked the wild animals through the forest."
        },
        {
          word: "chew",
          pos: "verb",
          meaning: "mengunyah / mengerat / menggigit putus",
          context: "...and quickly started to chew the ropes with his sharp teeth.",
          pronunciation: "/tʃuː/",
          example: "The puppy likes to chew on wooden sticks."
        },
        {
          word: "creatures",
          pos: "noun",
          meaning: "makhluk hidup / satwa ciptaan",
          context: "The lion learned that even small creatures can do great things...",
          pronunciation: "/ˈkriːtʃəz/",
          example: "The ocean is home to millions of extraordinary creatures."
        }
      ]
    },

    // ==========================================
    // TEKS 2: INFOGRAPHIC / PROCEDURE TEXT
    // ==========================================
    {
      id: 2,
      number: "Jenis Teks 2",
      genre: "Infographic / Procedure Text",
      title: "Effective Study Technique (Infographic)",
      questionRange: "Soal Nomor 6 – 10",
      sourceCitation: "Rangkuman Elemen & Poin Infografis \"Effective Study Techniques\"",
      paragraphs: [
        "1. Know Your Learning Style: Understand whether you learn best by reading, listening, or watching.",
        "2. Set a Consistent Study Schedule: Study at the same time every day. Regularity helps build strong habits.",
        "3. Create a Comfortable Study Space: Find a quiet, well-lit, and distraction-free area. Have all your materials ready.",
        "4. Use the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break. This keeps your mind fresh and focused.",
        "5. Take Effective Notes: Write key points using methods like mind maps or tables to help remember important information.",
        "6. Practice and Repeat: Regularly review your material and do practice-questions to deepen understanding and improve retention.",
        "7. Join a Study Group: Discuss topics with friends to gain new insights and solve problems together.",
        "8. Leverage Technology: Use apps and websites for flashcards, video lessons, and online quizzes to support your study routine.",
        "9. Get Enough Sleep: Aim for 7-8 hours.",
        "10. Be Patient and Persistent: Learning takes time."
      ],
      vocabulary: [
        {
          word: "consistent",
          pos: "adjective",
          meaning: "konsisten / teratur / ajeg",
          context: "Set a Consistent Study Schedule: Study at the same time every day.",
          pronunciation: "/kənˈsɪstənt/",
          example: "Consistent effort is the key to academic achievement."
        },
        {
          word: "distraction-free",
          pos: "adjective",
          meaning: "bebas dari gangguan",
          context: "Create a Comfortable Study Space: Find a quiet, well-lit, and distraction-free area.",
          pronunciation: "/dɪˈstrækʃn friː/",
          example: "Turn off notifications to maintain a distraction-free environment."
        },
        {
          word: "retention",
          pos: "noun",
          meaning: "daya ingat / penyimpanan memori jangka panjang",
          context: "...to deepen understanding and improve retention.",
          pronunciation: "/rɪˈtɛnʃn/",
          example: "Spaced repetition significantly improves memory retention."
        },
        {
          word: "leverage",
          pos: "verb",
          meaning: "memanfaatkan secara optimal / mendayagunakan",
          context: "Leverage Technology: Use apps and websites for flashcards, video lessons...",
          pronunciation: "/ˈliːvərɪdʒ/",
          example: "Students should leverage digital tools for efficient research."
        },
        {
          word: "persistent",
          pos: "adjective",
          meaning: "gigih / tekun / pantang menyerah",
          context: "Be Patient and Persistent: Learning takes time.",
          pronunciation: "/pəˈsɪstənt/",
          example: "A persistent learner never gives up despite difficulties."
        },
        {
          word: "regularity",
          pos: "noun",
          meaning: "keteraturan waktu / rutinitas ajeg",
          context: "Regularity helps build strong habits.",
          pronunciation: "/ˌrɛɡjʊˈlærɪti/",
          example: "The regularity of daily practice builds confidence."
        },
        {
          word: "insights",
          pos: "noun",
          meaning: "wawasan baru / pemahaman mendalam",
          context: "Discuss topics with friends to gain new insights...",
          pronunciation: "/ˈɪnsaɪts/",
          example: "The workshop provided valuable insights into essay writing."
        },
        {
          word: "deepen",
          pos: "verb",
          meaning: "memperdalam / mengokohkan pemahaman",
          context: "...do practice-questions to deepen understanding and improve retention.",
          pronunciation: "/ˈdiːpən/",
          example: "Reading advanced literature helps deepen your vocabulary."
        }
      ]
    },

    // ==========================================
    // TEKS 3: NARRATIVE TEXT (FABLE / CHILDREN STORY)
    // ==========================================
    {
      id: 3,
      number: "Jenis Teks 3",
      genre: "Narrative Text (Fable / Children Story)",
      title: "The False Lion King",
      questionRange: "Soal Nomor 11 – 15",
      sourceCitation: "Adapted from: https://wikibedtimestories.com/bedtime-short-stories-for-kids/The%20False%20Lion%20King",
      paragraphs: [
        "Once upon a time, in Africa, there lived two lion kings. One was named Hera and the other was Shero. Hera was very strong and handsome. All the animals loved and respected him. He was a great leader. Shero was not like Hera. He had a small mane and a funny, squeaky voice. Shero liked to pretend he was as powerful as Hera. He often copied Hera's roar, but it made the other animals laugh.",
        "One day, the animals heard that some hyenas were causing trouble near the river. Hera quickly gathered his followers to stop the hyenas. Shero also wanted to come. He wanted to show everyone that he was strong too.",
        "When they reached the river, Hera roared loudly. His roar was so powerful that the hyenas got scared. Shero also tried to roar, but his voice was high and silly. The hyenas laughed at him. Their leader, Hank the Hyena, made jokes about Shero.",
        "Hera stayed calm and smiled. Shero did not give up. He said, \"I am just as strong as Hera!\" The hyenas laughed even louder. Shero tried to show his power by jumping on a small dirt hill. But he tripped and fell into the ground. The hyenas laughed so much they cried. Even Hera laughed a little.",
        "At the end of the day, the hyenas left, still laughing about Shero. Hera told Shero, \"You are not like me, but you make everyone happy with your jokes.\" Shero smiled and understood that he had his own special gift.",
        "From that day, Shero became the kingdom's jester. He and Hera ruled together — one with strength, and one with laughter. The animals learned that both power and fun are important in life."
      ],
      vocabulary: [
        {
          word: "handsome",
          pos: "adjective",
          meaning: "gagah perkasa / rupawan / menawan",
          context: "Hera was very strong and handsome. All the animals loved and respected him.",
          pronunciation: "/ˈhænsəm/",
          example: "The handsome stallion galloped across the open plains."
        },
        {
          word: "squeaky",
          pos: "adjective",
          meaning: "melengking tinggi / cempreng lucu",
          context: "He had a small mane and a funny, squeaky voice.",
          pronunciation: "/ˈskwiːki/",
          example: "The mouse spoke in a squeaky, humorous voice."
        },
        {
          word: "pretend",
          pos: "verb",
          meaning: "berpura-pura / berlagak",
          context: "Shero liked to pretend he was as powerful as Hera.",
          pronunciation: "/prɪˈtɛnd/",
          example: "The children like to pretend they are brave knights."
        },
        {
          word: "hyenas",
          pos: "noun",
          meaning: "hiena / binatang karnivora liar Afrika",
          context: "...the animals heard that some hyenas were causing trouble near the river.",
          pronunciation: "/haɪˈiːnəz/",
          example: "A pack of hyenas lurked near the edge of the campsite."
        },
        {
          word: "calm",
          pos: "adjective",
          meaning: "tenang / tidak terpancing emosi",
          context: "Hera stayed calm and smiled. Shero did not give up.",
          pronunciation: "/kɑːm/",
          example: "The captain remained calm during the violent storm."
        },
        {
          word: "tripped",
          pos: "verb (past)",
          meaning: "tersandung / terantuk kaki hingga jatuh",
          context: "But he tripped and fell into the ground.",
          pronunciation: "/trɪpt/",
          example: "The runner tripped on an exposed tree root."
        },
        {
          word: "jester",
          pos: "noun",
          meaning: "pelawak istana / penghibur kerajaan",
          context: "From that day, Shero became the kingdom's jester.",
          pronunciation: "/ˈdʒɛstə(r)/",
          example: "The medieval court jester entertained the royals with comedy."
        },
        {
          word: "talents",
          pos: "noun",
          meaning: "bakat khusus / keistimewaan kemampuan",
          context: "Working together is better when people use their different talents.",
          pronunciation: "/ˈtælənts/",
          example: "Every team member contributes unique talents to the project."
        }
      ]
    },

    // ==========================================
    // TEKS 4: DESCRIPTIVE TEXT
    // ==========================================
    {
      id: 4,
      number: "Jenis Teks 4",
      genre: "Descriptive Text",
      title: "The Great Barrier Reef",
      questionRange: "Soal Nomor 16 – 20",
      sourceCitation: "Adapted from: https://www.britannica.com/place/Great-Barrier-Reef",
      paragraphs: [
        "The Great Barrier Reef is one of the most beautiful places in the world. It is located in the Pacific Ocean, near the northeast coast of Australia. The reef is very big. It stretches over 2,000 kilometers and can even be seen from space. There are many small coral islands and clear, warm waters around the reef.",
        "This reef is full of life. There are many kinds of colorful fish, sea turtles, dolphins, and even sharks. Coral of different shapes and colors grows under the water. Sea birds fly over the reef and nest on small islands. People can see this beauty by swimming, diving, or joining a boat tour.",
        "The colors under the water are amazing. Coral comes in red, yellow, green, and blue. Some coral looks like trees, and some looks like big round stones. Small fish swim in and out of the coral like they are playing a game. In some places, soft coral moves with the water like grass in the wind. When the sun shines, the reef looks bright and full of light. It feels like a different world under the sea.",
        "The reef is not only beautiful, but also very important. It helps protect the coast from big waves and storms. It is a home for sea animals and a place where plants can grow. Many people also get food and jobs from the sea near the reef. Without the reef, the ocean would not be the same."
      ],
      vocabulary: [
        {
          word: "stretches",
          pos: "verb",
          meaning: "membentang luas / menjangkau panjang",
          context: "The reef is very big. It stretches over 2,000 kilometers and can even be seen from space.",
          pronunciation: "/ˈstrɛtʃɪz/",
          example: "The golden sandy beach stretches along the coastal highway."
        },
        {
          word: "coast",
          pos: "noun",
          meaning: "pesisir pantai / garis tepi laut",
          context: "...near the northeast coast of Australia.",
          pronunciation: "/kəʊst/",
          example: "Lighthouses were built along the rocky coast."
        },
        {
          word: "coral",
          pos: "noun",
          meaning: "terumbu karang / koral laut",
          context: "There are many small coral islands and clear, warm waters around the reef.",
          pronunciation: "/ˈkɒrəl/",
          example: "The marine biologist studied the growth of fragile coral reefs."
        },
        {
          word: "dolphins",
          pos: "noun",
          meaning: "lumba-lumba",
          context: "There are many kinds of colorful fish, sea turtles, dolphins, and even sharks.",
          pronunciation: "/ˈdɒlfɪnz/",
          example: "A pod of dolphins leaped gracefully through the waves."
        },
        {
          word: "protect",
          pos: "verb",
          meaning: "melindungi / membentengi dari bahaya",
          context: "It helps protect the coast from big waves and storms.",
          pronunciation: "/prəˈtɛkt/",
          example: "Mangrove forests help protect the shore from sea erosion."
        },
        {
          word: "storms",
          pos: "noun",
          meaning: "badai / angin ribut laut yang dahsyat",
          context: "...protect the coast from big waves and storms.",
          pronunciation: "/stɔːmz/",
          example: "Fishermen stayed safely ashore during the seasonal storms."
        },
        {
          word: "treasure",
          pos: "noun",
          meaning: "harta karun berharga / warisan alam tak ternilai",
          context: "The reef is a natural treasure that must be cared for.",
          pronunciation: "/ˈtrɛʒə(r)/",
          example: "Tropical rainforests are an irreplaceable natural treasure."
        },
        {
          word: "persuasive",
          pos: "adjective",
          meaning: "persuasif / meyakinkan / memikat daya tarik",
          context: "Pengalaman langsung menyelam merupakan daya tarik wisata paling persuasif.",
          pronunciation: "/pəˈsweɪsɪv/",
          example: "She gave a persuasive presentation on marine conservation."
        }
      ]
    }
  ],

  questions: [
    // ==========================================
    // TEKS 1 (SOAL 1 - 5)
    // ==========================================
    {
      id: 1,
      textId: 1,
      number: 1,
      indicator: "Indikator 1: Menyusun poin-poin utama dari narrative text (Pilihan Ganda)",
      code: "Kode: 25BIGUTAPTXI03SU-250027-0083",
      type: "Summarizing Narrative Text",
      format: "multiple_choice",
      question: "Which option best summarizes the story?",
      options: [
        { key: "1", text: "Beginning: A lion was walking through the jungle.\nProblem: The mouse got lost and couldn't find food.\nSolution: The lion gave food to the mouse.\nLesson: Always be generous to those in need." },
        { key: "2", text: "Beginning: A mouse accidentally disturbed a sleeping lion.\nProblem: The lion was caught in a hunter's net.\nSolution: The mouse chewed through the net and set the lion free.\nLesson: Even the smallest creature can be a great help." },
        { key: "3", text: "Beginning: The lion and mouse were best friends.\nProblem: The lion got hurt in a fight.\nSolution: The mouse helped him find water.\nLesson: Friendship is built on adventure." },
        { key: "4", text: "Beginning: A mouse was building a home near a tree.\nProblem: A storm destroyed the tree and trapped the lion.\nSolution: The mouse called for help from the jungle.\nLesson: Teamwork solves big problems." },
        { key: "5", text: "Beginning: A lion was hungry and searching for food.\nProblem: He couldn't catch any prey.\nSolution: The mouse helped him find food.\nLesson: Hunger teaches humility." }
      ],
      officialAnswer: "2",
      officialAnswerText: "Opsi 2 (Beginning: A mouse accidentally disturbed a sleeping lion...)",
      officialExplanation: "Ringkasan pada Opsi 2 secara sempurna memuat struktur generik teks naratif (Orientasi, Komplikasi, Resolusi, dan Nilai Moral).",
      textualEvidence: "• Orientasi: \"One day, while he was sleeping, a playful little mouse passed by... jumped around on the lion's head.\"\n• Komplikasi: \"...fell into a trap. A net set by hunters caught him...\"\n• Resolusi: \"...quickly started to chew the ropes with his sharp teeth. After some time, the net broke, and the lion was free.\"\n• Koda/Moral: \"...learned that even small creatures can do great things, and we all need help sometimes.\"",
      evidenceParagraphIndex: 1,
      evidenceSnippet: "One day, while he was sleeping, a playful little mouse passed by. The mouse saw the lion's thick mane and was curious.",
      distractorAnalysis: [
        { option: "Opsi 1, 3, 4, 5", analysis: "Opsi 1, 3, 4, dan 5 menyajikan alur fiktif yang bertentangan dengan isi teks (misal: tikus mencari makan, singa terluka, pohon tumbang karena badai, dsb.)." }
      ]
    },
    {
      id: 2,
      textId: 1,
      number: 2,
      indicator: "Indikator 2: Menyimpulkan pesan moral narrative text (Pilihan Ganda Kompleks - MCMA)",
      code: "Kode: 25BIGUTAPINI07SU-250027-0056",
      type: "Moral Message",
      format: "multi_select",
      question: "Which of the following statements best conveys the message of the story?\nThere is more than one answer. Click on every correct answer!",
      options: [
        { key: "1", text: "We should never wake up a sleeping animal", isCorrect: false },
        { key: "2", text: "Even the small and weak can help the strong", isCorrect: true },
        { key: "3", text: "It's always good to ask for help when we need it", isCorrect: true },
        { key: "4", text: "Lions are dangerous animals and should be avoided", isCorrect: false },
        { key: "5", text: "Never trust anyone who plays with your hair", isCorrect: false }
      ],
      officialAnswer: ["2", "3"],
      officialAnswerText: "[✓] Opsi 2 & [✓] Opsi 3",
      officialExplanation: "Pernyataan Benar:\n• [✓] Even the small and weak can help the strong: Sesuai dengan kalimat penutup: \"The lion learned that even small creatures can do great things...\".\n• [✓] It's always good to ask for help when we need it: Sesuai dengan pesan bahwa semua makhluk membutuhkan pertolongan (\"...and we all need help sometimes\").",
      textualEvidence: "Paragraf 10: \"The lion learned that even small creatures can do great things, and we all need help sometimes.\"",
      evidenceParagraphIndex: 9,
      evidenceSnippet: "The lion learned that even small creatures can do great things, and we all need help sometimes.",
      distractorAnalysis: [
        { option: "Opsi 1, 4, 5", analysis: "\"We should never wake up a sleeping animal\" / \"Lions are dangerous animals...\" / \"Never trust anyone who plays with your hair\" adalah kesimpulan harfiah/pribadi yang bukan merupakan amanat moral filosofis cerita." }
      ]
    },
    {
      id: 3,
      textId: 1,
      number: 3,
      indicator: "Indikator 3: Menafsirkan hubungan sebab-akibat / tindakan dalam narrative text (Pilihan Ganda)",
      code: "Kode: 25BIGUTAPINI10SU-250027-0098",
      type: "Cause and Effect / Inference",
      format: "multiple_choice",
      question: "Why did the lion trust the mouse and decide to let him go instead of eating him?",
      options: [
        { key: "1", text: "The lion was too tired to eat the mouse" },
        { key: "2", text: "The mouse told the lion he might help him one day" },
        { key: "3", text: "The lion was felling happy to see the mouse" },
        { key: "4", text: "The lion heard someone coming and got scared" },
        { key: "5", text: "The mouse promised to bring food for the lion" }
      ],
      officialAnswer: "2",
      officialAnswerText: "Opsi 2 (The mouse told the lion he might help him one day)",
      officialExplanation: "Singa merasa terhibur/lucu dengan janji tikus kecil yang berniat menolongnya suatu saat nanti sehingga melunakkan hatinya untuk melepaskannya.",
      textualEvidence: "Paragraf 4 & 5: \"If you let me go, I promise I'll help you one day.\" The lion laughed loudly. \"You? Help me? That's funny.\" But the lion was feeling kind, so he let the mouse go free.",
      evidenceParagraphIndex: 3,
      evidenceSnippet: "If you let me go, I promise I'll help you one day.",
      distractorAnalysis: [
        { option: "Opsi 1, 4, 5", analysis: "Singa tidak lelah (Opsi 1), tidak takut (Opsi 4), dan tikus tidak menjanjikan makanan (Opsi 5)." }
      ]
    },
    {
      id: 4,
      textId: 1,
      number: 4,
      indicator: "Indikator 4: Memprediksi akhir cerita (Pilihan Ganda Kompleks - MCMA)",
      code: "Kode: 25BIGUTAPINI12SU-250027-0079",
      type: "Predicting Story Ending",
      format: "multi_select",
      question: "As you read the part where the lion let the mouse go, which of the following endings do you anticipate?\nThere is more than one answer, click on every correct answer!",
      options: [
        { key: "1", text: "The mouse forgets about the lion and never helps him", isCorrect: false },
        { key: "2", text: "The lion gets into trouble and no one helps him", isCorrect: false },
        { key: "3", text: "The lion becomes angry at all small animals", isCorrect: false },
        { key: "4", text: "The mouse spreads the lion's kindnes to other animals", isCorrect: true },
        { key: "5", text: "The mouse becomes the lion's loyal assistant", isCorrect: true }
      ],
      officialAnswer: ["4", "5"],
      officialAnswerText: "[✓] Opsi 4 & [✓] Opsi 5",
      officialExplanation: "Dalam logika cerita moralitas klasik/fabel anak, pembaca mengantisipasi bahwa kebaikan singa akan dibalas dengan kesetiaan/bantuan tikus (membagikan kebaikan singa atau menjadi pembantu/sahabat setia singa).",
      textualEvidence: "Paragraf 5: Kebaikan hati singa melepaskan tikus menjadi pemicu antisipasi moral bahwa kebaikan akan dibalas dengan kesetiaan.",
      evidenceParagraphIndex: 4,
      evidenceSnippet: "The lion laughed loudly. \"You? Help me? That's funny.\" But the lion was feeling kind, so he let the mouse go free.",
      distractorAnalysis: [
        { option: "Opsi 1, 2, 3", analysis: "Opsi 1, 2, dan 3 mengasumsikan akhir cerita yang negatif/pesimistis yang bertentangan dengan pola konvensi naratif fabel." }
      ]
    },
    {
      id: 5,
      textId: 1,
      number: 5,
      indicator: "Indikator 5: Menentukan bagian teks yang menggambarkan karakter utama (Pilihan Ganda Kompleks - MCMA)",
      code: "Kode: 25BIGUTAEVAI16SU-250027-0103",
      type: "Character Portrayal",
      format: "multi_select",
      question: "Which of the following sentences from the story help you understand the lion's character?\nThere is more than one answer. Click on every correct answer!",
      options: [
        { key: "1", text: "\"The lion always took his afternoon nap under the shade of a big tree in the bushes.\"", isCorrect: false },
        { key: "2", text: "\"He caught the mouse and questioned him for interrupting his nap.\"", isCorrect: true },
        { key: "3", text: "\"The lion was amused at the mouse's words and decided to spare his life.\"", isCorrect: true },
        { key: "4", text: "\"With his sharp teeth, the mouse nibbled through the net.\"", isCorrect: false },
        { key: "5", text: "\"The lion thanked the mouse immensely for his help.\"", isCorrect: true }
      ],
      officialAnswer: ["2", "3", "5"],
      officialAnswerText: "[✓] Kalimat 2, [✓] Kalimat 3, [✓] Kalimat 5",
      officialExplanation: "Bukti & Penjelasan Kalimat Penggambaran Karakter Singa:\n• [✓] \"He caught the mouse and questioned him for interrupting his nap.\" → Menggambarkan watak singa yang tegas, berwibawa, dan mudah marah.\n• [✓] \"The lion was amused at the mouse's words and decided to spare his life.\" → Menggambarkan singa yang memiliki rasa humor dan sisi pengampun/baik hati.\n• [✓] \"The lion thanked the mouse immensely for his help.\" → Menggambarkan singa yang rendah hati dan tahu berterima kasih.",
      textualEvidence: "Paragraf 3, 5, dan 8 yang merefleksikan karakter singa dari pemarah, pemaaf, hingga berterima kasih.",
      evidenceParagraphIndex: 2,
      evidenceSnippet: "He quickly caught the mouse in his big paw and roared, \"Who dares to wake me up?\"",
      distractorAnalysis: [
        { option: "Kalimat 1 & 4", analysis: "Kalimat 1 hanya setting rutinitas, kalimat 4 menggambarkan tindakan fisik tikus (bukan karakter singa)." }
      ]
    },

    // ==========================================
    // TEKS 2 (SOAL 6 - 10)
    // ==========================================
    {
      id: 6,
      textId: 2,
      number: 6,
      indicator: "Indikator 6: Mengidentifikasi informasi penting eksplisit (Pilihan Ganda)",
      code: "Kode: 25BIGUTAPTXI01SU-250043-0005",
      type: "Explicit Detail Information",
      format: "multiple_choice",
      question: "Based on the information given, we can keep our mind focused and fresh by ....",
      options: [
        { key: "1", text: "knowing your learning style" },
        { key: "2", text: "using Pomodoro Technique" },
        { key: "3", text: "using online quizzes apps" },
        { key: "4", text: "by reviewing materials" },
        { key: "5", text: "by creating mind maps" }
      ],
      officialAnswer: "2",
      officialAnswerText: "Opsi 2 (using Pomodoro Technique)",
      officialExplanation: "Identifikasi Jenis Teks: Infographic / Procedure Text — Menyajikan langkah-langkah, tips, dan panduan belajar secara visual, ringkas, dan terstruktur.",
      textualEvidence: "Poin 4: \"Use the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break. This keeps your mind fresh and focused.\"",
      evidenceParagraphIndex: 3,
      evidenceSnippet: "Use the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break. This keeps your mind fresh and focused.",
      distractorAnalysis: [
        { option: "Poin 1, 5, 6, 8", analysis: "Poin 1 (Learning style), Poin 5 (Mind maps), Poin 6 (Review materials), dan Poin 8 (Online quizzes) memiliki fungsi eksplisit lain yang berbeda di dalam infografis." }
      ]
    },
    {
      id: 7,
      textId: 2,
      number: 7,
      indicator: "Indikator 7: Mengelompokkan berdasarkan kategori (Pilihan Ganda Kompleks - Kategori)",
      code: "Kode: 25BIGUTAPTX102SU-250043-0077",
      type: "Categorization",
      format: "categorization",
      question: "Based on the infographic, determine whether each study technique listed on the left is categorized as Time Management or Self Management.",
      categories: ["Time Management", "Self Management"],
      items: [
        { id: "item1", statement: "Be patient and persistent", correctCategory: "Self Management" },
        { id: "item2", statement: "Use the Pomodoro technique", correctCategory: "Time Management" },
        { id: "item3", statement: "Set a consistent study schedule", correctCategory: "Time Management" }
      ],
      officialAnswerText: "Self Management | Time Management | Time Management",
      officialExplanation: "Pembahasan Pengelompokan:\n1. Be patient and persistent: Masuk ke dalam Self Management (pengelolaan emosi, sikap mental, dan ketekunan diri).\n2. Use the Pomodoro technique: Masuk ke dalam Time Management (pembagian interval waktu belajar 25 menit dan istirahat 5 menit).\n3. Set a consistent study schedule: Masuk ke dalam Time Management (pengaturan jam dan rutinitas jadwal belajar harian).",
      textualEvidence: "Poin 2 (Jadwal konsisten), Poin 4 (Pomodoro 25/5 menit), dan Poin 10 (Sabar dan gigih).",
      evidenceParagraphIndex: 1,
      evidenceSnippet: "Set a Consistent Study Schedule: Study at the same time every day. Regularity helps build strong habits."
    },
    {
      id: 8,
      textId: 2,
      number: 8,
      indicator: "Indikator 8: Menyusun kerangka poin utama (Pilihan Ganda)",
      code: "Kode: 25BIGUTAPINI10SU-250102-0253",
      type: "Sequence of Key Points",
      format: "multiple_choice",
      question: "From the options provided, choose the sequence that best reflects the information in the infographic \"Effective Study Techniques\".",
      options: [
        { key: "1", text: "Set your goal → Watch lessons videos → Sleep well → Have group chat with friends → Eat nutritious meal" },
        { key: "2", text: "Plan study time → Join a study group → Take long breaks → Write a to do list → Write important points" },
        { key: "3", text: "Know your learning style → Find a quiet area → Set a timetable → Use less gadgets → Be patient and persistent" },
        { key: "4", text: "Know your study style → Plan your study time → Practice and repeat → Take a break → Watch lessons videos" },
        { key: "5", text: "Take notes → Join a study groups → Use different medias → Play music you like → Have good meal while studying" }
      ],
      officialAnswer: "4",
      officialAnswerText: "Opsi 4 (Know your study style → Plan your study time → Practice and repeat → Take a break → Watch lessons videos)",
      officialExplanation: "Urutan pada Opsi 4 secara koheren merefleksikan poin-poin infografis (Poin 1: Learning style → Poin 2: Schedule → Poin 6: Practice → Poin 4: Break → Poin 8: Video lessons).",
      textualEvidence: "Urutan logis poin 1, 2, 6, 4, dan 8 pada teks infografis.",
      evidenceParagraphIndex: 0,
      evidenceSnippet: "Know Your Learning Style: Understand whether you learn best by reading, listening, or watching.",
      distractorAnalysis: [
        { option: "Opsi 1, 2, 3, 5", analysis: "Opsi 1, 2, 3, dan 5 memasukkan aktivitas yang tidak ada dalam teks (misal: \"Eat nutritious meal\", \"Take long breaks\", \"Play music\", dsb.)." }
      ]
    },
    {
      id: 9,
      textId: 2,
      number: 9,
      indicator: "Indikator 9: Menyimpulkan tujuan penulisan teks (Pilihan Ganda Kompleks - MCMA)",
      code: "Kode: 25BIGUTAPINI07SU-250043-0058",
      type: "Author's Purpose",
      format: "multi_select",
      question: "Which of the following statements best reflect the author's purpose in writing the text?\nThere is more than one correct answer. Click on every correct answer!",
      options: [
        { key: "1", text: "To help students find fun strategies to play after studying", isCorrect: false },
        { key: "2", text: "To offer students guidance on how to learn more efficiently", isCorrect: true },
        { key: "3", text: "To encourage students to use simple habits to improve their learning", isCorrect: true },
        { key: "4", text: "To explain why studying tips is difficult for most students", isCorrect: false },
        { key: "5", text: "To show students that they can manage their time and focus better", isCorrect: true }
      ],
      officialAnswer: ["2", "3", "5"],
      officialAnswerText: "[✓] Pernyataan 2, [✓] Pernyataan 3, [✓] Pernyataan 5",
      officialExplanation: "Pernyataan Benar:\n• [✓] To offer students guidance on how to learn more efficiently (Memberi panduan praktis belajar efektif).\n• [✓] To encourage students to use simple habits to improve their learning (Mendorong pembentukan kebiasaan positif).\n• [✓] To show students that they can manage their time and focus better (Membantu manajemen waktu dan konsentrasi).",
      textualEvidence: "Poin 1–10 infografis yang menyajikan tips praktis manajemen waktu, ruang belajar, dan teknik belajar.",
      evidenceParagraphIndex: 1,
      evidenceSnippet: "Regularity helps build strong habits.",
      distractorAnalysis: [
        { option: "Pernyataan 1 & 4", analysis: "Pernyataan 1 salah (bukan strategi bermain), Pernyataan 4 salah (teks bukan menganalisis mengapa belajar itu sulit)." }
      ]
    },
    {
      id: 10,
      textId: 2,
      number: 10,
      indicator: "Indikator 10: Menentukan aplikasi kehidupan nyata (Pilihan Ganda Kompleks - MCMA)",
      code: "Kode: 25BIGUTAEVA113SU-250043-0040",
      type: "Real-life Practical Application",
      format: "multi_select",
      question: "If you are preparing for an important exam and want to improve your study routine, which of the following techniques do you think can be implemented effectively in your personal study time?\nThere is more than one correct answer. Click on every correct answer!",
      options: [
        { key: "1", text: "Only study when you are in a group discussion with others", isCorrect: false },
        { key: "2", text: "Use technology during all study sessions in or outside class", isCorrect: false },
        { key: "3", text: "Use the Pomodoro Technique to structure your study and break time", isCorrect: true },
        { key: "4", text: "Practice and repeat study material regularly to retain information", isCorrect: true },
        { key: "5", text: "Create a quiet and comfortable study space to improve focus", isCorrect: true }
      ],
      officialAnswer: ["3", "4", "5"],
      officialAnswerText: "[✓] Pernyataan 3, [✓] Pernyataan 4, [✓] Pernyataan 5",
      officialExplanation: "Pernyataan Benar:\n• [✓] Use the Pomodoro Technique to structure your study and break time (Poin 4).\n• [✓] Practice and repeat study material regularly to retain information (Poin 6).\n• [✓] Create a quiet and comfortable study space to improve focus (Poin 3).",
      textualEvidence: "Poin 3, 4, dan 6 infografis.",
      evidenceParagraphIndex: 2,
      evidenceSnippet: "Create a Comfortable Study Space: Find a quiet, well-lit, and distraction-free area.",
      distractorAnalysis: [
        { option: "Pernyataan 1 & 2", analysis: "Pernyataan 1 keliru (\"Only study when in group discussion\" — belajar mandiri tetap esensial). Pernyataan 2 keliru (\"Use technology during all sessions\" — penggunaan teknologi harus bijak/terarah, bukan terus-menerus tanpa henti)." }
      ]
    },

    // ==========================================
    // TEKS 3 (SOAL 11 - 15)
    // ==========================================
    {
      id: 11,
      textId: 3,
      number: 11,
      indicator: "Indikator 11: Menyusun kronologi peristiwa utama (Pilihan Ganda)",
      code: "Kode: 25BIGUTAPTXI01SU-250043-0005",
      type: "Chronological Summary",
      format: "multiple_choice",
      question: "Which statement provides the most accurate chronological summary of the story's main events?",
      options: [
        { key: "1", text: "Shero falls into the dirt. → The hyenas cause trouble at the river. → Hera tells Shero that he is funny. → Shero copies Hera's roar. → Shero becomes the kingdom's funny helper." },
        { key: "2", text: "Hera is a strong lion king. → Shero likes to pretend to be strong. → The hyenas cause trouble near the river. → Hera scares the hyenas, but Shero makes them laugh. → Shero learns that making others happy is special." },
        { key: "3", text: "Hera and Shero are both strong leaders. → The hyenas come to help the lions. → Shero tells funny stories to the hyenas. → Hera is angry with Shero. → The lions and hyenas become friends." },
        { key: "4", text: "Shero is a strong lion king. → Hera is jealous of Shero. → The hyenas attack the lions. → Shero defeats the hyenas. → Shero becomes the new king." },
        { key: "5", text: "Shero wants to be king and fights Hera. → The hyenas help Shero. → Hera leaves the kingdom. → Shero becomes king. → Hera returns to forgive Shero." }
      ],
      officialAnswer: "2",
      officialAnswerText: "Opsi 2 (Hera is a strong lion king. → Shero likes to pretend to be strong...)",
      officialExplanation: "Identifikasi Jenis Teks: Narrative Text (Fable) — Menceritakan kisah fiksi dua raja singa dengan konflik hyena dan resolusi penemuan jati diri.",
      textualEvidence: "1. Paragraf 1: Hera raja yang kuat, Shero suka berpura-pura kuat.\n2. Paragraf 2: Hyena membuat kekacauan di dekat sungai.\n3. Paragraf 3 & 4: Hera menakuti hyena, auman dan tingkah Shero justru membuat mereka tertawa.\n4. Paragraf 5 & 6: Shero menyadari keistimewaannya dalam membawa tawa dan menjadi pelawak kerajaan.",
      evidenceParagraphIndex: 0,
      evidenceSnippet: "Once upon a time, in Africa, there lived two lion kings. One was named Hera and the other was Shero.",
      distractorAnalysis: [
        { option: "Opsi 1, 3, 4, 5", analysis: "Opsi 1 tidak kronologis, Opsi 3, 4, dan 5 memuat peristiwa yang bertentangan dengan isi cerita asli." }
      ]
    },
    {
      id: 12,
      textId: 3,
      number: 12,
      indicator: "Indikator 12: Menyimpulkan pesan moral (Pilihan Ganda Kompleks - MCMA)",
      code: "Kode: 25BIGUTAPINI07SU-250102-0136",
      type: "Moral Message",
      format: "multi_select",
      question: "What can we learn from the story of Hera and Shero?\nThere is more than one answer. Click for every correct answer!",
      options: [
        { key: "1", text: "Everyone has something special to give, even if they are not the leader", isCorrect: true },
        { key: "2", text: "Being funny and making others smile is just as important as being strong", isCorrect: true },
        { key: "3", text: "Good friends will support you and help you see your real strengths", isCorrect: true },
        { key: "4", text: "Working together is better when people use their different talents", isCorrect: true },
        { key: "5", text: "Trying your best to help others is more important than always being perfect", isCorrect: true }
      ],
      officialAnswer: ["1", "2", "3", "4", "5"],
      officialAnswerText: "[✓] Pernyataan 1, [✓] Pernyataan 2, [✓] Pernyataan 3, [✓] Pernyataan 4, [✓] Pernyataan 5 (Semua Benar)",
      officialExplanation: "Pembahasan Detail: Kelima pernyataan merefleksikan pesan moral cerita:\n• Setiap individu punya keunikan masing-masing (Pernyataan 1 & 2).\n• Sahabat yang baik saling mendukung kelebihan masing-masing (Pernyataan 3).\n• Kerjasama tim menjadi sempurna dengan ragam talenta (Pernyataan 4).\n• Usaha terbaik untuk menolong lebih bermakna daripada kesempurnaan (Pernyataan 5).",
      textualEvidence: "Paragraf 5 & 6: \"The animals learned that both power and fun are important in life.\"",
      evidenceParagraphIndex: 5,
      evidenceSnippet: "The animals learned that both power and fun are important in life.",
      distractorAnalysis: [
        { option: "Semua Opsi", analysis: "Kelima pernyataan benar dan didukung oleh tema filosofis cerita." }
      ]
    },
    {
      id: 13,
      textId: 3,
      number: 13,
      indicator: "Indikator 13: Menemukan penyebab tindakan tokoh (Pilihan Ganda)",
      code: "Kode: 25BIGUTAPINI10SU-250102-0253",
      type: "Cause and Effect",
      format: "multiple_choice",
      question: "The hyenas laugh so much when Shero tries to roar like Hera because ....",
      options: [
        { key: "1", text: "Shero tries to roar in a serious way and surprises the hyenas" },
        { key: "2", text: "Shero's roar is funny, which the hyenas think he is joking" },
        { key: "3", text: "Hera tells a joke about Shero to make the hyenas laugh" },
        { key: "4", text: "Shero is acting like Hera, and it's absolutely brilliant" },
        { key: "5", text: "Shero trips and falls when trying to show his strength" }
      ],
      officialAnswer: "2",
      officialAnswerText: "Opsi 2 (Shero's roar is funny, which the hyenas think he is joking)",
      officialExplanation: "Suara auman Shero melengking tinggi dan lucu sehingga dianggap sebagai lelucon oleh para hyena.",
      textualEvidence: "Paragraf 3: \"Shero also tried to roar, but his voice was high and silly. The hyenas laughed at him. Their leader, Hank the Hyena, made jokes about Shero.\"",
      evidenceParagraphIndex: 2,
      evidenceSnippet: "Shero also tried to roar, but his voice was high and silly. The hyenas laughed at him.",
      distractorAnalysis: [
        { option: "Opsi 1, 3, 5", analysis: "Suara Shero melengking lucu (bukan serius di Opsi 1), Hera tidak membuat lelucon (Opsi 3), dan insiden jatuh terjadi di paragraf 4 (Opsi 5)." }
      ]
    },
    {
      id: 14,
      textId: 3,
      number: 14,
      indicator: "Indikator 14: Membuat inferensi pengandaian alur cerita (Pilihan Ganda Kompleks - MCMA)",
      code: "Kode: 25BIGUTAPINI07SU-250043-0058",
      type: "Hypothetical Plot Inference",
      format: "multi_select",
      question: "If in the beginning of the story, Shero is a strong lion with a loud roar, just like Hera. What would happened in the end of the story?\nThere is more than one correct answer. Click for every correct answer!",
      options: [
        { key: "1", text: "Shero and Hera would both scare the hyenas away together", isCorrect: true },
        { key: "2", text: "Shero would become the king, and Hera would leave the savannah", isCorrect: false },
        { key: "3", text: "Shero would get respect from the other animals for his strength", isCorrect: true },
        { key: "4", text: "The hyenas would still laugh at Shero because he is funny", isCorrect: false },
        { key: "5", text: "Shero would try to take Hera's place as the only lion king", isCorrect: false }
      ],
      officialAnswer: ["1", "3"],
      officialAnswerText: "[✓] Pernyataan 1 & [✓] Pernyataan 3",
      officialExplanation: "Penjelasan: Jika sejak awal Shero berbadan kuat dan mengaum keras seperti Hera:\n• [✓] Shero and Hera would both scare the hyenas away together (Keduanya bersama-sama menakuti kawanan hyena).\n• [✓] Shero would get respect from the other animals for his strength (Shero akan dihormati karena kekuatannya, bukan ditertawakan).",
      textualEvidence: "Paragraf 1 dan 3 mengenai dampak fisik dan kekuatan terhadap respon hyena.",
      evidenceParagraphIndex: 0,
      evidenceSnippet: "Hera was very strong and handsome. All the animals loved and respected him.",
      distractorAnalysis: [
        { option: "Pernyataan 2, 4, 5", analysis: "Pernyataan 2, 4, dan 5 tidak konsisten dengan premis pengandaian bahwa Shero kuat dan berwibawa." }
      ]
    },
    {
      id: 15,
      textId: 3,
      number: 15,
      indicator: "Indikator 15: Menilai penggambaran watak tokoh (Pilihan Ganda Kompleks - MCMA)",
      code: "Kode: 25BIGUTAEVAI13SU-250043-0040",
      type: "Character Trait Evaluation",
      format: "multi_select",
      question: "Shero is clumsy and funny, this is shown when he ....\nThere is more than one correct answer. Click for every correct answer!",
      options: [
        { key: "1", text: "scares the hyenas away with his loud and powerful roar", isCorrect: false },
        { key: "2", text: "makes the other animals smile by pretending to be a great king", isCorrect: true },
        { key: "3", text: "tries to roar like Hera, but his voice is small and makes the hyenas laugh", isCorrect: true },
        { key: "4", text: "walks with Hera to confront the hyenas, acting as if he is an important king too", isCorrect: false },
        { key: "5", text: "tells the hyenas that he is as mighty as King Hera, even though no one believes him", isCorrect: false }
      ],
      officialAnswer: ["2", "3"],
      officialAnswerText: "[✓] Pernyataan 2 & [✓] Pernyataan 3",
      officialExplanation: "Bukti & Pembahasan:\n• [✓] makes the other animals smile by pretending to be a great king (Paragraf 1: \"...made the other animals laugh\").\n• [✓] tries to roar like Hera, but his voice is small and makes the hyenas laugh (Paragraf 3).",
      textualEvidence: "Paragraf 1 dan 3.",
      evidenceParagraphIndex: 0,
      evidenceSnippet: "He often copied Hera's roar, but it made the other animals laugh.",
      distractorAnalysis: [
        { option: "Pernyataan 1, 4, 5", analysis: "Opsi 1 bertentangan dengan fakta teks; Opsi 4 dan 5 mencerminkan kepolosan/keinginan tampil, bukan bukti kekonyolan/kelucuan yang membuat orang tertawa." }
      ]
    },

    // ==========================================
    // TEKS 4 (SOAL 16 - 20)
    // ==========================================
    {
      id: 16,
      textId: 4,
      number: 16,
      indicator: "Indikator 16: Mengidentifikasi informasi eksplisit (Pilihan Ganda Kompleks - MCMA)",
      code: "Kode: 25BIGUTAPTX101SU-250045-0100",
      type: "Explicit Factual Details",
      format: "multi_select",
      question: "Which of the following descriptions are mentioned clearly in the text?\nThere are more than one correct answer. Click on every correct answer.",
      options: [
        { key: "1", text: "The reef was built by local communities over hundreds of years", isCorrect: false },
        { key: "2", text: "The reef is located in the Pacific Ocean near Australia", isCorrect: true },
        { key: "3", text: "The reef can help protect the coast from big waves", isCorrect: true },
        { key: "4", text: "The reef is home to sea turtles and dolphins", isCorrect: true },
        { key: "5", text: "The reef has more than 10,000 coral islands", isCorrect: false }
      ],
      officialAnswer: ["2", "3", "4"],
      officialAnswerText: "[✓] Pernyataan 2, [✓] Pernyataan 3, [✓] Pernyataan 4",
      officialExplanation: "Identifikasi Jenis Teks: Descriptive Text — Mendeskripsikan karakteristik fisik, lokasi, keanekaragaman hayati, dan fungsi ekologis Great Barrier Reef.\nBukti Tekstual:\n• [✓] Paragraf 1: \"...located in the Pacific Ocean, near the northeast coast of Australia.\"\n• [✓] Paragraf 4: \"It helps protect the coast from big waves and storms.\"\n• [✓] Paragraf 2: \"There are many kinds of colorful fish, sea turtles, dolphins...\"",
      textualEvidence: "Paragraf 1, 2, dan 4.",
      evidenceParagraphIndex: 0,
      evidenceSnippet: "It is located in the Pacific Ocean, near the northeast coast of Australia.",
      distractorAnalysis: [
        { option: "Pernyataan 1 & 5", analysis: "Pernyataan 1 salah (terumbu karang adalah bentukan alam, bukan dibangun manusia). Pernyataan 5 salah (angka 10.000 pulau tidak tercantum di teks)." }
      ]
    },
    {
      id: 17,
      textId: 4,
      number: 17,
      indicator: "Indikator 17: Menentukan makna frasa kontekstual (Pilihan Ganda)",
      code: "Kode: 25BIGUTAPINI07SU-250045-0067",
      type: "Contextual Phrase Meaning",
      format: "multiple_choice",
      question: "The author mentioned \"It feels like a different world under the sea\". What does the phrase \"a different world under the sea\" most likely mean?",
      options: [
        { key: "1", text: "A safe place that has bright reef" },
        { key: "2", text: "A peaceful place where people can live under water" },
        { key: "3", text: "A colorful place that looks the same as the land" },
        { key: "4", text: "A shining reef that is quiet" },
        { key: "5", text: "A calm place that looks beautiful and unique" }
      ],
      officialAnswer: "5",
      officialAnswerText: "Opsi 5 (A calm place that looks beautiful and unique)",
      officialExplanation: "Frasa kiasan \"dunia yang berbeda di bawah laut\" menggambarkan suasana bawah air yang luar biasa indah, tenang, dan memiliki keunikan pemandangan berbeda dari daratan.",
      textualEvidence: "Paragraf 3: \"When the sun shines, the reef looks bright and full of light. It feels like a different world under the sea.\"",
      evidenceParagraphIndex: 2,
      evidenceSnippet: "When the sun shines, the reef looks bright and full of light. It feels like a different world under the sea.",
      distractorAnalysis: [
        { option: "Opsi 1, 2, 3, 4", analysis: "Opsi 2 salah (manusia tidak tinggal di bawah air); Opsi 3 salah (pemandangannya berbeda dari darat, bukan sama); Opsi 1 dan 4 tidak menangkap nuansa keunikan 'different world'." }
      ]
    },
    {
      id: 18,
      textId: 4,
      number: 18,
      indicator: "Indikator 18: Menyimpulkan gagasan utama tersirat (Pilihan Ganda)",
      code: "Kode: 25BIGUTAPINI07SU-250045-0072",
      type: "Implied Main Idea",
      format: "multiple_choice",
      question: "Which of the following best represents the main idea implied by the text?",
      options: [
        { key: "1", text: "The reef is useful for fishing and shipping" },
        { key: "2", text: "The reef is large, but not important to people" },
        { key: "3", text: "The reef is a natural treasure that must be cared for" },
        { key: "4", text: "The reef is only for scientists and researchers to explore" },
        { key: "5", text: "The reef is a protected area that should be closed to visitors" }
      ],
      officialAnswer: "3",
      officialAnswerText: "Opsi 3 (The reef is a natural treasure that must be cared for)",
      officialExplanation: "Gagasan utama tersirat adalah Great Barrier Reef merupakan warisan kekayaan alam berharga yang memiliki peran vital bagi ekosistem sehingga wajib dijaga kelestariannya.",
      textualEvidence: "Paragraf 4: \"The reef is not only beautiful, but also very important... Without the reef, the ocean would not be the same.\"",
      evidenceParagraphIndex: 3,
      evidenceSnippet: "The reef is not only beautiful, but also very important. It helps protect the coast from big waves and storms.",
      distractorAnalysis: [
        { option: "Opsi 1, 2, 4, 5", analysis: "Opsi 2, 4, dan 5 bertentangan dengan isi teks; Opsi 1 hanya menangkap satu detail kecil tanpa menyoroti peran ekologis dan keindahannya." }
      ]
    },
    {
      id: 19,
      textId: 4,
      number: 19,
      indicator: "Indikator 19: Menentukan fakta tambahan yang mendukung (Pilihan Ganda)",
      code: "Kode: 25BIGUTAPINI06SU-250045-0060",
      type: "Persuasive Supporting Detail",
      format: "multiple_choice",
      question: "Which detail would best encourage people to visit the Great Barrier Reef?",
      options: [
        { key: "1", text: "Visitors can see an Australian national park" },
        { key: "2", text: "Visitors can stay in hotels around the reef" },
        { key: "3", text: "Visitors can get there by boat or short flights" },
        { key: "4", text: "Visitors can protect the coral and the animals" },
        { key: "5", text: "Visitors can see the coral by diving or swimming" }
      ],
      officialAnswer: "5",
      officialAnswerText: "Opsi 5 (Visitors can see the coral by diving or swimming)",
      officialExplanation: "Pengalaman langsung menyelam dan berenang menyaksikan warna-warni terumbu karang merupakan daya tarik wisata paling persuasif untuk memikat wisatawan.",
      textualEvidence: "Paragraf 2 kalimat terakhir: \"People can see this beauty by swimming, diving, or joining a boat tour.\"",
      evidenceParagraphIndex: 1,
      evidenceSnippet: "People can see this beauty by swimming, diving, or joining a boat tour.",
      distractorAnalysis: [
        { option: "Opsi 1, 2, 3, 4", analysis: "Opsi 1, 2, dan 3 adalah detail logistik/lokasi yang tidak disebutkan di teks; Opsi 4 adalah tindakan konservasi, bukan daya tarik rekreasi langsung." }
      ]
    },
    {
      id: 20,
      textId: 4,
      number: 20,
      indicator: "Indikator 20: Mengevaluasi bagian teks yang mendukung ide utama (Pilihan Ganda Kompleks - MCMA)",
      code: "Kode: 25BIGUTAEVAI16SU-250045-0101",
      type: "Evaluating Supporting Parts",
      format: "multi_select",
      question: "Which parts of the text best support the idea that the Great Barrier Reef is both beautiful and important?\nThere is more than one correct answer. Click on every correct answer!",
      options: [
        { key: "1", text: "The reef helps protect the coast from big waves", isCorrect: true },
        { key: "2", text: "It is home to sea turtles, dolphins, and colorful fish", isCorrect: true },
        { key: "3", text: "The coral reefs grow best in cold, deep water", isCorrect: false },
        { key: "4", text: "Some areas of the reef are damaged by starfish and warm water", isCorrect: false },
        { key: "5", text: "The reef was discovered by sailors in the 1800s", isCorrect: false }
      ],
      officialAnswer: ["1", "2"],
      officialAnswerText: "[✓] Pernyataan 1 & [✓] Pernyataan 2",
      officialExplanation: "Bukti & Pembahasan:\n• [✓] The reef helps protect the coast from big waves: Mendukung aspek pentingnya fungsi fisik terumbu karang (important - Paragraf 4).\n• [✓] It is home to sea turtles, dolphins, and colorful fish: Mendukung aspek keindahan dan kekayaan hayatinya (beautiful & important - Paragraf 2).",
      textualEvidence: "Paragraf 2 & Paragraf 4.",
      evidenceParagraphIndex: 3,
      evidenceSnippet: "It helps protect the coast from big waves and storms. It is a home for sea animals and a place where plants can grow.",
      distractorAnalysis: [
        { option: "Pernyataan 3, 4, 5", analysis: "Pernyataan 3, 4, dan 5 berisi klaim yang salah secara fakta teks atau tidak disebutkan dalam bacaan." }
      ]
    }
  ]
};
