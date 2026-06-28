import { readFileSync, writeFileSync } from "node:fs";

const englishFieldsPath = "docs/gpt-story-generation/results/batch-003-017.en-fields.json";
const englishScenesPath = "docs/gpt-story-generation/results/batch-003-017.en-scenes.json";
const targetPaths = ["script.js", "public/script.js"];

const generatedEnglishItems = JSON.parse(readFileSync(englishFieldsPath, "utf8"));
const generatedEnglishScenes = JSON.parse(readFileSync(englishScenesPath, "utf8"));

function fromGeneratedItem(item) {
  return {
    title: item.titleEn,
    summary: item.summaryEn,
    scene: generatedEnglishScenes[item.id] || "",
    storyBody: item.storyBodyEn,
    knowledgePoint: item.knowledgePointEn,
    reflectionQuestion: item.reflectionQuestionEn,
  };
}

const manualEnglishOverrides = {
  "000-general-starter-course": {
    title: "A Night With a List of Questions",
    summary: "A night discussion in the Junto turned experience from the print shop, the street, and books into a method people could practice together.",
    scene: "In Philadelphia in 1727, a young printer finished the day's work and brought a list of questions into a night meeting of the Junto.",
    storyBody: `During the day, most problems in the print shop had clear shapes: had the type been set correctly, was there enough paper, had the accounts been collected? At night, the problems became more scattered. Several people left their counters, workshops, and businesses and brought the troubles of the week to one table: how to prevent fires, where books could be borrowed, how to keep currency shortages from crushing small shops, and how young apprentices could continue reading.

These matters could originally have remained inside familiar relationships. Masters taught apprentices; friends introduced friends; experience moved slowly through trust and access. But each week, the trouble returned in a slightly different form. One person's method could handle one matter, yet it was hard for that method to become something others could also take up.

The key to the Junto was not the meeting itself, but the list of questions. Once questions were written down, they were no longer only complaints. Someone went back to check books, someone compared practices on the street, and someone brought back accounts, observations, or material they had read. At the next meeting, the same question might be opened again, or broken into smaller actions.

Learning therefore left the head of a single clever person. It became a repeatable practice: bring experience forward so others can add to it; write daily troubles clearly enough to be checked; place personal difficulties inside public affairs and ask whether they require a library, fire prevention, education, or city improvement.

The young printer was Benjamin Franklin. The Junto is often seen as one important early entrance into American public learning, associational education, and civic improvement. General learning here was not the name of a course, but an ability to handle recurring problems: when life keeps raising similar questions, people need to ask together, verify together, and revise answers together.`,
    knowledgePoint: "General learning focuses on organizing personal experience, public problems, and cross-field methods into sustainable learning capacity. It emphasizes questioning, discussion, verification, cooperation, and turning experience into public method.",
    reflectionQuestion: "When a problem appears again and again in different people's lives, is it still only personal experience?",
  },
  "001-birkbeck-evening-lecture": {
    title: "The Mechanics Class After Work",
    summary: "Workers brought the tools they had touched during the day into evening class, and practical experience first came close to formal scientific language.",
    scene: "Around 1799 in Glasgow, a teacher noticed that the people who truly used tools during the day were often kept outside the room where science was explained.",
    storyBody: `In the daytime factory, machines did not speak in academic terms. They jammed, heated, wore down, and shifted. Workers heard changes in sound, felt the resistance of materials with their hands, and knew from experience where trouble might appear. Knowledge was already in their movements; it simply had not yet been formally recognized.

George Birkbeck saw the contradiction there. The people who touched machinery and materials every day often had no chance to enter the room where mechanics, heat, chemistry, and natural philosophy were explained. Scientific language seemed to be on another floor, while the people downstairs were handling scientific problems with their bodies.

So the class was scheduled after work. Workers arrived at the lecture after a tiring day, but also with tool experience still fresh in their hands. Instruments and demonstrations pulled abstract terms back into a familiar scene: why force passed this way, why heat changed that way, why a machine could not be explained by feel alone.

The important part of the class was not that it immediately turned workers into scholars. It first opened a door: you already have experience, so you can keep learning; you do not need complete credentials before you deserve to understand knowledge. Formal learning no longer only stood at the door screening people; it also began to build a first step for existing experience.

Later, mechanics' institutes, evening courses, libraries, and experimental apparatus continued to expand this entrance. Basic programmes and qualifications here were not a cold certificate, but a passage that let real experience enter a world of knowledge that could be explained, practiced, and developed further.`,
    knowledgePoint: "Basic programmes and qualifications build a first recognized bridge between practical readiness and formal learning. They help learners turn existing experience into capacity that can continue, be recognized, and develop.",
    reflectionQuestion: "Who around you already has real experience, but still needs the first step into formal knowledge?",
  },
  "002-braille-raised-dots": {
    title: "Six Raised Dots Beneath the Fingertip",
    summary: "A boy repeatedly tested a cell the fingertip could read, turning reading and writing from something assisted into something independent.",
    scene: "Between Coupvray and Paris in the 1810s, a blind boy touched heavy embossed books and discovered that reading and writing were still controlled by others.",
    storyBody: `There were books at the school for blind students, but they were very thick. Raised letters could be touched by the fingers, yet they moved slowly, each page like a heavy board. Reading happened, but it did not yet feel as if it truly belonged to the student. Worse, students could rarely write their own words back easily.

Later, a form of night writing reached the school. It had originally been designed for soldiers to pass messages in the dark by pressing dots into paper, letting fingers read symbols instead of eyes. The idea mattered: writing did not have to be seen. It could also be touched.

Louis Braille tried the method, but met a concrete obstacle: the dots were too large for one fingertip to read a whole unit easily at once. If reading always had to stop and assemble fragments, it could not become fluent action. So he kept shrinking, arranging, and testing until six raised dots formed one small cell.

That small cell looked simple, yet it could express letters, punctuation, and numbers, and later music as well. It let the fingertip receive one symbol at a time, turning reading from slow recognition into continuous movement. More importantly, it made writing possible too.

The six raised dots changed more than reading and writing technology. A person could read quietly, write privately, and return to a line again and again without always waiting for another person's voice to carry them into knowledge. The Braille literacy system later became a major foundation for literacy among blind and visually impaired people around the world, and its starting point was a very specific question: can one fingertip independently read one small cell?`,
    knowledgePoint: "Literacy and numeracy are not only school basics; they let people independently enter information, symbols, quantity, memory, and social participation. Accessible writing systems can change the relationship between learners and knowledge.",
    reflectionQuestion: "When a tool lets someone read without asking another person, what kind of freedom has quietly appeared?",
  },
  "003-carnegie-speaking-class": {
    title: "Standing Up to Say the First Sentence",
    summary: "An evening public-speaking course placed personal development between nervousness, practice, listening, and the next attempt.",
    scene: "In early twentieth-century New York, a young man from a rural background discovered that many adults were not defeated by lack of knowledge, but by the moment when they had to speak.",
    storyBody: `Many adults did not lack substance. They knew their work, had met customers, handled trouble, and carried plenty of experience. But once they stood before others, the body spoke a different sentence first: the throat tightened, the hands had nowhere to go, and the opening they had prepared suddenly disappeared.

Dale Carnegie had worked in sales, tried acting, and taught classes. In his New York evening courses, he saw clerks, salespeople, engineers, and managers come after work. During the day, they could do things. At night, they practiced something harder: saying what they knew to other people.

The course did not begin with grand theory. One person stood up and told a small real story. Others listened, then the next person spoke. Some practiced remembering names, some practiced giving specific praise, and some learned to move attention away from their own nervousness and toward the audience. Each action was small, but small enough to repeat.

Fear was not chased away by one sentence of encouragement. It was broken into actions that could be practiced: open your mouth, pause, look at people, listen, respond, come back next week. Personal skills here were less like personality labels and more like a set of actions that could be trained slowly in social situations.

Carnegie's later courses in public speaking and human relations, together with How to Win Friends and Influence People, influenced modern personal development training. Personal development at this entrance was not about becoming another person. It was about letting experience that could not be spoken find a form that others could receive through repeated public practice.`,
    knowledgePoint: "Personal skills and development focus on self-management, communication, confidence, listening, adaptation, and abilities people can practice in social settings. They emphasize that ability is not gained only by understanding; it also needs repeated practice in concrete situations.",
    reflectionQuestion: "Which ability in your life would change fastest if it were practiced gently in public every week?",
  },
  "009-brownsea-scout-camp": {
    title: "The Island Without a School Bell",
    summary: "The Brownsea Island experimental camp let outdoor tasks, peer responsibility, and civic learning happen in the same day.",
    scene: "In August 1907, boys from different social backgrounds came to Brownsea Island to camp, cook, observe, signal, play games, and learn through patrols.",
    storyBody: `There was no ordinary classroom bell on the island. Learning was not divided into separate lessons; it unfolded with the tasks of the day. Tents had to be put up, meals had to be made, routes had to be observed, signals had to be sent, and someone in each patrol always needed help from someone else.

Robert Baden-Powell had been a soldier, but this camp was not only military training. He wanted to test something else: could ordinary young people learn courage, service, outdoor judgment, teamwork, and civic responsibility through practice, instead of only hearing adults explain those words?

The patrol method made it hard for anyone to hide completely at the side. If one person forgot a task, the patrol felt the effect. If one person cared only for himself, others saw it. Knots, tracking, first aid, and outdoor skills looked like concrete techniques, but they continually pushed people back toward discipline, trust, observation, and responsibility.

This educational form also needs to be viewed with historical awareness. Some early contexts require careful criticism today. Yet the learning shape left by the Brownsea Island experimental camp remains clear: some abilities are hard to name separately in an ordinary timetable, but they form through shared living, task pressure, and peer feedback.

The experiment helped launch the Scout movement and opened many general youth programmes that do not fit ordinary school categories. Generic programmes and qualifications not elsewhere classified are not a messy leftover here; they leave room for learning that combines skills, character, community, and self-reliance.`,
    knowledgePoint: "Generic programmes not elsewhere classified preserve hybrid forms of learning, bringing practical skills, character, access capacity, and social participation together. They focus on life abilities and public abilities that no single discipline can fully contain.",
    reflectionQuestion: "When every lesson must belong to a neat subject, which important life ability becomes harder to learn?",
  },
  "011-dewey-lab-school": {
    title: "When the Dough Was Too Sticky",
    summary: "When flour, cloth, and wooden blocks entered the classroom, knowledge began to be needed by real activity.",
    scene: "In Chicago in 1896, the tables at the Lab School held flour, measuring cups, cloth, wooden blocks, and materials the children were working with.",
    storyBody: `The flour on the table did not first become a definition. Children measured water, poured flour, kneaded dough, and then found that the dough could be too dry, too sticky, or slow to take shape. At that moment, ratio was no longer a number on the blackboard. It was a demand made by the material in their hands.

Cloth was not only for finishing a craft object. It led children toward cotton, spinning, dyeing, and the path by which clothing appears from materials, labour, and tools. Wooden blocks brought a different problem. They tilted, loosened, or failed to support anything because the length was wrong. Measurement, structure, and cooperation therefore entered the same table.

In a more traditional classroom, the teacher could explain the answer first and students could write it down afterward. That can make knowledge orderly, but it can also leave children remembering sentences without knowing what those sentences are meant to handle. The Lab School experiment reversed the order: first encounter the material, then encounter the difficulty, and only then need disciplinary knowledge to explain and revise action.

In this way, mathematics was not forced into dough, and history was not pasted onto cloth. Real activity created the problem first; disciplinary knowledge entered afterward. Ratio, production, measurement, verbal expression, and shared discussion were all called up by the same task.

The University of Chicago Laboratory School, co-founded by John Dewey, became an important experimental site in the history of progressive education. It did not raise a simple question such as whether children enjoy activities. It asked how schools arrange experience so that students form judgment through action, reflection, and shared tasks.`,
    knowledgePoint: "Education studies learning experience, curriculum design, teaching relationships, child development, and how schools organize understanding. Dewey's experience-based learning ideas emphasize that students construct understanding through action, reflection, and social interaction.",
    reflectionQuestion: "If children meet real materials first and then need knowledge, how should the classroom change?",
  },
  "018-reggio-emilia-school": {
    title: "A School Built Beside the Ruins",
    summary: "Postwar Reggio Emilia turned children's learning from a care problem into a project involving community, materials, art, and documentation.",
    scene: "After the Second World War, a group of parents near Reggio Emilia wanted first to build a school for their children, even though they did not yet have a complete school system.",
    storyBody: `After the war, a school did not first appear in an institutional document. Parents near Reggio Emilia wanted to build a school for their children. Available materials were brought over, craft skills were used, and what appeared beside the ruins was not a complete system, but a community's insistence on a future.

When Loris Malaguzzi heard about the parents' action in the village, he went to see it. What attracted him was not a mature method, but a more basic educational question: if children were to begin again after the war, could school do more than watch over them? Could it help the whole community relearn how to listen to them?

The school that slowly grew did not divide learning into neat boxes. Children drew, built, argued, listened, shaped, measured, performed, and then returned to revise their own ideas. Materials were not decoration, and environment was not background. Classroom light, walls, tools, and children's work all participated in learning.

The teacher's work was not only explanation. Teachers observed, documented, and organized the process so that children's thinking could be seen again. Parents entered the school for discussion, and the atelier became an important space for expression and inquiry. Art was not an extra activity; it was one of the languages of children's thinking.

The Reggio Emilia approach later became known for project learning, process documentation, parent and community participation, and children's many languages of expression. It gives interdisciplinary education a clear image: when children understand the world in more than one way, schools cannot respond in only one way.`,
    knowledgePoint: "Interdisciplinary programmes related to education connect different learning goals so learners use knowledge together rather than storing it separately. The Reggio Emilia approach emphasizes children's expression, project learning, environment design, process documentation, and community participation.",
    reflectionQuestion: "If a child thinks in more than one language, which disciplines need to stand nearby in order to truly hear them?",
  },
  "020-family-photo-meaning": {
    title: "Gestures on the Black Cloth Board",
    summary: "As photographs moved across black cloth boards, the visual memory behind single works became hard to ignore.",
    scene: "In Hamburg in the late 1920s, a scholar pinned photographic images onto black cloth boards, then removed, shifted, and rearranged them.",
    storyBody: `When a painting is placed alone in a book, the questions are usually stable: who made it, what year is it from, which style does it belong to, and what story does the image tell? This way of reading protects the details of the work and keeps interpretation from drifting too far.

The black cloth board changed the viewing distance. Photographs were pinned up one by one, and a single work no longer faced the viewer alone. A raised arm, a tilted body, or a mourning posture might appear again and again across ancient reliefs, Renaissance paintings, and modern images. They were not the same, but they made one realize that certain gestures travel across time.

Aby Warburg did not arrange these images into a neat chronology. He pinned photographs up, removed them, and moved them beside another group. Once the neighborhood changed, the question changed as well: was this a continuation of classical tradition, or the reuse of an old form in a new scene? Was the image preserving memory, or changing the use of memory?

The black cloth board was therefore not a background fabric, but a workbench. It forced viewers to move back and forth among images, watching how forms migrate, how emotion borrows gestures, and how cultural memory hides in repeated actions.

The Mnemosyne Atlas was never completed and did not organize meaning into a single conclusion. What it left was a humanities practice: remove works from isolated positions, place them inside relationships, time, and context, and watch how images change seeing through adjacency.`,
    knowledgePoint: "Arts and humanities study how images, texts, forms, symbols, and historical contexts generate meaning together. Warburg's image research reminds us that works can be understood not only by author and date, but also through visual memory, migrating gestures, and cultural transmission.",
    reflectionQuestion: "When two images far apart in time are placed together, are we seeing similarity, or a route of cultural memory?",
  },
  "021-bauhaus-workshop": {
    title: "Touch the Material Before Discussing Style",
    summary: "Bauhaus brought art, craft, design, and architecture back into the workshop, letting form be tested by materials and life.",
    scene: "After the First World War, a young architect in Weimar faced a divided world: fine art on one side, craft and industry on the other.",
    storyBody: `After the First World War, art education faced more than what to paint or how to paint. Fine art, craft, industry, and architecture had been placed apart, as if they belonged to different ranks. Beauty could enter the museum, while making was often treated as lower labour.

When Walter Gropius founded Bauhaus, he wanted to pull these divisions back into the workshop. Students did not enter and immediately follow a style. They first encountered materials, color, form, and tools. Paper could fold, metal could bend, fabric could stretch, type could affect reading, and stage and architecture could change how the body moved through space.

A chair, a poster, a lamp, and a building all led students back to the same question: how does form serve life? How do materials limit imagination? How does making turn an idea into something usable? If art remains only in viewing, it is hard for it to answer modern life's questions about objects, spaces, and function.

Bauhaus was not an ideal space without contradictions. It experienced political pressure, financial limits, hierarchy, and exclusions of its own. But it changed the vocabulary of modern art education: art can think through making, and design can put beauty, function, and industry at the same table.

Bauhaus was founded by Gropius in Weimar in 1919 and later deeply influenced modern design, architecture, and art education. The image it left is not a quiet room for admiring works, but a workshop that keeps testing materials, changing forms, and asking about use.`,
    knowledgePoint: "Art studies how form, material, image, sound, movement, making, and perception shape human experience. Bauhaus workshop education emphasized the connections among art, craft, design, and architecture.",
    reflectionQuestion: "Which object around you would change if its maker thought like both an artist and a craftsperson?",
  },
  "022-petrarch-mountain-letter": {
    title: "Climbing a Mountain for One Glimpse of Landscape",
    summary: "Petrarch's mountain letter brought landscape, classical reading, and self-examination into the same place.",
    scene: "On April 26, 1336, a poet and his brother climbed Mont Ventoux not because the road had to pass there, but because he wanted to see the world from above.",
    storyBody: `In the traditional account, that climb had an unusual reason. He was not going up in order to travel, trade, fight, or fulfill a religious task. He climbed Mont Ventoux because he wanted to look at the world from a high place. Landscape itself became something worth seeking.

Petrarch had loved old books for many years, copying letters and searching for ancient authors. His way of facing the past was not like arranging a pile of dead material. Ancient voices could still be heard again, as long as someone brought the questions of his own life before the text.

In the letter about Mont Ventoux, outward landscape and inward examination were intertwined. The view from the summit widened, and the heart was pulled in another direction. He opened the small book of Augustine he had carried with him and read a reminder about people pursuing the external world while forgetting to examine themselves. The landscape suddenly was not only distance; it became a mirror turned back toward the self.

Scholars can still debate whether every detail of the letter fully meets modern historical standards. But the attention it presents is clear: landscape, classical memory, Christian self-examination, friendship, ambition, and personal inward life were placed into the same piece of writing.

Petrarch is often called one of the key figures of Renaissance humanism. The humanities here are not only the study of old books. They let books, places, memory, and self-examination face one another, asking how a person understands himself between history and inner life.`,
    knowledgePoint: "Humanities research studies history, religion, philosophy, ethics, cultural memory, and inner life, understanding how people inherit and revise meaning. Petrarch's mountain letter is often discussed as an important symbolic text connecting classical reading, self-consciousness, and humanism.",
    reflectionQuestion: "Which old book, place, or memory might change you by letting you see yourself from above?",
  },
  "023-rosetta-cartouche": {
    title: "The Oval Around the King's Name",
    summary: "Champollion tracked royal names across different scripts, bringing hieroglyphs back from image toward language.",
    scene: "In nineteenth-century France, a boy who loved languages grew up amid political turbulence and was already copying scripts and searching for patterns among writing systems before he had a stable career.",
    storyBody: `The Rosetta Stone was like a doorway divided into several layers. The Greek layer could be read, and scholars knew it contained a decree. Another layer of writing could also offer clues. But hieroglyphs still looked like a row of silent images: birds, eyes, objects, and lines all had shapes, yet they did not easily become a sentence.

Jean-Francois Champollion did not treat these signs only as decoration. He repeatedly examined the royal names enclosed by oval frames. Names were a good entry point, because they appeared again in different scripts and could be compared with the royal names in Greek.

Comparison slowly changed the identity of the signs. A sign that looked like a picture began, inside royal names, to behave like a sound; other signs carried meaning. Coptic also provided an important clue, so the ancient Egyptian language no longer seemed like a completely broken island.

The breakthrough did not come from one person out of nowhere; there was competition and earlier work. But the key turn had appeared: hieroglyphs were not only sacred images. They could also record language. Stelae, tombs, prayers, names, and official records were therefore no longer only antiquities to be looked at. They began to approach readable history again.

Champollion announced his decisive decipherment of Egyptian hieroglyphs in 1822 and became one of the founders of Egyptology. Language study here has a very clear action: watch repetition, compare differences, and let silent symbols re-enter sound, meaning, and time.`,
    knowledgePoint: "Language study connects writing, sound, grammar, meaning, translation, and the historical conditions that make language readable again. Champollion's breakthrough shows that writing systems may contain both phonetic and semantic elements, and that decipherment requires comparison, context, and linguistic knowledge.",
    reflectionQuestion: "When symbols on stone stop being decoration and become a sentence, how does the world change?",
  },
  "028-black-mountain-studio": {
    title: "A College Without Neat Borders",
    summary: "Black Mountain College placed materials, dinner tables, performance, poetry, and thought inside one experimental educational site.",
    scene: "In 1933, after Bauhaus was closed in Germany, a teacher and his wife came to North Carolina with luggage, workshop teaching habits, and a refusal to separate art from life.",
    storyBody: `Black Mountain College was small, small enough that students did not only come to class; they also took part in school decisions and lived, worked, argued, cooked, and built things with teachers. Classrooms did not stay only inside classrooms. They spread across materials, meals, performance, labour, and everyday relationships.

Josef Albers brought a form of training from the Bauhaus workshop tradition. His materials and form course did not begin with famous works, but with paper, color, glass, leaves, wire, pressure, balance, and the discipline of seeing. Students did not hurry to explain works. They learned first to watch how materials responded to hand, light, and weight.

The college later attracted dancers, poets, composers, painters, textile artists, architects, and thinkers. Different practices were not placed in a row of course names; they collided through shared living and shared making. One work might involve sound, body, space, words, and material at the same time.

Interdisciplinarity here was not adding a few more courses. It was an arrangement of living and learning. Making, reading, perception, and shared labour were placed together, so the borders naturally became unstable. If arts and humanities are arranged only by category, much of the learning that happens in the gaps will be missed.

Black Mountain College is known for experimental, interdisciplinary arts and liberal education. What it left is not a neat model, but a question: if tools, books, bodies, dinner tables, and arguments can all become classrooms, how will learners understand art, the humanities, and themselves differently?`,
    knowledgePoint: "Interdisciplinary arts and humanities programmes place making, interpretation, history, language, performance, and lived experience inside the same field of inquiry. They emphasize that artistic and humanistic knowledge often forms at the crossings of material, body, text, and shared life.",
    reflectionQuestion: "If a classroom also included tools, books, a dinner table, argument, and performance, how would you learn differently?",
  },
  "030-neighbor-notice-board": {
    title: "After Poverty Was Painted in Color",
    summary: "Hull-House's neighborhood maps turned stories of need into urban evidence that could be discussed.",
    scene: "In Chicago in the 1890s, the streets, factories, and tenements near Hull-House were marked square by square on maps.",
    storyBody: `Near Hull-House, poverty was not a distant statistical term. Children ran down crowded stairways, workers moved in and out by shifts, and immigrant families cooked, mended, and took casual work in cramped rooms. Every family had its own story, but after hearing many stories, one could also end up seeing only immediate requests for help.

Charity could bring food, clothing, and short-term aid, but it struggled to answer another question: why did low wages, illness, language barriers, and high rents keep appearing again and again in neighboring streets? If many families were surrounded by similar pressures, the problem was not only one family's character or luck.

Jane Addams and her Hull-House colleagues began to do another kind of work. They visited homes, recorded occupation, income, nationality, and living conditions, and then painted those data onto neighborhood maps. Once the colors spread, poverty was no longer a series of scattered pleas for help. It was pressed onto one map together with factory locations, housing density, migration paths, schools, and public health.

The map changed the direction of the question. It pushed "who needs help" toward "what conditions place many people in difficulty at the same time." The colors were not meant to judge people, but to make urban structures visible, comparable, and debatable.

Hull-House Maps and Papers became an important early case of social investigation and public reform. The power of social science here was not turning human suffering into cold data. It was giving sympathy evidence to stand on, so public problems no longer had to be handled only through moral judgment.`,
    knowledgePoint: "Social science studies how populations, institutions, cities, relationships, and public problems can be understood and improved through evidence. Social investigation turns individual experience into comparable public material, making social problems discussable, explainable, and reformable.",
    reflectionQuestion: "When poverty appears across a map in clusters, does responsibility still belong only to one family?",
  },
  "040-kitchen-repair-budget": {
    title: "After the Ledger Left the Counter",
    summary: "When ledgers began to involve railroads, contracts, and public responsibility, business education entered the university.",
    scene: "In Philadelphia in 1881, a university began placing factory accounts, contracts, finance, and public policy inside business education.",
    storyBody: `In small shops and workshops, business experience often hid behind the counter. Masters taught apprentices how to keep accounts, how to read people, when to bargain hard, and when to honor trust. Much judgment did not come from books, but from repeated transactions, debts, and promises.

This kind of experience was powerful in familiar markets. But when railroads, steel, insurance, banking, and interstate trade stretched transactions longer, a ledger no longer recorded only the income and spending of one shop. It connected to loans, inventory, wages, freight rates, tariffs, contractual responsibility, and public rules. One mistaken judgment could affect suppliers, workers, and investors.

The question therefore shifted from "how do you make a good deal" to "how do you understand an organization within society." Joseph Wharton wanted universities to cultivate people who understood business, political economy, and public responsibility, not only shopkeepers trained to make money. Business education needed to put ledgers, contracts, finance, and law on the same table.

The Wharton School was founded at the University of Pennsylvania in 1881 and is usually regarded as one of the earliest university business schools in the United States. The turn it represented was not replacing experience with classrooms, but making experience subject to more systematic training and examination.

Business, administration, and law were thereby connected. How resources are allocated, how rules are made, how responsibility is carried, and how value is created cannot be answered by personal tricks alone. After the ledger left the counter, business began to become a public method that could be taught, debated, and held accountable.`,
    knowledgePoint: "Business, administration, and law focus on how organizations allocate resources, carry responsibility, make rules, and create value in society. Modern business education trains experience, accounts, organization, law, and public responsibility within one framework.",
    reflectionQuestion: "When one ledger affects workers, capital, and public rules, is business still only personal experience?",
  },
  "050-balcony-plant-observation": {
    title: "The Mountain Was No Longer Only Background",
    summary: "Humboldt placed plants, altitude, and air pressure on the same chart, turning nature from names into relationships.",
    scene: "On the Andean slopes around 1802, Humboldt wrote plant names, altitude, temperature, and air pressure into the same notebook.",
    storyBody: `Pick a leaf, press it into a specimen folder, write down its name and location: this was reliable and important work in natural history. Specimens were preserved so later observers could compare shapes, identify species, and trace where they had come from.

When Alexander von Humboldt explored the Americas, the question did not stop at names. As he moved up the mountainside, the plants kept changing. Plants in the lowlands, plants near the clouds, and plants in the thin air above were not merely different species. Their appearance seemed to move together with altitude, temperature, humidity, air pressure, and terrain.

The mountainside therefore was no longer only background. Humboldt added altitude, air pressure, and position to his notes, turning observation into a set of comparable data. Numbers stood beside plant names; environmental conditions stood beside specimens. Nature no longer looked like a row of collected objects, but like a set of variables pulling on one another.

In images such as the Chimborazo Naturgemalde, the mountain body, plant zones, and environmental information were placed on the same page. Readers did not see a single plant, but the distribution of plants as altitude and climate changed. The image turned the distant mountain into a structure of relationships that could be examined.

Natural sciences, mathematics, and statistics meet here: observation provides material, measurement makes the material comparable, and images and models present relationships. Naming remains important, but after naming, the question continues: with which conditions does this phenomenon appear? When conditions change, how does it move?`,
    knowledgePoint: "Natural sciences, mathematics, and statistics combine observation, measurement, comparison, and models to find patterns in natural phenomena. Humboldt's synthetic images of nature show a turn from classification to relationships, and from specimens to networks of variables.",
    reflectionQuestion: "If the same plant always appears with certain altitudes, temperatures, and humidity, is a specimen still only a name?",
  },
  "061-phone-backup-help": {
    title: "Count the Choices Before Sending Meaning",
    summary: "Shannon broke messages into choices and uncertainty, making communication reliability a problem that could be calculated.",
    scene: "In the mid-twentieth century at Bell Labs, engineers faced telephone lines, switches, noise, and a sequence of symbols that needed to be sent.",
    storyBody: `A message is usually first asked what it means. Whom does it comfort, what does it announce, what relationship does it change? These belong to human understanding. But before lines and machines, another question appears first: can the receiving end reliably distinguish what it has received?

Telephone lines have noise, electrical currents fluctuate, and switches make errors. The sender sends a sequence of symbols; the receiver may receive another sequence that is similar but wrong. If the system cannot even confirm "which one was received," meaning has not yet had a chance to arrive.

Claude Shannon temporarily moved the problem away from meaning and toward choice. Suppose there are only two possible messages: 0 or 1. When the receiver confirms one of them, only the other possibility has been eliminated. That is 1 bit. The more possible messages there are, the greater the uncertainty; the more uncertainty a message reduces, the more information it carries.

So information is not the same as sentence length. A very short signal, if it rules out most choices among many possible outcomes, may carry a great deal of information. A long stretch of repetition, if it adds almost no new distinction, may carry very little.

Noise makes communication require protection. If 1011 is sent, the receiver may get 1001. Coding and redundancy add checkable structure so that, under interference, the receiver still has a chance to judge where an error occurred. Channel capacity defines how much information can be transmitted reliably per unit of time.

Shannon's 1948 paper, A Mathematical Theory of Communication, made concepts such as bit, entropy, and channel capacity foundational to modern information theory. Information and communication technology thereby gained an engineering language: first count the choices, then design the transmission, and only then give meaning a stable chance to arrive.`,
    knowledgePoint: "Information and communication technology studies how information is encoded, transmitted, stored, recovered, and made to flow reliably through systems. Information theory treats a message as a reduction of uncertainty, measures choice in units such as bits, and studies how noise, coding, and channel capacity affect communication reliability.",
    reflectionQuestion: "When a message must pass through noise, what is protected first: the meaning, or the distinguishable choice?",
  },
  "070-wobbly-shelf-repair": {
    title: "Drawings Hold Ambition Back",
    summary: "Brunel's bridges, tunnels, and great ships moved construction from daring toward calculation, materials, and verification.",
    scene: "In nineteenth-century Britain, engineering drawings showed valleys, riverbeds, iron plates, rivets, and a ship growing ever larger at the same time.",
    storyBody: `A small bridge can be repaired slowly through experience. How far timber can bend, how stones interlock, where supports should be placed: the eye and hand of an old craftsperson often matter greatly. The site teaches people, and material gives feedback in the hand.

But when a span crosses a valley, a tunnel must pass under a riverbed, or an iron ship's hull becomes large enough to require rows of rivets and compartments, experience begins to struggle under scale. One change in dimension affects weight, tension, cost, and safety. One leak or deformation brings the assumptions on paper back into the field.

The nineteenth-century Britain of Isambard Kingdom Brunel was an era of expanding engineering ambition. The problems represented by the Thames Tunnel, the Great Western Railway, Clifton Suspension Bridge, and several large steamships were not only whether they could be built. They also included how materials bear force, how workers are organized, how money is arranged, and how risk can be exposed in advance.

Drawings here were not decorative lines. They broke ambition into dimensions, forces, materials, processes, and boundaries. Engineering had to draw first, calculate, build, and then bring field failure back into design for revision. Experience did not disappear, but it was placed inside a stricter verification cycle.

Bridges, tunnels, and great ships made the engineering problem clear: human beings can imagine larger structures, but imagination must accept the shared constraints of materials, tools, organization, and safety. The responsibility of engineering, manufacturing, and construction forms within those constraints.`,
    knowledgePoint: "Engineering focuses on turning needs into reliable structures through verifiable design, materials, systems, and organization. It places imagination, calculation, materials, construction, and safety inside one set of constraints.",
    reflectionQuestion: "When a structure becomes too large for the eye alone, what responsibility do drawings and calculations carry?",
  },
  "080-community-garden-seedlings": {
    title: "Wheat That Could Stand",
    summary: "Semi-dwarf wheat moved the agricultural problem from one-time high yield toward stability, disease resistance, and environmental adaptation.",
    scene: "In mid-twentieth-century experimental fields in Mexico, researchers examined wheat stalk height, rust spots, and rows of yield records.",
    storyBody: `The first glance in an experimental field often falls on yield. Which row has more heads of wheat, which plot harvests better: these are questions agricultural research must face. But if high yield appears in only one season, it is not yet a stable answer.

Trouble returns from different directions. If wheat stalks are too tall, they lodge after fertilization. If leaves are infected with rust, yield weakens. Rainfall, soil, and seasonal change can also make one good result fail the next time. The field does not allow researchers to stare at only one indicator.

Norman Borlaug and his team in Mexico kept crossing, planting, eliminating, and comparing performance across places and seasons. What they sought was not the wheat that looked strongest, but a variety that could still stand after fertilization, disease, and wind and rain, and still produce stable yield.

The value of semi-dwarf wheat hides in the action of "being able to stand." With shorter stalks, the plant is less likely to lodge after fertilization and can direct more strength toward the head. High yield is no longer only about growing more; it must remain stable among disease, soil, irrigation, fertilizer, and farmer practice.

This work later became associated with the Green Revolution, and also with debates over ecology, distribution, and long-term costs. The core question left in the wheat field was not "how can one plant win," but how food production can be repeatedly adjusted among biological, environmental, technical, and social conditions.`,
    knowledgePoint: "Agriculture studies how crops, soil, water, technology, ecology, and food systems jointly support stable production. Breeding does not pursue only one-time high yield; it must also consider disease resistance, lodging risk, environmental conditions, and long-term social effects.",
    reflectionQuestion: "If a wheat plant can yield more but easily falls over, which result is agriculture actually optimizing?",
  },
  "090-medicine-schedule-care": {
    title: "Causes Outside the Sickbed",
    summary: "Virchow's typhus investigation extended medical questions into housing, food, education, and public institutions.",
    scene: "In Upper Silesia in 1848, Rudolf Virchow looked at patients in a typhus epidemic area, and also looked at poverty itself.",
    storyBody: `Doctors first look at patients; that is medicine's starting point. Fever, rash, weakness, and the number of deaths all pull attention back toward diagnosis and treatment. The problem at the bedside is concrete and urgent, and no broad concept can replace it.

But in the Upper Silesian typhus investigation, the symptoms kept pointing beyond the sickbed. Crowded housing, hunger, lack of education, transport isolation, and poverty made the epidemic hard to explain through personal hygiene or a single prescription. Disease occurred in the body, but it was not determined only by conditions inside the body.

Rudolf Virchow recorded illness, but also the living conditions people faced. His report pushed typhus toward conditions such as food, schools, local self-government, and political representation. Institutional arrangements that seemed far from the clinic began to connect with patients' bodily conditions.

This did not hand medical responsibility to another field. On the contrary, medicine had to face more material. Treating individuals remained important, but if many people were driven toward illness by the same set of conditions, the boundary of the doctor was forced to expand. The fever at the bedside connected to roads, tables, housing, and public institutions.

Virchow is later often linked with the tradition of social medicine. Health and welfare here are not simply treatment techniques, but a way of seeing body, care, living conditions, and basic capabilities at the same time. Disease demands prescriptions, and also demands that people ask which environments keep producing vulnerability.`,
    knowledgePoint: "Health and welfare focus on disease, care, public health, social conditions, and people's basic capabilities for living. Social medicine emphasizes that disease occurs not only in bodies, but also in relation to poverty, housing, education, food, and institutional arrangements.",
    reflectionQuestion: "When the same disease keeps appearing together with poverty, housing, and food, where should a doctor draw the boundary?",
  },
  "100-rainy-event-service-desk": {
    title: "The Moment of Truth at the Gate",
    summary: "The minutes a passenger spends waiting at a counter or gate move service quality from back-office process into the moment when a customer judges the company.",
    scene: "At Scandinavian Airlines in the 1980s, passengers repeatedly judged the company at counters, on phone calls, at gates, and in delay announcements.",
    storyBody: `Passengers do not first see an airline's hangars, shift schedules, or process manuals. They see a line in front of the counter, whether someone answers on the phone, where their luggage is being asked about, and whether anyone explains the next step after a delay. However complex the back office may be, it has to be felt by passengers in these brief contacts.

The problem often appears in a few minutes of waiting. Announcements are vague, the line grows longer, and counter staff look down at the system but do not have permission to make a decision. For the company, this may be only a small node in the process. For the passenger, these few minutes are already enough to judge whether the company is reliable.

When Jan Carlzon led Scandinavian Airlines, he called these customer contacts moments of truth. The phrase has power not because it works like a slogan, but because it pushes management's attention from the office back to the gate. Service does not occur only after the back office has finished. It is tested in the moment when customer and employee face one another.

If the person at the gate can only repeat "please wait for notification," passengers see not only the limits of one employee, but a whole system that has not handed judgment to the front line. Training, authorization, information systems, and organizational levels all need to be rearranged around these contact points.

The difficulty of service lies here: what people remember may be only a few sentences, one decision, or one explanation. But behind those small moments stands the whole company. Back-office processes must support front-line judgment, and front-line experience also exposes whether the back office truly understands customers.`,
    knowledgePoint: "Service focuses on how people and organizations create value together through contact points, processes, experience, and trust. Service quality comes not only from back-office efficiency, but also from whether customers feel understood, answered, and reliably handled in front-line contact.",
    reflectionQuestion: "If customers know a company only through a few moments of contact, whom should the back-office system be designed for?",
  },
};

const strictManualEnglishOverrides20260628 = {
  "021-bauhaus-workshop": {
    title: "The Lamp on the Workbench",
    summary: "When art returned to materials, tools, and everyday objects, form no longer existed only to be viewed; it also had to be tested by life.",
    scene: "In Weimar after the First World War, a workshop held paper, metal sheets, fabric, wood, and a lamp sketch that was not yet finished.",
    storyBody: `In postwar Europe, many things seemed to have been placed apart. Painting and sculpture belonged to the museum, craft belonged to the workshop, machines belonged to the factory, and architecture belonged to another profession. When students learned art, they were often first led toward styles, schools, and works, but not necessarily toward how a piece of wood bears weight, how paper folds, or how a lamp lights a desk.

When Walter Gropius founded Bauhaus in Weimar, he was not facing only a question of art curriculum. Modern life was being changed by machines, cities, housing, transportation, and industrial products. People needed chairs, lamps, type, posters, rooms, and buildings, and they needed these things to be useful, clear, and durable in everyday life. Leaving art only on the wall was no longer enough to answer that life.

The workshop therefore became important. Students did not begin by imitating a fixed style. They first met materials and tools. Paper could fold into new structures, metal could reveal strength through bending, fabric could change its surface through stretching and weaving, and color could lose its stability under different light. Once the hand touched material, imagination was no longer completely free. It had to answer how the material would cooperate and how it would refuse.

A chair, a poster, a lamp, and a building all pushed the question back toward life. The line of a chair may be beautiful, but is it stable when someone sits down? A poster's color may be striking, but can it be read from far away? A lamp may have a novel form, but does its light fall where work is being done? Art was no longer only the expression of private feeling. It began to participate in function, production, reading, dwelling, and public space.

Bauhaus was not an ideal space without contradictions. It was shaped by political pressure, financial limits, and the pressures of its age, and it also had its own limits of gender, hierarchy, and educational belief. But it changed the basic imagination of modern art education: art can think through making, craft can meet industry, and design can place beauty, function, and social life on the same workbench.

Founded in 1919, Bauhaus later deeply influenced modern design, architecture, and art education. The image it left is not a room for quiet admiration of works, but a scratched workbench. On it lie materials, sketches, tools, and unfinished objects. Style does not descend from the air. It slowly forms among material resistance, the needs of life, and formal judgment.`,
    knowledgePoint: "Art studies how form, material, image, sound, movement, making, and perception shape human experience. Bauhaus workshop education emphasized the connections among art, craft, design, architecture, and industrial production, testing form through materials, function, and scenes of use.",
    reflectionQuestion: "Which everyday object around you would change if it were designed at once as art, tool, and life problem?",
  },
  "022-petrarch-mountain-letter": {
    title: "The Little Book Opened on the Summit",
    summary: "A climb made for the sake of seeing the landscape drew classical reading, inward examination, and human self-understanding onto the same height.",
    scene: "In the traditional account, in the spring of 1336, Petrarch and his brother climbed Mont Ventoux; wind moved over the rocks, and he carried a small book of Augustine with him.",
    storyBody: `Many roads are meant to reach somewhere else. Merchants travel, soldiers march, pilgrims move toward holy places, and farmers cross mountain land to finish the work of the day. On such roads, a mountain is often an obstacle, terrain to be crossed, not a purpose in itself. But in the letter tradition about Petrarch's climb of Mont Ventoux, the reason for going up looks different: he wanted to see the world from above.

That action seems simple, yet it changed the place of landscape. Landscape was no longer only background, nor only terrain one had to pass through on the way. It became something worth seeking. Standing high up, a person saw lowlands, rivers, distant cities, and roads already traveled enter the field of vision together. The outside world suddenly widened, and attention was forced to lift away from daily affairs.

Petrarch had long loved classical texts, copying letters and searching for the voices of ancient authors. When he faced old books, he did not treat them only as dead material. The words of the past could enter the questions of the present, as long as the reader brought his own desire, confusion, and judgment before the text. An old book was therefore not locked far away. At some moment, it could speak again.

In the letter about the climb, summit and page overlap. He opened the small book of Augustine that he had brought with him and read a reminder about people pursuing the external world while neglecting themselves. The landscape before him did not disappear, but it received another direction: look far outward, and also look back into oneself. The wide view from the summit became a trigger for inward examination.

Scholars can still debate whether every detail of the letter fully meets modern historical standards. More safely, as a text, it clearly presents an interweaving of landscape, classical memory, Christian self-examination, friendship, ambition, and self-understanding. A climb was not written merely as an outdoor experience. It became a way of understanding the human person.

Petrarch is usually called one of the important figures of Renaissance humanism. The humanities here are not only the preservation of old books, nor only talk about distant history. They ask how people use texts, places, memory, and belief to understand themselves. The little book on the summit is like a fine thread, drawing together the outside world, ancient voices, and inner life.`,
    knowledgePoint: "Humanities research studies history, religion, philosophy, ethics, cultural memory, and inner life, asking how people inherit, interpret, and revise meaning. Petrarch's letter about climbing Mont Ventoux is often discussed as an important symbolic text linking classical reading, self-consciousness, and humanism.",
    reflectionQuestion: "Which old book, place, or memory has let you see yourself again while looking at the outside world?",
  },
  "023-rosetta-cartouche": {
    title: "The Name Inside the Oval Frame",
    summary: "When royal names appeared again and again in different scripts, the images on stone were no longer only symbols to be viewed; they began moving back toward sound and history.",
    scene: "In nineteenth-century France, a desk held copies of the Rosetta Stone, Greek records, Coptic materials, and a string of signs enclosed by oval frames.",
    storyBody: `The Rosetta Stone was like a door with several locks. The Greek layer was easier to open, and scholars could know that it roughly contained a decree. Another layer of writing also offered clues. But hieroglyphs still looked like a row of silent images: birds, eyes, objects, and lines had clear shapes, yet did not readily become a readable sentence.

If these signs were treated only as decoration, they could remain only on the surface. Stelae could be collected, tomb walls copied, and patterns admired, but history would still be blocked behind the signs. The problem was not that people could not see these signs. It was that after seeing them, they did not know how they worked: were they drawing things, marking meanings, or recording sounds?

Jean-Francois Champollion placed his attention on the royal names enclosed by oval frames. Names were a particularly useful entry point because they appeared repeatedly in different scripts and could also be compared with the royal names in Greek. When the same name left traces in different systems, comparison was no longer only a guess. It had a handle that could be checked again and again.

As the comparison deepened, the identity of the signs became complex. Some signs that looked like pictures behaved like sounds inside royal names; other signs retained semantic functions. Coptic also provided an important clue for understanding the ancient Egyptian language, letting a language tradition that seemed broken show connection again. Hieroglyphs were no longer only mysterious images, but a system able to record language.

This process was not completed by one person from blankness. Earlier research, materials in different scripts, competing explanations, and linguistic knowledge all participated. But Champollion's announced breakthrough in 1822 brought the understanding of Egyptian hieroglyphs into a new stage. Stelae, tombs, prayers, names, and official records were therefore no longer only antiquities; they gradually became readable historical materials.

Language study here appears as a very concrete action: watch repetition, compare differences, and search for rules between sound and meaning. The royal name inside the oval frame was like a small key. It opened not only a few names, but the way a writing system preserved sound, power, memory, and time.`,
    knowledgePoint: "Language study connects writing, sound, grammar, meaning, translation, and historical context. Champollion's decipherment of Egyptian hieroglyphs shows that writing systems may contain both phonetic and semantic elements, and that decipherment requires cross-language comparison, repeated patterns, contextual materials, and related linguistic knowledge.",
    reflectionQuestion: "When a sign changes from decoration into readable language, what happens to our relationship with the past?",
  },
  "028-black-mountain-studio": {
    title: "The Classroom Beside the Dining Table",
    summary: "In a very small college, materials, labor, poetry, performance, and shared life were placed together, making the boundaries of learning less tidy.",
    scene: "In North Carolina in the 1930s, at a small college, students moved among classrooms, kitchens, workshops, and temporary performance spaces.",
    storyBody: `Some colleges have very clear boundaries. The classroom is where class happens, the dormitory is where rest happens, the kitchen is where people eat, and the workshop is where things are made. A timetable cuts knowledge into separate boxes. Students enter different rooms by the hour and then carry the content of each course away separately.

Black Mountain College was small, small enough that these boundaries were hard to keep intact. Students did not only sit in class and listen. They also took part in school affairs, lived with teachers, worked, discussed, cooked, and built. Learning did not happen only before a blackboard. It also happened while moving materials, preparing meals, arranging space, watching performances, and arguing over a decision.

Josef Albers brought material and form training from the Bauhaus workshop tradition. His course did not rush to begin with the explanation of famous works. It asked students to face paper, color, glass, leaves, wire, pressure, balance, and habits of seeing. Materials did not automatically obey concepts. Folded paper produced new structures; colors placed beside one another changed each other; weight and light changed how an object was perceived.

Later, the college attracted dancers, poets, composers, painters, textile artists, architects, and thinkers. Different practices were not simply arranged as a row of course names. They collided through shared life and shared making. One work might involve sound, body, space, words, and material at the same time; one discussion might move from art toward education, politics, labor, and human relationships.

Interdisciplinarity here was not choosing a few extra courses, nor placing several field names on the same poster. It was an arrangement of learning: making, reading, perceiving, performing, and shared labor were placed in the same site. Boundaries became unstable not because order was missing, but because many important questions actually happen between categories.

Black Mountain College is known for experimental, interdisciplinary arts and liberal education. What it left was not a neat model that can be copied easily, but a reminder: if tools, books, bodies, dining tables, arguments, and performances can all become classrooms, then arts and humanities are not only content to be learned. They also become a way of living together and understanding the world together.`,
    knowledgePoint: "Interdisciplinary programs related to arts and humanities place making, interpretation, history, language, performance, material, and lived experience inside one field of inquiry. They emphasize that artistic and humanistic knowledge often forms where material, body, text, space, and shared life meet.",
    reflectionQuestion: "If class happened not only in classrooms but also at dining tables, workshops, performances, and arguments, how would you understand learning differently?",
  },
  "061-phone-backup-help": {
    title: "That One Choice in the Noise",
    summary: "When a message passes through a telephone line, the first test is not its meaning, but whether the receiving end can distinguish exactly which one it was.",
    scene: "At Bell Labs in the mid-twentieth century, the table held circuit diagrams, telephone-line records, switch symbols, and a sequence of 0s and 1s waiting to be sent.",
    storyBody: `A sequence of symbols comes through from the other end of a telephone line. It may be a sentence, a set of instructions, or only a signal agreed upon by machines. When people read a message, they often first ask what it means: what it announces, what it changes, whom it comforts, whom it commands. But before lines, switches, and receivers, an earlier question appears: is the received symbol really the one that was sent?

Noise does not care about meaning. Small fluctuations in current, interference in the line, and errors in equipment can all make a symbol blur. The sender sends 1011, and the receiver may see 1001. To a person, this is only one digit different; to a communication system, the difference is already serious enough. If the receiving end cannot distinguish reliably, later understanding has no reliable entrance.

Claude Shannon temporarily moved the problem away from "what does the message say" toward "how many possibilities does the message exclude." If the receiver originally faces two possible outcomes, 0 or 1, then receiving one excludes the other. That smallest two-way choice can be represented as 1 bit. The more possible outcomes there are, the greater the uncertainty before receiving; the more a message reduces uncertainty, the more information it carries.

In this way, information quantity is no longer the same as word count. A short signal may be very "heavy" if it locks one result among many possibilities. A long string of repetition may be very "light" if it adds almost no new distinction. Communication technology began to gain a calculable language: a message is not first treated as meaning, but first as a narrowing of a space of choices.

But counting choices is not enough. Noise can disturb them, so a system needs coding, repetition, checking, and error-correction structures. Sending something that looks redundant is meant to let the receiver still judge where an error may have occurred under interference. Channel capacity is like the load limit of a line: under given conditions, it defines how much information can be transmitted reliably per unit of time.

Shannon's 1948 paper, A Mathematical Theory of Communication, made concepts such as bit, entropy, and channel capacity foundational to modern information theory. Information and communication technology gained a clear engineering route from this point: first count uncertainty, then encode the message into a transmissible form, and then consider how to recover it under noise. Meaning still matters, but it must first pass through a channel that can be recognized, protected, and restored.`,
    knowledgePoint: "Information and communication technology studies how information is encoded, transmitted, stored, recovered, and made to flow reliably through systems. Information theory understands a message as a reduction of uncertainty, uses bits to measure choice, uses entropy to describe uncertainty, and studies how noise, redundancy, coding, and channel capacity affect communication reliability.",
    reflectionQuestion: "When a message must pass through noise, should the system first protect its meaning, or first protect its identity as a distinguishable choice?",
  },
  "070-wobbly-shelf-repair": {
    title: "The Drawing Beneath the Iron Bridge",
    summary: "When bridges, tunnels, and great ships became too large, building could no longer rely only on hand feel; it had to accept the shared constraints of drawings, materials, and verification.",
    scene: "In nineteenth-century Britain, an engineering drawing crowded together a riverway, bridge towers, iron plates, rivets, steamship compartments, and dimensions waiting to be calculated.",
    storyBody: `When a wooden shelf leans, someone can steady it by hand and add another nail. Small bridges, sheds, and houses can often be corrected gradually through experience. How far timber bends, how stones bite into one another, where support should be placed for stability: the eye and hand of an old craftsperson are continually trained on the site. The material is in the hand, and error remains close to the person.

But when a bridge has to cross a wider valley, a tunnel has to pass under a riverbed, or an iron ship's hull becomes large enough to require rows of rivets, compartments, and steam power, experience begins to be pushed to the edge by scale. One change in dimension may change weight, tension, buoyancy, cost, and safety at the same time. Failure on site is no longer only "the place that was not fixed well." It can become systemic risk.

The nineteenth-century Britain of Isambard Kingdom Brunel was exactly such a period of expanding ambition. The engineering represented by the Thames Tunnel, Great Western Railway, Clifton Suspension Bridge, and large steamships was not only a matter of building things. Before work began, it required engineers to face whether materials could bear the load, how structures transmitted force, how workers should be organized, how funding could continue, and how accidents could be prevented.

A drawing was therefore not only beautiful lines. It was like a construction site opened in advance, breaking imagination into dimensions, angles, materials, forces, processes, and boundaries. If a line was wrong, the site might answer with deformation. If a calculation was missed, the structure might remind people with cracks. If the wrong material was chosen, both cost and safety would be pulled along. Engineering had to accept constraints on paper before it accepted verification on site.

Experience was not cancelled. On the contrary, it was placed inside a stricter cycle: design, calculate, manufacture, build, test, and then bring field results back into the next design. The craftsperson's eye still had value, but it no longer carried the whole judgment alone. Bridges, tunnels, and great ships showed that the larger building becomes, the more human imagination must be handed to systems that can be checked.

The core responsibility of engineering, manufacturing, and construction forms here. They do not only turn a bold idea into a physical thing. They make that thing stand among materials, tools, organization, cost, and safety. A drawing holds ambition back not to shrink it, but to give ambition a chance to become a structure that does not easily fall.`,
    knowledgePoint: "Engineering, manufacturing, and construction focus on turning needs into reliable structures or systems through verifiable design, material choice, calculation, organization, and construction process. They emphasize that imagination must be tested by physical conditions, resource limits, safety requirements, and field feedback together.",
    reflectionQuestion: "When a building or structure becomes too large to judge by experience alone, what responsibilities do drawings, calculations, and tests each carry?",
  },
  "080-community-garden-seedlings": {
    title: "Wheat Still Standing After Wind and Rain",
    summary: "Whether a row of wheat succeeds is not judged only by the weight of the heads, but by whether it can endure fertilizer, disease, wind, rain, and repeated tests on different land.",
    scene: "In mid-twentieth-century experimental fields in Mexico, researchers moved among rows of wheat, checking stalk height, rust spots, and yield records.",
    storyBody: `In an experimental field, the eye easily falls first on the heads of wheat. Which row is fuller, which plot yields more, which variety looks better on the record sheet: these are unavoidable questions in agricultural research. In the face of food shortage, yield is not an abstract indicator. It is the weight on many families' tables.

But a field never asks only one question. If wheat stalks are too tall, fertilizer may make them grow stronger, but it may also make them fall in wind and rain. If rust spots appear on leaves, yield is quietly weakened. A variety that performs well in one season may become unstable on another piece of land, under another water condition, or with another planting practice. If high yield cannot be repeated, it is not yet a reliable answer.

When Norman Borlaug and his team worked on wheat breeding in Mexico, this was the kind of multiple pressure they faced. They kept crossing, sowing, screening, eliminating, and comparing varieties under different conditions. The research was not only looking for the plant that seemed strongest, but for a combination that could still maintain yield after fertilizer, disease, and environmental change.

The meaning of semi-dwarf wheat hides in the fact that it can "stand." Shorter stalks lowered the risk of lodging, and the plant could direct more growth strength toward the head after fertilization. Disease resistance also made yield less easily taken away by rust. Success in the field was no longer only "growing more," but "still harvesting under pressure."

This change later became linked with the Green Revolution. High-yielding, disease-resistant semi-dwarf varieties increased food production capacity in some regions, while also raising continuing debates about irrigation, fertilizer dependence, ecological effects, and social distribution. Agricultural answers rarely exist only inside one seed. The seed must work together with soil, water, disease, technology, farmer practice, and social conditions.

So wheat that can stand is not a simple pose of victory. It reminds people that agriculture optimizes a living system. Yield matters, but stability, adaptation, disease resistance, and long-term effects will also return to the field. The moment the wheat stands, behind it lies repeated adjustment among biological traits, environmental conditions, and human management.`,
    knowledgePoint: "Agriculture, forestry, fisheries, and veterinary fields study relationships among biological resources, environmental conditions, production techniques, and social needs. In crop breeding, agricultural research does not pursue only one-time high yield; it also considers disease resistance, lodging risk, environmental adaptation, resource input, and long-term impact.",
    reflectionQuestion: "If a crop yields highly but easily fails under disease, wind, or rain, is it truly suited to agricultural production?",
  },
  "090-medicine-schedule-care": {
    title: "The Heat Beyond the Sickbed",
    summary: "An epidemic investigation pushed the doctor's gaze from symptoms toward housing, food, education, and institutions, so disease no longer stopped inside the body.",
    scene: "In Upper Silesia in 1848, Rudolf Virchow examined patients in a typhus epidemic area and also recorded crowded housing, hunger, and poverty.",
    storyBody: `When doctors approach the sickbed, they first see the body. Fever, rash, weakness, and the number of deaths all pull judgment back toward diagnosis and treatment. The patient's suffering is concrete and urgent, and no broad social word can replace care and medical judgment in that moment.

But in the Upper Silesian typhus investigation, the symptoms kept pushing the question beyond the sickbed. People lived in crowded housing, food was insufficient, educational opportunities were limited, transportation and public conditions lagged behind, and poverty repeatedly weakened bodily resistance. Disease occurred in the body, yet it was tangled with living conditions outside the body.

Rudolf Virchow recorded illness in the investigation, and also the conditions people lived under. His report connected the epidemic with food, schools, local governance, and political representation. Arrangements that seemed far from the consulting room began to enter medical vision. A prescription could handle one patient's suffering, but it could hardly explain by itself why a whole population remained exposed to similar risks.

This does not push medical responsibility onto another field. On the contrary, medicine was forced to face more material. Treating individuals remained important, and public health could not leave clinical knowledge behind. But when many people were driven toward disease by the same set of environments, a doctor who looked only at spots on the skin would miss the conditions that made the spots keep appearing.

The heat on the sickbed was connected to housing, tables, roads, schools, and public institutions. One person's fever can be caused by a pathogen, but the vulnerability of a whole region often has to be explained through living conditions. Health is not only the absence of disease. It also includes whether a person has enough nutrition, shelter, knowledge, care, and basic capacity to participate in public life.

Virchow is later often linked with the tradition of social medicine. Health and welfare thereby show a wider range: they include diagnosis, treatment, and care, and also public health, social conditions, and institutional arrangements. The patient lies in bed, but the cause may sometimes stand outside the door, in the street, in the school, and beside the granary.`,
    knowledgePoint: "Health and welfare focus on disease, care, public health, social conditions, and people's basic capabilities for living. Social medicine emphasizes that disease is related not only to biological factors, but also to poverty, housing, education, food, governance, and public institutions.",
    reflectionQuestion: "When the same disease repeatedly appears together with poverty, crowded housing, and insufficient food, where should medicine draw the boundary of observation?",
  },
};

const generatedEnglishOverrides = Object.fromEntries(
  generatedEnglishItems.map((item) => [item.id, fromGeneratedItem(item)]),
);

const englishOverrides = {
  ...generatedEnglishOverrides,
  ...manualEnglishOverrides,
  ...strictManualEnglishOverrides20260628,
};

const englishOverridesBlock = `// BEGIN English website story overrides 20260627
const gptWebsiteStoryOverridesEn20260627 = ${JSON.stringify(englishOverrides, null, 2)};
// END English website story overrides 20260627

`;

const functionReplacement = `function applyGptWebsiteStoryOverrideZh20260622(story) {
  const zhOverride = gptWebsiteStoryOverridesZh20260622[story?.id];
  if (zhOverride) Object.assign(story, zhOverride);
  const enOverride = gptWebsiteStoryOverridesEn20260627[story?.id];
  if (enOverride) Object.assign(story, enOverride);
  return story;
}`;

for (const targetPath of targetPaths) {
  let source = readFileSync(targetPath, "utf8");
  source = source.replace(
    /\/\/ BEGIN English website story overrides 20260627[\s\S]*?\/\/ END English website story overrides 20260627\n\n?/,
    "",
  );
  source = source.replace(
    /function applyGptWebsiteStoryOverrideZh20260622\(story\) \{[\s\S]*?return story;\n\}/,
    functionReplacement,
  );
  source = source.replace(functionReplacement, `${englishOverridesBlock}${functionReplacement}`);
  writeFileSync(targetPath, source);
  console.log(`Updated ${targetPath} with ${Object.keys(englishOverrides).length} English story overrides.`);
}
