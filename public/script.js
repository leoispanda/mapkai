const pages = Array.from(document.querySelectorAll("[data-page]"));
const routeLinks = Array.from(document.querySelectorAll("[data-route]"));
const founderToggle = document.getElementById("founderToggle");
const canvas = document.getElementById("knowledgeCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const contactEmail = "hello@mapkai.com";

const readiness = {
  mapOnly: "Map only",
  classified: "Classified",
  pathReady: "Path ready",
  quizReady: "Quiz ready",
  validated: "Validated",
};

const masteryLevels = {
  ocean: { label: "Ocean", mapLabel: "Unknown ocean", color: "#2f86b5" },
  snow: { label: "Snow mountain", mapLabel: "Snow mountain", color: "#e8f6f7" },
  land: { label: "Land", mapLabel: "Land", color: "#d6a947" },
  green: { label: "Green land", mapLabel: "Green land", color: "#7fc76f" },
};

const categories = [
  {
    code: "00",
    title: "Generic programmes and qualifications",
    chineseTitle: "通用课程与资格",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "000", title: "Generic programmes and qualifications not further defined", fields: [["0000", "Generic programmes and qualifications not further defined"]] },
      { code: "001", title: "Basic programmes and qualifications", fields: [["0011", "Basic programmes and qualifications"]] },
      { code: "002", title: "Literacy and numeracy", fields: [["0021", "Literacy and numeracy"]] },
      { code: "003", title: "Personal skills and development", fields: [["0031", "Personal skills and development"]] },
      { code: "009", title: "Generic programmes and qualifications not elsewhere classified", fields: [["0099", "Generic programmes and qualifications not elsewhere classified"]] },
    ],
  },
  {
    code: "01",
    title: "Education",
    chineseTitle: "教育",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      {
        code: "011",
        title: "Education",
        fields: [
          ["0110", "Education not further defined"],
          ["0111", "Education science"],
          ["0112", "Training for pre-school teachers"],
          ["0113", "Teacher training without subject specialisation"],
          ["0114", "Teacher training with subject specialisation"],
          ["0119", "Education not elsewhere classified"],
        ],
      },
      { code: "018", title: "Inter-disciplinary programmes and qualifications involving education", fields: [["0188", "Inter-disciplinary programmes and qualifications involving education"]] },
    ],
  },
  {
    code: "02",
    title: "Arts and Humanities",
    chineseTitle: "艺术与人文",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "020", title: "Arts and humanities not further defined", fields: [["0200", "Arts and humanities not further defined"]] },
      {
        code: "021",
        title: "Arts",
        fields: [
          ["0210", "Arts not further defined"],
          ["0211", "Audio-visual techniques and media production"],
          ["0212", "Fashion, interior and industrial design"],
          ["0213", "Fine arts"],
          ["0214", "Handicrafts"],
          ["0215", "Music and performing arts"],
          ["0219", "Arts not elsewhere classified"],
        ],
      },
      {
        code: "022",
        title: "Humanities (except languages)",
        fields: [
          ["0220", "Humanities (except languages) not further defined"],
          ["0221", "Religion and theology"],
          ["0222", "History and archaeology"],
          ["0223", "Philosophy and ethics"],
          ["0229", "Humanities (except languages) not elsewhere classified"],
        ],
      },
      {
        code: "023",
        title: "Languages",
        fields: [
          ["0230", "Languages not further defined"],
          ["0231", "Language acquisition"],
          ["0232", "Literature and linguistics"],
          ["0239", "Languages not elsewhere classified"],
        ],
      },
      { code: "028", title: "Inter-disciplinary programmes and qualifications involving arts and humanities", fields: [["0288", "Inter-disciplinary programmes and qualifications involving arts and humanities"]] },
      { code: "029", title: "Arts and humanities not elsewhere classified", fields: [["0299", "Arts and humanities not elsewhere classified"]] },
    ],
  },
  {
    code: "03",
    title: "Social Sciences, Journalism and Information",
    chineseTitle: "社会科学、新闻与信息",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "030", title: "Social sciences, journalism and information not further defined", fields: [["0300", "Social sciences, journalism and information not further defined"]] },
      {
        code: "031",
        title: "Social and behavioural sciences",
        fields: [
          ["0310", "Social and behavioural sciences not further defined"],
          ["0311", "Economics"],
          ["0312", "Political sciences and civics"],
          ["0313", "Psychology"],
          ["0314", "Sociology and cultural studies"],
          ["0319", "Social and behavioural sciences not elsewhere classified"],
        ],
      },
      {
        code: "032",
        title: "Journalism and information",
        fields: [
          ["0320", "Journalism and information not further defined"],
          ["0321", "Journalism and reporting"],
          ["0322", "Library, information and archival studies"],
          ["0329", "Journalism and information not elsewhere classified"],
        ],
      },
      { code: "038", title: "Inter-disciplinary programmes and qualifications involving social sciences, journalism and information", fields: [["0388", "Inter-disciplinary programmes and qualifications involving social sciences, journalism and information"]] },
      { code: "039", title: "Social sciences, journalism and information not elsewhere classified", fields: [["0399", "Social sciences, journalism and information not elsewhere classified"]] },
    ],
  },
  {
    code: "04",
    title: "Business, Administration and Law",
    chineseTitle: "商业、管理与法律",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "040", title: "Business, administration and law not further defined", fields: [["0400", "Business, administration and law not further defined"]] },
      {
        code: "041",
        title: "Business and administration",
        fields: [
          ["0410", "Business and administration not further defined"],
          ["0411", "Accounting and taxation"],
          ["0412", "Finance, banking and insurance"],
          ["0413", "Management and administration"],
          ["0414", "Marketing and advertising"],
          ["0415", "Secretarial and office work"],
          ["0416", "Wholesale and retail sales"],
          ["0417", "Work skills"],
          ["0419", "Business and administration not elsewhere classified"],
        ],
      },
      { code: "042", title: "Law", fields: [["0421", "Law"]] },
      { code: "048", title: "Inter-disciplinary programmes and qualifications involving business, administration and law", fields: [["0488", "Inter-disciplinary programmes and qualifications involving business, administration and law"]] },
      { code: "049", title: "Business, administration and law not elsewhere classified", fields: [["0499", "Business, administration and law not elsewhere classified"]] },
    ],
  },
  {
    code: "05",
    title: "Natural Sciences, Mathematics and Statistics",
    chineseTitle: "自然科学、数学与统计",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "050", title: "Natural sciences, mathematics and statistics not further defined", fields: [["0500", "Natural sciences, mathematics and statistics not further defined"]] },
      {
        code: "051",
        title: "Biological and related sciences",
        fields: [
          ["0510", "Biological and related sciences not further defined"],
          ["0511", "Biology"],
          ["0512", "Biochemistry"],
          ["0519", "Biological and related sciences not elsewhere classified"],
        ],
      },
      {
        code: "052",
        title: "Environment",
        fields: [
          ["0520", "Environment not further defined"],
          ["0521", "Environmental sciences"],
          ["0522", "Natural environments and wildlife"],
          ["0529", "Environment not elsewhere classified"],
        ],
      },
      {
        code: "053",
        title: "Physical sciences",
        fields: [
          ["0530", "Physical sciences not further defined"],
          ["0531", "Chemistry"],
          ["0532", "Earth sciences"],
          ["0533", "Physics"],
          ["0539", "Physical sciences not elsewhere classified"],
        ],
      },
      {
        code: "054",
        title: "Mathematics and statistics",
        fields: [
          ["0540", "Mathematics and statistics not further defined"],
          ["0541", "Mathematics"],
          ["0542", "Statistics"],
        ],
      },
      { code: "058", title: "Inter-disciplinary programmes and qualifications involving natural sciences, mathematics and statistics", fields: [["0588", "Inter-disciplinary programmes and qualifications involving natural sciences, mathematics and statistics"]] },
      { code: "059", title: "Natural sciences, mathematics and statistics not elsewhere classified", fields: [["0599", "Natural sciences, mathematics and statistics not elsewhere classified"]] },
    ],
  },
  {
    code: "06",
    title: "Information and Communication Technologies",
    chineseTitle: "信息与通信技术",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      {
        code: "061",
        title: "Information and Communication Technologies (ICTs)",
        fields: [
          ["0610", "Information and Communication Technologies (ICTs) not further defined"],
          ["0611", "Computer use"],
          ["0612", "Database and network design and administration"],
          ["0613", "Software and applications development and analysis"],
          ["0619", "Information and Communication Technologies (ICTs) not elsewhere classified"],
        ],
      },
      { code: "068", title: "Inter-disciplinary programmes and qualifications involving Information and Communication Technologies (ICTs)", fields: [["0688", "Inter-disciplinary programmes and qualifications involving Information and Communication Technologies (ICTs)"]] },
    ],
  },
  {
    code: "07",
    title: "Engineering, Manufacturing and Construction",
    chineseTitle: "工程、制造与建筑",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "070", title: "Engineering, manufacturing and construction not further defined", fields: [["0700", "Engineering, manufacturing and construction not further defined"]] },
      {
        code: "071",
        title: "Engineering and engineering trades",
        fields: [
          ["0710", "Engineering and engineering trades not further defined"],
          ["0711", "Chemical engineering and processes"],
          ["0712", "Environmental protection technology"],
          ["0713", "Electricity and energy"],
          ["0714", "Electronics and automation"],
          ["0715", "Mechanics and metal trades"],
          ["0716", "Motor vehicles, ships and aircraft"],
          ["0719", "Engineering and engineering trades not elsewhere classified"],
        ],
      },
      {
        code: "072",
        title: "Manufacturing and processing",
        fields: [
          ["0720", "Manufacturing and processing not further defined"],
          ["0721", "Food processing"],
          ["0722", "Materials (glass, paper, plastic and wood)"],
          ["0723", "Textiles (clothes, footwear and leather)"],
          ["0724", "Mining and extraction"],
          ["0729", "Manufacturing and processing not elsewhere classified"],
        ],
      },
      {
        code: "073",
        title: "Architecture and construction",
        fields: [
          ["0730", "Architecture and construction not further defined"],
          ["0731", "Architecture and town planning"],
          ["0732", "Building and civil engineering"],
        ],
      },
      { code: "078", title: "Inter-disciplinary programmes and qualifications involving engineering, manufacturing and construction", fields: [["0788", "Inter-disciplinary programmes and qualifications involving engineering, manufacturing and construction"]] },
      { code: "079", title: "Engineering, manufacturing and construction not elsewhere classified", fields: [["0799", "Engineering, manufacturing and construction not elsewhere classified"]] },
    ],
  },
  {
    code: "08",
    title: "Agriculture, Forestry, Fisheries and Veterinary",
    chineseTitle: "农业、林业、渔业与兽医",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "080", title: "Agriculture, forestry, fisheries and veterinary not further defined", fields: [["0800", "Agriculture, forestry, fisheries and veterinary not further defined"]] },
      {
        code: "081",
        title: "Agriculture",
        fields: [
          ["0810", "Agriculture not further defined"],
          ["0811", "Crop and livestock production"],
          ["0812", "Horticulture"],
          ["0819", "Agriculture not elsewhere classified"],
        ],
      },
      { code: "082", title: "Forestry", fields: [["0821", "Forestry"]] },
      { code: "083", title: "Fisheries", fields: [["0831", "Fisheries"]] },
      { code: "084", title: "Veterinary", fields: [["0841", "Veterinary"]] },
      { code: "088", title: "Inter-disciplinary programmes and qualifications involving agriculture, forestry, fisheries and veterinary", fields: [["0888", "Inter-disciplinary programmes and qualifications involving agriculture, forestry, fisheries and veterinary"]] },
      { code: "089", title: "Agriculture, forestry, fisheries and veterinary not elsewhere classified", fields: [["0899", "Agriculture, forestry, fisheries and veterinary not elsewhere classified"]] },
    ],
  },
  {
    code: "09",
    title: "Health and Welfare",
    chineseTitle: "健康与福利",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "090", title: "Health and welfare not further defined", fields: [["0900", "Health and welfare not further defined"]] },
      {
        code: "091",
        title: "Health",
        fields: [
          ["0910", "Health not further defined"],
          ["0911", "Dental studies"],
          ["0912", "Medicine"],
          ["0913", "Nursing and midwifery"],
          ["0914", "Medical diagnostic and treatment technology"],
          ["0915", "Therapy and rehabilitation"],
          ["0916", "Pharmacy"],
          ["0917", "Traditional and complementary medicine and therapy"],
          ["0919", "Health not elsewhere classified"],
        ],
      },
      {
        code: "092",
        title: "Welfare",
        fields: [
          ["0920", "Welfare not further defined"],
          ["0921", "Care of the elderly and of disabled adults"],
          ["0922", "Child care and youth services"],
          ["0923", "Social work and counselling"],
          ["0929", "Welfare not elsewhere classified"],
        ],
      },
      { code: "098", title: "Inter-disciplinary programmes and qualifications involving health and welfare", fields: [["0988", "Inter-disciplinary programmes and qualifications involving health and welfare"]] },
      { code: "099", title: "Health and welfare not elsewhere classified", fields: [["0999", "Health and welfare not elsewhere classified"]] },
    ],
  },
  {
    code: "10",
    title: "Services",
    chineseTitle: "服务",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "100", title: "Services not further defined", fields: [["1000", "Services not further defined"]] },
      {
        code: "101",
        title: "Personal services",
        fields: [
          ["1010", "Personal services not further defined"],
          ["1011", "Domestic services"],
          ["1012", "Hair and beauty services"],
          ["1013", "Hotel, restaurants and catering"],
          ["1014", "Sports"],
          ["1015", "Travel, tourism and leisure"],
          ["1019", "Personal services not elsewhere classified"],
        ],
      },
      {
        code: "102",
        title: "Hygiene and occupational health services",
        fields: [
          ["1020", "Hygiene and occupational health services not further defined"],
          ["1021", "Community sanitation"],
          ["1022", "Occupational health and safety"],
          ["1029", "Hygiene and occupational health services not elsewhere classified"],
        ],
      },
      {
        code: "103",
        title: "Security services",
        fields: [
          ["1030", "Security services not further defined"],
          ["1031", "Military and defence"],
          ["1032", "Protection of persons and property"],
          ["1039", "Security services not elsewhere classified"],
        ],
      },
      { code: "104", title: "Transport services", fields: [["1041", "Transport services"]] },
      { code: "108", title: "Inter-disciplinary programmes and qualifications involving services", fields: [["1088", "Inter-disciplinary programmes and qualifications involving services"]] },
      { code: "109", title: "Services not elsewhere classified", fields: [["1099", "Services not elsewhere classified"]] },
    ],
  },
];

const modulePassports = {
  home: {
    name: "Home",
    route: "/",
    purpose: "Global entrance for MapKAI.",
    userValue: "Know what MapKAI is, what to do now, and why to return.",
    founderValue: "Keeps the front door simple while modules expand separately.",
    status: "Draft",
    relatedModules: "Map, Categories, Learning",
    nextAction: "Measure whether visitors click into Map, Categories, or Learning.",
    doNotTouch: "Do not add account, dashboard, community, or public PDC here.",
  },
  path: {
    name: "Foundation Learning Path",
    route: "/learning/foundation",
    purpose: "Connect a chosen field into a beginner-friendly learning order.",
    userValue: "Understand how to move from broad category to practical next steps.",
    founderValue: "Tests a simple learning path pattern without building an algorithm.",
    status: "Draft",
    relatedModules: "Map, Categories, Learning",
    nextAction: "Choose which category should receive the next detailed learning path.",
    doNotTouch: "Do not build a full question bank or recommendation engine here.",
  },
};

const field0412 = {
  code: "0412",
  title: "Finance, banking and insurance",
  chineseTitle: "金融、银行与保险",
  status: "Draft",
  readiness: readiness.pathReady,
  userLayer: [
    ["What is it?", "Finance is the study of money, risk, time, and trust. It explains saving, borrowing, investing, banking, insurance, and financial decisions."],
    ["Why it matters", "Almost every life and business decision has a money question inside it: price, risk, budget, loan, return, or protection."],
    ["Core topics", "Personal finance, corporate finance, banking, investment, insurance, risk, interest, credit, markets, and financial regulation."],
    ["Common real-life examples", "Choosing a savings account, understanding a mortgage, comparing insurance, judging a company budget, or asking whether an investment return is worth the risk."],
    ["What you can learn", "Read basic financial choices, explain risk and return, understand banking products, and connect finance to accounting, management, marketing, and law."],
    ["Related learning path", "Finance can connect to learning paths when a user chooses a business-related direction."],
  ],
  founderLayer: {
    officialDefinition: "Programmes and qualifications dealing with financial activities, banking, insurance, investment, and risk-related services.",
    inclusions: "Finance, banking, insurance, investment analysis, risk management, financial products.",
    exclusions: "Accounting and taxation should stay in 0411. General management should stay in 0413. Law-heavy regulation should connect to 0421.",
    relatedFields: "0411 Accounting and taxation; 0413 Management; 0414 Marketing; 0421 Law.",
    questionBankTags: "finance-basic, banking-basic, insurance-basic, risk-return, personal-finance, business-finance.",
    founderNotes: "Keep this page practical and life-connected. Advanced professional finance can wait until the green-land question layer.",
    nextAction: "Add a small set of beginner questions after the page structure is tested.",
  },
};

const pathTypes = [
  ["Beginner Path", "For users who need a first mental map."],
  ["Foundation Path", "For users building stable cross-field basics."],
  ["Exam Preparation Path", "For users preparing around a target syllabus."],
  ["Career-Oriented Path", "For users choosing skills around a job direction."],
  ["Weakness Repair Path", "For users filling specific gaps after questions."],
  ["Founder-Curated Path", "For opinionated routes designed by MapKAI."],
];

const foundationPath = [
  ["1", "See the landscape", "Start by understanding the whole knowledge map before choosing one direction."],
  ["2", "Choose a category", "Pick the category that best matches the question, goal, or field you want to explore."],
  ["3", "Open detailed fields", "Look at the groups and detailed fields to understand what belongs inside the category."],
  ["4", "Follow a path", "Use a learning path to turn selected fields into a practical order."],
  ["5", "Review and expand", "Return to the map, mark what you understand, and choose the next field to explore."],
];

const subjectQuestionSeeds = {
  "00": { subject: "Generic programmes and qualifications", theme: "basic life skills", prompts: ["At the supermarket, Emma compares cereal by price per kilo. What everyday superpower is she using?", "A friend learns apps, recipes, and cheaper bills but says he is not a learner. What is the hidden lesson?", "Jin writes a clear refund email for a broken washing machine. Why did writing matter?", "A calculator can split a bill, but why is understanding percentages still useful?", "Why can learning new tools fast be more valuable than knowing one tool today?", "Why are classes in forms, letters, and budgets still real education?"] },
  "01": { subject: "Education", theme: "learning and teaching", prompts: ["You forget someone's name seconds after hearing it. What trick helps most?", "A parent holds a bike seat, then lets go for longer and longer moments. What is happening?", "Sara rereads notes; Tom explains aloud from memory. Who finds weak spots faster?", "A language app reviews words right before forgetting. What is the learning trick?", "Why do weekly phishing simulations beat one long warning lecture?", "Why do examples and structure help beginners facing a blank page?"] },
  "02": { subject: "Arts and Humanities", theme: "meaning and interpretation", prompts: ["A movie villain enters with cold lighting and low music. Why do you feel nervous?", "A cafe changes its menu font and cakes feel homemade. What changed?", "A tiny blue patch in an old painting used a once-costly pigment. What does that reveal?", "Two readers find different evidence-based meanings in one story. What is the best takeaway?", "A simple chair becomes interesting when linked to postwar housing. Why?", "A documentary uses real interviews but very different music and lighting. What should viewers notice?"] },
  "03": { subject: "Social Sciences, Journalism and Information", theme: "people, groups, and information", prompts: ["A free-coffee rumor spreads before anyone checks the cafe page. What should happen first?", "One person yawns and others soon yawn too. What does this show?", "A clickbait headline works even though the story is ordinary. Why?", "A sign says most people take stairs and stair use rises. Why might that work?", "Two polls ask about parks with different wording and get different results. What is happening?", "An algorithm shows more angry posts because they get comments. What risk appears?"] },
  "04": { subject: "Business, Administration and Law", theme: "markets, rules, and organizations", prompts: ["A bakery bundle makes customers buy two croissants instead of one. What is happening?", "A shop sells a lot but costs eat the money. What was confused?", "A gym makes joining easy but cancellation hard. What concern appears?", "A great restaurant is empty because nobody knows it exists. What is the mistake?", "A vague delivery promise causes an argument. What would reduce risk?", "A call center rewards only short calls and problems return. What went wrong?"] },
  "05": { subject: "Natural Sciences, Mathematics and Statistics", theme: "evidence, measurement, and patterns", prompts: ["A metal bench feels colder than a wooden one on the same morning. Why?", "A 70% rain forecast does not rain on your street. What is the better interpretation?", "A smoothie seems to cause energy, but the person also slept nine hours. What should a careful thinker say?", "A shop has a 5-star average from only two reviews. What is the red flag?", "Factory output rises after a new machine, but someone asks about the old machine too. Why?", "A city uses one road-side sensor to judge all pollution. What is wrong?"] },
  "06": { subject: "Information and Communication Technologies", theme: "digital systems and data", prompts: ["Why are software updates not just annoying pop-ups?", "A friend uses one password everywhere. What is the risk?", "Sorting one spreadsheet column makes addresses mismatch names. What happened?", "A coffee machine pours only if it detects a cup. What coding idea is this?", "A delivery app has duplicate customer IDs and shows wrong orders. Why is this serious?", "Invoice automation copies old bad rules and approves strange invoices. What is the lesson?"] },
  "07": { subject: "Engineering, Manufacturing and Construction", theme: "building and design trade-offs", prompts: ["A cardboard tube holds weight upright but crushes sideways. What does this show?", "Why do bridges often use triangles?", "A hard phone case resists scratches but cracks when dropped. What trade-off appears?", "A chair factory divides work into repeated steps. Why might it be faster?", "A glass apartment looks beautiful but overheats in summer. What lesson appears?", "A machine part uses the strongest metal but becomes heavy and costly. What went wrong?"] },
  "08": { subject: "Agriculture, Forestry, Fisheries and Veterinary", theme: "living resources and sustainability", prompts: ["A tomato plant grows leaves but few tomatoes after lots of nitrogen. Why?", "Why wait before driving a tractor onto wet soil?", "Why can changing crops help when pests rise?", "Fishing boats catch more before others do and fish decline. What problem is this?", "Cows produce less milk during a heatwave despite feed. What hidden factor matters?", "Why might a forest manager remove some small trees?"] },
  "09": { subject: "Health and Welfare", theme: "prevention, care, and wellbeing", prompts: ["A friend brushes teeth hard and gums bleed. What is the better habit?", "Someone drinks coffee at midnight and wakes tired. What might be happening?", "A new runner goes hard daily, hurts knees, and quits. What would have been wiser?", "One mildly sick worker comes in and half the office coughs later. What idea appears?", "A patient feels better after antibiotics and wants to stop early. What is the concern?", "An elderly man misses appointments because the bus route changed. What does this reveal?"] },
  "10": { subject: "Services", theme: "experience, safety, and coordination", prompts: ["A tired hotel guest gets water, calm check-in, and clear directions. Why does it matter?", "Why put a warning sign on a wet but clean floor?", "A restaurant serves dessert before soup and guests eat at different times. What is the problem?", "Airport security slows because instructions appear only at the tray. What helps?", "A theme park sells too many fast-track passes and all lines slow. What went wrong?", "Drivers measured only by speed damage parcels and miss instructions. What is the mistake?"] }
};

const questionOptions = {
  "00": [
    ["Basic numeracy for smarter daily choices", "Professional accounting knowledge", "Brand loyalty"],
    ["Everyday life already contains learning", "People learn only in classrooms", "Learning stops after school"],
    ["Clear communication can turn frustration into action", "Longer messages always get better results", "Emotional anger is the best strategy"],
    ["Understanding helps you know what to calculate", "Calculators replace understanding", "Percentages are only useful for bankers"],
    ["Because adaptability often outlasts one specific tool", "Because software skills are worthless", "Because interviews reward vague answers"],
    ["Foundational skills can increase independence and participation", "Only university courses count as learning", "Adults cannot benefit from basic courses"]
  ],
  "01": [
    ["Repeat and use the name soon after hearing it", "Pretend you heard it clearly", "Wait until tomorrow to think about it"],
    ["Giving temporary support until independence grows", "Testing the child without any help", "Making the bike harder to ride"],
    ["Tom, because recall exposes weak spots", "Sara, because highlighting always proves mastery", "Neither, because studying cannot be checked"],
    ["Spaced repetition strengthens memory over time", "Forgetting means learning has failed completely", "Cramming once is always more efficient"],
    ["It turns abstract warnings into repeated real decisions", "It proves employees do not need rules", "It makes cybersecurity purely entertaining"],
    ["The task became supported enough to reduce mental overload", "Creativity disappeared because examples were shown", "Beginners became experts instantly"]
  ],
  "02": [
    ["The scene uses artistic signals to shape emotion", "The actor has explained the plot", "The camera is broken"],
    ["The visual style changed the meaning people felt", "The cake recipe changed automatically", "Fonts cannot influence perception"],
    ["Materials can carry social and historical meaning", "Old painters chose colors randomly", "Blue was invisible in the past"],
    ["Good stories can hold multiple evidence-based meanings", "Only one reader is allowed to be right", "Interpretation means guessing without evidence"],
    ["Its design connects to history, society, and human needs", "A chair can never be cultural", "The label makes the object more expensive"],
    ["Real material can still be framed through storytelling choices", "Documentaries are automatically neutral", "Music has no effect on judgment"]
  ],
  "03": [
    ["Check the original source before believing it", "Share it quickly before the offer ends", "Believe it if many people repeat it"],
    ["Social behavior can spread through groups", "People are never influenced by others", "Yawning is a political opinion"],
    ["It used curiosity to attract attention", "It gave a complete balanced summary", "It removed emotion from the story"],
    ["People often respond to social norms", "People dislike short messages", "Signs physically force people to act"],
    ["Question wording can shape public opinion data", "People have no opinions about parks", "Polls always measure reality perfectly"],
    ["The platform may amplify outrage because it drives engagement", "The platform will automatically improve public debate", "Angry posts will disappear because people ignore them"]
  ],
  "04": [
    ["A bundle changes the perceived deal", "The croissants became legally different", "Customers forgot how hunger works"],
    ["Revenue is not the same as profit", "Profit appears before costs", "Sales make expenses disappear"],
    ["The company may be using friction to keep customers", "The company is improving customer freedom", "The contract becomes invisible"],
    ["Quality alone does not create awareness", "Good products should be kept secret", "Marketing only matters for bad products"],
    ["A clear written agreement on delivery terms", "More emojis in the phone call", "Avoiding any record of the deal"],
    ["The incentive encouraged the wrong behavior", "Employees became less human overnight", "Customers dislike fast answers in every case"]
  ],
  "05": [
    ["Metal pulls heat from your body faster", "Metal is always at a lower temperature", "Wood secretly produces warmth"],
    ["Probability describes uncertainty, not a personal guarantee", "The app promised rain on every person", "A 70% chance means rain must last 70% of the day"],
    ["One experience does not prove cause and effect", "The smoothie must be magic", "Sleep can never affect energy"],
    ["The sample size is too small to trust much", "Five stars is mathematically impossible", "Averages never describe ratings"],
    ["A comparison group helps separate the machine effect from other changes", "Scientists dislike useful machines", "Output numbers are always fake"],
    ["One location may not represent the whole city", "Sensors cannot measure air", "Busy roads always represent parks"]
  ],
  "06": [
    ["They can fix security holes and software problems", "They only change the wallpaper", "They make hackers more comfortable"],
    ["One stolen password can unlock many accounts", "Passwords become heavier when reused", "Websites refuse all repeated letters"],
    ["Only one column was sorted instead of the whole table", "The spreadsheet became sentient", "Alphabetical order destroys all data"],
    ["A condition-based instruction", "A random painting technique", "A broken database"],
    ["Bad data structure can break the system’s logic", "Databases are only decoration", "Duplicate IDs make delivery faster"],
    ["Automation can scale both good rules and bad rules", "Automation removes the need for human judgment forever", "Old processes become perfect once digitized"]
  ],
  "07": [
    ["Shape and direction affect strength", "Cardboard secretly turns into steel", "Heavy books become lighter when vertical"],
    ["Triangles help keep structures stable under force", "Triangles are legally required on bridges", "Rectangles cannot be drawn by engineers"],
    ["Hardness and toughness are not the same thing", "Soft materials always fail", "Scratches are more dangerous than drops"],
    ["Specialized steps can reduce switching and improve flow", "More workers automatically fix all problems", "Dividing work makes quality irrelevant"],
    ["Design must consider heat, light, and real operating conditions", "Beautiful buildings cannot follow physics", "Glass always makes buildings cooler"],
    ["The design optimized one feature while ignoring system trade-offs", "Strong materials are never useful", "Repairability has no business value"]
  ],
  "08": [
    ["Too much leaf growth can come at the cost of fruit", "Nitrogen makes plants forget summer", "Tomatoes grow only in tiny pots"],
    ["Wet soil can be compacted and damage roots later", "Tractors dissolve in wet weather", "Rain makes seeds allergic to sunlight"],
    ["Crop rotation can interrupt pests and support soil balance", "Plants become bored by familiar fields", "Different crops cancel the seasons"],
    ["Shared resources can be overused when everyone acts alone", "Fish dislike teamwork meetings", "More boats always create more fish"],
    ["Heat stress can reduce animal productivity and welfare", "Cows stop needing water in summer", "Milk production depends only on feed quantity"],
    ["Thinning can reduce competition and improve forest health", "Forests grow best when every tree is crowded", "Small trees are never useful to ecosystems"]
  ],
  "09": [
    ["Brush gently and regularly with proper technique", "Brush harder until the gums become stronger", "Skip brushing when gums bleed"],
    ["Caffeine may reduce sleep quality even if you fall asleep", "Coffee becomes water after midnight", "Feeling tired proves sleep was perfect"],
    ["Build up gradually and allow recovery", "Start with the hardest routine possible", "Ignore pain because motivation fixes injuries"],
    ["Individual choices can create group-level health effects", "Illness only matters when symptoms are dramatic", "Offices protect people from viruses automatically"],
    ["Stopping early can leave bacteria behind and contribute to resistance", "Feeling better means every bacterium is gone", "Antibiotics work better when taken randomly"],
    ["Health is shaped by social and practical conditions", "Medical care depends only on willpower", "Appointments are unrelated to transport"]
  ],
  "10": [
    ["Service experience is shaped by small moments of care", "Only the room size matters in hospitality", "Guests never remember how they are treated"],
    ["A clean floor can still be a safety risk when wet", "Signs are only for decoration", "Wet floors become safer when ignored"],
    ["Coordination and timing are part of service quality", "Good taste cancels every service issue", "Customers prefer chaos when food is expensive"],
    ["Give clear preparation instructions before the bottleneck", "Make the trays smaller", "Hide the rules until the last second"],
    ["The service added priority access without managing total capacity", "Fast-track passes create unlimited ride capacity", "Lines disappear when prices increase"],
    ["The metric rewards speed while ignoring service quality and safety", "Customers dislike receiving parcels quickly", "Drivers cannot follow any measurement system"]
  ]
};

function shuffleOptions(options, code, index) {
  if (index % 3 === 0) return options;
  if (index % 3 === 1) return [options[1], options[0], options[2]];
  return [options[2], options[1], options[0]];
}

function makeQuestion(code, prompt, difficulty, unlocksToward, index) {
  const optionSet = questionOptions[code][index];
  const answer = optionSet[0];
  return {
    id: code + "-q" + (index + 1),
    difficulty,
    unlocksToward,
    prompt,
    options: shuffleOptions(optionSet, code, index),
    answer,
    explanation: answer + ". This answer turns the everyday scene into a practical knowledge pattern. MapKAI uses these examples to make broad subjects feel less abstract: first notice the real-life situation, then identify the hidden rule, trade-off, or habit behind it. When you can explain the pattern in your own words, that part of the ocean becomes land."
  };
}

const questionBank = Object.fromEntries(Object.entries(subjectQuestionSeeds).map(([code, seed]) => {
  const difficulties = ["easy", "easy", "medium", "medium", "hard", "hard"];
  const unlocks = ["snow", "snow", "land", "land", "green", "green"];
  return [code, {
    subject: seed.subject,
    status: "draft",
    unlockRule: { snow: 2, land: 4, green: 6 },
    theme: seed.theme,
    questions: seed.prompts.map((prompt, index) => makeQuestion(code, prompt, difficulties[index], unlocks[index], index))
  }];
}));

const challengeSubjects = categories.map((category) => category.code);
const challengeState = Object.fromEntries(challengeSubjects.map((code) => [code, {
  correct: 0,
  answered: [],
}]));
const masteryProgress = Object.fromEntries(challengeSubjects.map((code) => [code, "ocean"]));
let activeChallengeSubject = challengeSubjects[0];
let currentAnsweredQuestion = null;
activeChallengeSubject = getNextAvailableChallengeSubject() || activeChallengeSubject;

const reviewLog = {
  updatedModule: "Module Architecture MVP",
  whatChanged: "Home, Map, Categories, Learning, and contact sections were shaped as separate modules.",
  whyChanged: "To support one module update, one clear commit, and lower long-term maintenance cost.",
  whatToTest: "Can a visitor move from Home to Map, Categories, or Learning without confusion?",
  nextModule: "Choose one category module when a specific learning path is ready.",
};

function contactSectionTemplate() {
  return `
    <section class="contact-section" aria-labelledby="contact-title">
      <div>
        <p class="eyebrow">Contact</p>
        <h2 id="contact-title">Need help or want to leave a message?</h2>
        <p>If you need to contact MapKAI, please leave a message here.</p>
        <div class="contact-methods">
          <a href="mailto:${contactEmail}">${contactEmail}</a>
        </div>
      </div>
      <form class="contact-form" data-contact-form>
        <label>
          <span>Your email</span>
          <input name="email" type="text" inputmode="email" placeholder="you@example.com" required />
        </label>
        <label>
          <span>Message</span>
          <textarea name="message" rows="4" placeholder="Tell us what you want to ask, suggest, or build with MapKAI." required></textarea>
        </label>
        <button class="button primary" type="submit">Prepare message</button>
        <p class="contact-status" aria-live="polite"></p>
      </form>
    </section>`;
}

function renderContactSections() {
  pages.forEach((page) => {
    if (page.querySelector(".contact-section")) return;
    page.insertAdjacentHTML("beforeend", contactSectionTemplate());
  });
}

function siteFooterTemplate() {
  return `
    <footer class="site-footer" aria-label="Copyright">
      <p>© 2026 MapKAI. All rights reserved.</p>
      <p>Unauthorized copying, reproduction, redistribution, adaptation, or commercial use of MapKAI content, structure, design, or visual materials is not permitted without prior written permission.</p>
    </footer>`;
}

function renderSiteFooters() {
  pages.forEach((page) => {
    if (page.querySelector(".site-footer")) return;
    page.insertAdjacentHTML("beforeend", siteFooterTemplate());
  });
}

function handleContactSubmit(event) {
  const form = event.target.closest("[data-contact-form]");
  if (!form) return;
  event.preventDefault();

  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const subject = encodeURIComponent("MapKAI message");
  const body = encodeURIComponent(`From: ${email}\n\n${message}`);
  const status = form.querySelector(".contact-status");
  status.innerHTML = `Thanks. Your message is ready. <a href="mailto:${contactEmail}?subject=${subject}&body=${body}">Send it by email</a>.`;
  form.reset();
}

function normalizeRoute(path) {
  if (window.location.protocol === "file:") {
    return window.location.hash.replace("#", "") || "/";
  }
  return path || "/";
}

function goToRoute(route, replace = false) {
  const target = route || "/";
  const categoryMatch = target.match(/^\/categories\/(\d{2})$/);
  if (categoryMatch) renderCategoryDetail(categoryMatch[1]);
  const activePage = categoryMatch ? "/categories/detail" : target;

  pages.forEach((page) => {
    const active = page.dataset.page === activePage;
    page.classList.toggle("is-active", active);
    page.setAttribute("aria-hidden", String(!active));
  });
  routeLinks.forEach((link) => {
    const linkRoute = link.dataset.route;
    const isCurrent =
      linkRoute === target ||
      (linkRoute === "/categories" && target.startsWith("/categories")) ||
      (linkRoute === "/learning" && target.startsWith("/learning"));
    link.classList.toggle("is-current", isCurrent);
  });

  if (replace) return;
  if (window.location.protocol === "file:") {
    window.location.hash = target;
  } else {
    history.pushState({ route: target }, "", target);
  }
}

function makeStatus(status, ready) {
  return `<div class="status-line"><span>${status}</span><strong>${ready}</strong></div>`;
}

function getCategory(code) {
  return categories.find((category) => category.code === code);
}

function getSubjectTitle(code) {
  return questionBank[code]?.subject || getCategory(code)?.title || "Knowledge subject";
}

function renderCategories() {
  const grid = document.getElementById("categoryGrid");
  const detailCards = categories
    .map((category) => {
      const href = `/categories/${category.code}`;
      const fieldCount = category.groups.reduce((total, group) => total + group.fields.length, 0);
      const scopePreview = category.groups
        .flatMap((group) => group.fields)
        .slice(0, 5)
        .map(([code, title]) => `<li><span class="internal-code">${code}</span>${title}</li>`)
        .join("");
      return `
        <a class="category-card" href="${href}" data-route="${href}" aria-label="Open ${category.title}">
          <span class="internal-code category-code">${category.code}</span>
          <h3>${category.title}</h3>
          ${makeStatus(category.status, category.readiness)}
          <div class="scope-count">${category.groups.length} groups · ${fieldCount} detailed fields</div>
          <ul class="scope-preview">${scopePreview}</ul>
          <span class="card-link">Open category</span>
        </a>`;
    })
    .join("");
  if (grid) grid.innerHTML = detailCards;
}

function getMasteryFromCorrect(subjectCode) {
  const subject = questionBank[subjectCode];
  const state = challengeState[subjectCode];
  const correct = state?.correct || 0;
  const rule = subject?.unlockRule || { snow: 2, land: 4, green: 6 };
  if (correct >= rule.green) return "green";
  if (correct >= rule.land) return "land";
  if (correct >= rule.snow) return "snow";
  return "ocean";
}

function getCurrentQuestion(subjectCode) {
  const subject = questionBank[subjectCode];
  const state = challengeState[subjectCode];
  if (!subject || !state) return null;
  return subject.questions.find((question) => !state.answered.includes(question.id)) || null;
}

function isSubjectComplete(subjectCode) {
  return Boolean(questionBank[subjectCode]) && !getCurrentQuestion(subjectCode);
}

function getNextAvailableChallengeSubject() {
  return challengeSubjects.find((code) => questionBank[code] && !isSubjectComplete(code)) || null;
}

function getTotalCorrectAnswers() {
  return Object.values(challengeState).reduce((total, state) => total + state.correct, 0);
}

function syncMasteryProgress(subjectCode) {
  if (subjectCode) {
    masteryProgress[subjectCode] = getMasteryFromCorrect(subjectCode);
    return;
  }
  challengeSubjects.forEach((code) => {
    masteryProgress[code] = getMasteryFromCorrect(code);
  });
}

function renderChallenge() {
  const cardTarget = document.getElementById("challengeCard");
  if (!cardTarget) return;

  if (!getCurrentQuestion(activeChallengeSubject)) {
    activeChallengeSubject = getNextAvailableChallengeSubject() || activeChallengeSubject;
    currentAnsweredQuestion = null;
  }

  const subject = questionBank[activeChallengeSubject];
  const state = challengeState[activeChallengeSubject];
  const pendingAnsweredQuestion = currentAnsweredQuestion?.subjectCode === activeChallengeSubject ? currentAnsweredQuestion.question : null;
  const question = pendingAnsweredQuestion || getCurrentQuestion(activeChallengeSubject);
  const progress = masteryLevels[getMasteryFromCorrect(activeChallengeSubject)];
  const subjectTitle = getSubjectTitle(activeChallengeSubject);

  if (!subject || !state || !question) {
    cardTarget.innerHTML = `
      <p class="eyebrow">Challenge complete</p>
      <h2>The current map is fully lit.</h2>
      <p>You answered the available questions. Future updates can add more questions inside each subject database without changing this quiz flow.</p>
      <div class="challenge-status is-green">Total correct answers: ${getTotalCorrectAnswers()}</div>`;
    return;
  }

  const isAnswered = currentAnsweredQuestion?.question.id === question.id;
  const feedback = isAnswered ? `
    <p class="challenge-feedback ${currentAnsweredQuestion.correct ? "is-correct" : "is-wrong"}">
      ${currentAnsweredQuestion.correct ? "Correct." : "Not yet."} ${currentAnsweredQuestion.correct ? "This answer helps light up the map." : "This question is still counted, and the explanation shows the better pattern."}
    </p>
    <article class="answer-explanation">
      <h3>Why this matters</h3>
      <p>${question.explanation}</p>
    </article>
    <button class="button primary next-question-button" type="button" data-next-question>Next question</button>` : "";

  cardTarget.innerHTML = `
    <p class="eyebrow">${question.difficulty} question -> ${masteryLevels[question.unlocksToward].label}</p>
    <h2>Knowledge challenge</h2>
    <p>${question.prompt}</p>
    <div class="answer-grid">
      ${question.options.map((option) => {
        const selected = isAnswered && option === currentAnsweredQuestion.selected;
        const correct = isAnswered && option === question.answer;
        const stateClass = correct ? " is-correct" : selected ? " is-wrong" : "";
        return `<button type="button" data-answer="${option}" class="${stateClass.trim()}" ${isAnswered ? "disabled" : ""}>${option}</button>`;
      }).join("")}
    </div>
    <div class="challenge-status">Correct answers in this hidden subject: ${state.correct} / ${subject.questions.length} · Current map state: ${progress.label}</div>
    <div class="founder-note internal-code">Source: ${activeChallengeSubject} · ${subjectTitle}</div>
    ${feedback}`;
}

function handleChallengeClick(event) {
  const nextButton = event.target.closest("[data-next-question]");
  if (nextButton) {
    currentAnsweredQuestion = null;
    if (!getCurrentQuestion(activeChallengeSubject)) {
      activeChallengeSubject = getNextAvailableChallengeSubject() || activeChallengeSubject;
    }
    renderChallenge();
    drawKnowledgeMap();
    return;
  }

  const answerButton = event.target.closest("[data-answer]");
  if (!answerButton || currentAnsweredQuestion) return;
  const question = getCurrentQuestion(activeChallengeSubject);
  const state = challengeState[activeChallengeSubject];
  if (!question || !state) return;

  const selected = answerButton.dataset.answer;
  const correct = selected === question.answer;
  state.answered.push(question.id);
  if (correct) state.correct += 1;
  syncMasteryProgress(activeChallengeSubject);
  currentAnsweredQuestion = { subjectCode: activeChallengeSubject, question, selected, correct };
  drawKnowledgeMap();
  renderChallenge();
}

function renderPassport(targetId, passport) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = `
    <div>
      <p class="eyebrow">Overview</p>
      <h2>${passport.name}</h2>
      <dl>
        <dt>Route</dt><dd>${passport.route}</dd>
        <dt>Purpose</dt><dd>${passport.purpose}</dd>
        <dt>User value</dt><dd>${passport.userValue}</dd>
        <dt>Status</dt><dd>${passport.status}</dd>
        <dt>Related modules</dt><dd>${passport.relatedModules}</dd>
        <dt>Next action</dt><dd>${passport.nextAction}</dd>
      </dl>
    </div>`;
}

function renderCategoryDetail(code) {
  const category = categories.find((item) => item.code === code) || categories[0];
  const eyebrow = document.getElementById("categoryDetailEyebrow");
  const title = document.getElementById("categoryDetailTitle");
  const copy = document.getElementById("categoryDetailCopy");
  const fieldCount = category.groups.reduce((total, group) => total + group.fields.length, 0);
  if (eyebrow) eyebrow.textContent = `${category.code} category scope`;
  if (title) title.textContent = category.title;
  if (copy) {
    copy.textContent = `This page shows all ${category.groups.length} groups and ${fieldCount} detailed fields in this category.`;
  }

  renderPassport("categoryPassport", {
    name: `${category.code} ${category.title}`,
    route: `/categories/${category.code}`,
    purpose: "Show the official scope for this knowledge category.",
    userValue: "Understand what belongs inside this category before choosing a field.",
    founderValue: "Keeps category updates isolated to one module.",
    status: category.status,
    relatedModules: "Map, Categories, Learning",
    nextAction: "Decide whether this category should receive the next detailed field or learning path.",
    doNotTouch: "Do not change unrelated categories during this module update.",
  });

  renderCategoryTree(category);
}

function renderCategoryTree(category) {
  const target = document.getElementById("categoryTree");
  if (!target) return;
  target.innerHTML = category.groups
    .map((group) => `
      <section class="tree-group">
        <h2><span class="internal-code">${group.code}</span>${group.title}</h2>
        <div class="field-list">
          ${group.fields.map(([code, title]) => {
            const href = `/categories/${category.code}`;
            return `<a class="field-chip" href="${href}" data-route="${href}"><strong class="internal-code">${code}</strong>${title}</a>`;
          }).join("")}
        </div>
      </section>`)
    .join("");
}

function renderField() {
  const userLayer = document.getElementById("fieldUserLayer");
  const founderLayer = document.getElementById("fieldFounderLayer");
  if (userLayer) {
    userLayer.innerHTML = `
      <div class="field-title-row">
        <span class="code">${field0412.code}</span>
        ${makeStatus(field0412.status, field0412.readiness)}
      </div>
      ${field0412.userLayer.map(([title, text]) => `<article class="content-block"><h2>${title}</h2><p>${text}</p></article>`).join("")}`;
  }
  if (founderLayer) {
    founderLayer.innerHTML = `
      <p class="eyebrow">Founder layer</p>
      <h2>Maintenance notes</h2>
      ${Object.entries(field0412.founderLayer).map(([key, value]) => `<div class="note-row"><strong>${key.replace(/([A-Z])/g, " $1")}</strong><p>${value}</p></div>`).join("")}
      <div class="review-log">
        <h3>Review log</h3>
        ${Object.entries(reviewLog).map(([key, value]) => `<p><strong>${key.replace(/([A-Z])/g, " $1")}:</strong> ${value}</p>`).join("")}
      </div>`;
  }
}

function renderLearning() {
  const pathGrid = document.getElementById("pathTypeGrid");
  const timeline = document.getElementById("foundationTimeline");
  if (pathGrid) {
    pathGrid.innerHTML = pathTypes.map(([title, text]) => `<article class="module-card"><h3>${title}</h3><p>${text}</p></article>`).join("");
  }
  if (timeline) {
    timeline.innerHTML = foundationPath
      .map(([code, title, reason], index) => `
        <li>
          <span>${index + 1}</span>
          <div>
            <h2>${title}</h2>
            <p>${reason}</p>
          </div>
        </li>`)
      .join("");
  }
}

function drawKnowledgeMap() {
  if (!ctx || !canvas) return;
  syncMasteryProgress();
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  const ocean = ctx.createLinearGradient(0, 0, width, height);
  ocean.addColorStop(0, "#78c7e8");
  ocean.addColorStop(0.55, "#2f86b5");
  ocean.addColorStop(1, "#1c567a");
  ctx.fillStyle = ocean;
  roundRect(ctx, 0, 0, width, height, 34);
  ctx.fill();

  const founderMode = document.body.classList.contains("founder-mode");
  const islandSlots = [
    [165, 145, 108, 68], [355, 130, 116, 74], [545, 160, 110, 70], [730, 135, 112, 72],
    [230, 315, 126, 82], [445, 300, 118, 76], [660, 325, 126, 78],
    [150, 505, 112, 70], [355, 485, 126, 78], [575, 510, 114, 72], [770, 485, 112, 70],
  ];

  categories.forEach((category, index) => {
    const [x, y, w, h] = islandSlots[index];
    const level = masteryProgress[category.code] || "ocean";
    const color = masteryLevels[level].color;
    const isActive = category.code === activeChallengeSubject;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((index % 2 === 0 ? -1 : 1) * 0.06);
    ctx.fillStyle = isActive ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.32)";
    ellipseBlob(w + 34, h + 24);
    ctx.fill();
    ctx.fillStyle = color;
    ellipseBlob(w, h);
    ctx.fill();
    ctx.fillStyle = level === "snow" ? "#ffffff" : "#fff6dd";
    ctx.beginPath();
    ctx.arc(-w * 0.2, -h * 0.18, Math.min(w, h) * 0.18, 0, Math.PI * 2);
    ctx.fill();
    if (level === "green") {
      ctx.fillStyle = "rgba(255,255,255,0.42)";
      ctx.beginPath();
      ctx.arc(w * 0.18, h * 0.05, Math.min(w, h) * 0.14, 0, Math.PI * 2);
      ctx.fill();
    }
    if (founderMode) {
      ctx.fillStyle = "#173026";
      ctx.font = "800 22px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(category.code, 0, 7);
    }
    ctx.restore();
  });

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  for (let i = 0; i < 70; i += 1) {
    const x = (i * 137) % width;
    const y = (i * 73) % height;
    ctx.beginPath();
    ctx.arc(x, y, (i % 3) + 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function ellipseBlob(w, h) {
  ctx.beginPath();
  ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-answer], [data-next-question]")) {
    handleChallengeClick(event);
    return;
  }
  const link = event.target.closest("[data-route]");
  if (!link) return;
  event.preventDefault();
  goToRoute(link.dataset.route);
});
document.addEventListener("submit", handleContactSubmit);
if (founderToggle) {
  founderToggle.addEventListener("click", () => {
    const enabled = !document.body.classList.contains("founder-mode");
    setFounderMode(enabled);
  });
}

window.addEventListener("popstate", () => goToRoute(normalizeRoute(window.location.pathname), true));
window.addEventListener("hashchange", () => goToRoute(normalizeRoute(window.location.pathname), true));

renderCategories();
renderContactSections();
renderSiteFooters();
renderPassport("pathPassport", modulePassports.path);
renderField();
renderLearning();
renderChallenge();
drawKnowledgeMap();
goToRoute(normalizeRoute(window.location.pathname), true);
setFounderMode(localStorage.getItem("mapkaiFounderMode") === "true");

function setFounderMode(enabled) {
  document.body.classList.toggle("founder-mode", enabled);
  if (founderToggle) {
    founderToggle.textContent = enabled ? "Founder mode on" : "Founder mode";
    founderToggle.setAttribute("aria-pressed", String(enabled));
  }
  localStorage.setItem("mapkaiFounderMode", String(enabled));
  drawKnowledgeMap();
  renderChallenge();
}
