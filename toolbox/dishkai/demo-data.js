// A deliberately small, static showcase derived from DishKAI's verified Italian
// metadata. This page does not import the private knowledge database or run AI.
// Small flavour components are grouped for a concise estimated-composition view.
export const demoDishes = [
  {
    id: "carbonara",
    originalName: "Spaghetti alla Carbonara",
    names: { zh: "卡邦尼意面", en: "Carbonara", nl: "Carbonara" },
    shortDescription: {
      zh: "意面拌鸡蛋、奶酪、腌猪肉和黑胡椒，传统版本浓郁但通常不靠奶油。",
      en: "Pasta tossed with egg, pecorino or Parmesan, cured pork, and black pepper; rich without needing cream in the classic version.",
      nl: "Pasta met ei, pecorino of Parmezaan, gezouten varkensvlees en zwarte peper; klassiek rijk zonder room.",
    },
    orderVerdict: {
      zh: "喜欢奶酪、鸡蛋、黑胡椒和腌猪肉的浓郁咸香，可以选它。",
      en: "A rich, salty pasta choice for diners who like cheese, egg, black pepper, and cured pork.",
      nl: "Een rijke, hartige pasta voor wie houdt van kaas, ei, zwarte peper en gezouten varkensvlees.",
    },
    taste: {
      zh: ["咸香", "鲜味", "浓滑"],
      en: ["Salty", "Umami", "Creamy"],
      nl: ["Zout", "Umami", "Romig"],
    },
    composition: {
      zh: [
        { label: "意面", percent: 55 },
        { label: "鸡蛋", percent: 15 },
        { label: "腌猪肉", percent: 15 },
        { label: "奶酪与黑胡椒", percent: 15 },
      ],
      en: [
        { label: "Pasta", percent: 55 },
        { label: "Egg", percent: 15 },
        { label: "Cured pork", percent: 15 },
        { label: "Cheese & black pepper", percent: 15 },
      ],
      nl: [
        { label: "Pasta", percent: 55 },
        { label: "Ei", percent: 15 },
        { label: "Gezouten varkensvlees", percent: 15 },
        { label: "Kaas & zwarte peper", percent: 15 },
      ],
    },
    watchOut: {
      zh: "含麸质、鸡蛋、乳制品和猪肉。过敏原及交叉接触情况请向餐厅确认。",
      en: "Contains gluten, egg, dairy and pork. Confirm allergens and cross-contact with the restaurant.",
      nl: "Bevat gluten, ei, zuivel en varkensvlees. Vraag het restaurant naar allergenen en kruiscontact.",
    },
    imagePath: "/toolbox/dishkai/assets/demo/carbonara.webp",
    visualDisclaimer: {
      zh: "AI 生成的视觉参考，非餐厅实拍。实际出品会因餐厅而异；成分比例为估算。",
      en: "AI-generated visual reference, not a restaurant photo. Actual dish may vary by restaurant. Estimated composition.",
      nl: "AI-gegenereerde visuele referentie, geen restaurantfoto. Het gerecht kan per restaurant verschillen. Samenstelling is geschat.",
    },
  },
  {
    id: "margherita-pizza",
    originalName: "Pizza Margherita",
    names: { zh: "玛格丽特披萨", en: "Margherita Pizza", nl: "Pizza margherita" },
    shortDescription: {
      zh: "番茄酱、马苏里拉、罗勒和橄榄油做成的披萨，简单清爽，奶酪感明显。",
      en: "Thin pizza with tomato sauce, mozzarella, basil, and olive oil; simple, bright, and cheese-forward.",
      nl: "Pizza met tomatensaus, mozzarella, basilicum en olijfolie; eenvoudig, fris en duidelijk kazig.",
    },
    orderVerdict: {
      zh: "想吃番茄、融化奶酪和较清爽的披萨口味时，可以选这道经典。",
      en: "A simple classic if you want tomato, melted mozzarella, and a lighter pizza profile.",
      nl: "Een eenvoudige klassieker met tomaat, gesmolten mozzarella en een lichtere pizzasmaak.",
    },
    taste: {
      zh: ["温和", "咸香", "奶香"],
      en: ["Mild", "Savory", "Creamy"],
      nl: ["Mild", "Hartig", "Romig"],
    },
    composition: {
      zh: [
        { label: "披萨面团", percent: 55 },
        { label: "番茄酱", percent: 20 },
        { label: "马苏里拉", percent: 20 },
        { label: "罗勒与橄榄油", percent: 5 },
      ],
      en: [
        { label: "Pizza dough", percent: 55 },
        { label: "Tomato sauce", percent: 20 },
        { label: "Mozzarella", percent: 20 },
        { label: "Basil & olive oil", percent: 5 },
      ],
      nl: [
        { label: "Pizzadeeg", percent: 55 },
        { label: "Tomatensaus", percent: 20 },
        { label: "Mozzarella", percent: 20 },
        { label: "Basilicum & olijfolie", percent: 5 },
      ],
    },
    watchOut: {
      zh: "含麸质和乳制品。过敏原及交叉接触情况请向餐厅确认。",
      en: "Contains gluten and dairy. Confirm allergens and cross-contact with the restaurant.",
      nl: "Bevat gluten en zuivel. Vraag het restaurant naar allergenen en kruiscontact.",
    },
    imagePath: "/toolbox/dishkai/assets/demo/margherita-pizza.webp",
    visualDisclaimer: {
      zh: "AI 生成的视觉参考，非餐厅实拍。实际出品会因餐厅而异；成分比例为估算。",
      en: "AI-generated visual reference, not a restaurant photo. Actual dish may vary by restaurant. Estimated composition.",
      nl: "AI-gegenereerde visuele referentie, geen restaurantfoto. Het gerecht kan per restaurant verschillen. Samenstelling is geschat.",
    },
  },
  {
    id: "tiramisu",
    originalName: "Tiramisù",
    names: { zh: "提拉米苏", en: "Tiramisu", nl: "Tiramisu" },
    shortDescription: {
      zh: "咖啡浸手指饼和马斯卡彭奶油层叠冷藏，上面有可可苦香。",
      en: "Chilled layered dessert of coffee-soaked ladyfingers and mascarpone cream, with cocoa bitterness on top.",
      nl: "Gekoeld laagjesdessert met koffielange vingers, mascarponeroom en een bittere cacaolaag.",
    },
    orderVerdict: {
      zh: "想吃带咖啡和可可香气、口感柔软浓滑的甜点，可以选它。",
      en: "A soft creamy dessert with coffee and cocoa notes rather than bright fruitiness.",
      nl: "Een zacht, romig dessert met koffie en cacao in plaats van frisse fruitsmaken.",
    },
    taste: {
      zh: ["甜", "奶香", "微苦"],
      en: ["Sweet", "Creamy", "Bitter"],
      nl: ["Zoet", "Romig", "Bitter"],
    },
    composition: {
      zh: [
        { label: "手指饼", percent: 35 },
        { label: "马斯卡彭", percent: 35 },
        { label: "咖啡", percent: 15 },
        { label: "鸡蛋、可可与糖", percent: 15 },
      ],
      en: [
        { label: "Ladyfingers", percent: 35 },
        { label: "Mascarpone", percent: 35 },
        { label: "Coffee", percent: 15 },
        { label: "Egg, cocoa & sugar", percent: 15 },
      ],
      nl: [
        { label: "Lange vingers", percent: 35 },
        { label: "Mascarpone", percent: 35 },
        { label: "Koffie", percent: 15 },
        { label: "Ei, cacao & suiker", percent: 15 },
      ],
    },
    watchOut: {
      zh: "含麸质、鸡蛋和乳制品，并使用咖啡。咖啡因、是否加酒、鸡蛋处理方式及交叉接触请向餐厅确认。",
      en: "Contains gluten, egg and dairy; made with coffee. Ask the restaurant about caffeine, alcohol, egg preparation and cross-contact.",
      nl: "Bevat gluten, ei en zuivel; bereid met koffie. Vraag het restaurant naar cafeïne, alcoholgebruik, de bereiding van het ei en kruiscontact.",
    },
    imagePath: "/toolbox/dishkai/assets/demo/tiramisu.webp",
    visualDisclaimer: {
      zh: "AI 生成的视觉参考，非餐厅实拍。实际出品会因餐厅而异；成分比例为估算。",
      en: "AI-generated visual reference, not a restaurant photo. Actual dish may vary by restaurant. Estimated composition.",
      nl: "AI-gegenereerde visuele referentie, geen restaurantfoto. Het gerecht kan per restaurant verschillen. Samenstelling is geschat.",
    },
  },
];
