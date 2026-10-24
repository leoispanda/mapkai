// Public naming overrides preserve recording IDs, original stored metadata and lyric timing.
// An exact previous title match prevents applying an old alias to later unrelated edits.
const names = {
  "bb5957e7-9e91-45e1-a978-5643451d7820": {
    "from": "002 Dutch Horizons (Road Trip Version) - MapKAI - Geography - Dutch City Names",
    "to": "002 Dutch Horizons (Draft 1) - MapKAI - Geography - Dutch City Names"
  },
  "ccb37c55-bae6-4f72-a80a-d1bc94e40ae0": {
    "from": "003 Dutch Horizons (Symphonic Version) - MapKAI - Geography - Dutch Cities and Cultural Names",
    "to": "003 Dutch Horizons (Draft 2) - MapKAI - Geography - Dutch Cities and Cultural Names"
  },
  "e4363fdb-2354-4e5c-98f0-9549b689b5c3": {
    "from": "004 Dutch Horizons (Folk Rap Version) - MapKAI - Geography - Dutch Cities and Cultural Names",
    "to": "004 Dutch Horizons (Draft 3) - MapKAI - Geography - Dutch Cities and Cultural Names"
  },
  "6e294673-6d7c-4c16-8464-f43c88a4d3e2": {
    "from": "006 Dutch Horizons (Rock Version) - MapKAI - Geography - Dutch City Names",
    "to": "006 Dutch Horizons (Draft 4) - MapKAI - Geography - Dutch City Names"
  },
  "ba310ae6-7b5f-4807-934a-9e0ddd849491": {
    "from": "007 Dutch Horizons (Memphis Groove) - MapKAI - Geography - Dutch City Names",
    "to": "007 Dutch Horizons (Draft 5) - MapKAI - Geography - Dutch City Names"
  },
  "738f6165-d1c7-4d94-864b-a88f484318d9": {
    "from": "018 Show Me What Changed - MapKAI - Education - Formative Assessment",
    "to": "018 Show Me What Changed (Draft 1) - MapKAI - Education - Formative Assessment"
  },
  "06f9d872-0c71-4bb5-aaef-8a0b07116c47": {
    "from": "020 Show Me What Changed (Original Version) - MapKAI - Education - Formative Assessment",
    "to": "020 Show Me What Changed (Draft 2) - MapKAI - Education - Formative Assessment"
  },
  "1977976d-4585-4194-bbee-49068a5620f1": {
    "from": "019 Ask Me What I Need (Faded Ending) - MapKAI - Health and Welfare - Person-Centred Care",
    "to": "019 Ask Me What I Need (Draft 1) - MapKAI - Health and Welfare - Person-Centred Care"
  },
  "90fdbcee-57ee-4014-a34a-a6c797da2acb": {
    "from": "024 Ask Me What I Need (Full Recording) - MapKAI - Health and Welfare - Person-Centred Care",
    "to": "024 Ask Me What I Need (Draft 2) - MapKAI - Health and Welfare - Person-Centred Care"
  },
  "dd6263c6-5da3-4e67-8856-c97f0e293663": {
    "from": "026 Ask Me What I Need (Original Version) - MapKAI - Health and Welfare - Person-Centred Care",
    "to": "026 Ask Me What I Need (Draft 3) - MapKAI - Health and Welfare - Person-Centred Care"
  },
  "30be18b4-94ec-4acf-87c4-dc4298cd38f4": {
    "from": "021 The Cards Beside the Fold (Clear Version) - MapKAI - Education - Scaffolding",
    "to": "021 The Cards Beside the Fold (Draft 1) - MapKAI - Education - Scaffolding"
  },
  "51bfd6b7-e28e-4bcd-9a84-70841309d8c9": {
    "from": "023 The Cards Beside the Fold (Original Version) - MapKAI - Education - Scaffolding",
    "to": "023 The Cards Beside the Fold (Draft 2) - MapKAI - Education - Scaffolding"
  },
  "4dd21df7-9ea8-40f9-92ae-8458102f9ceb": {
    "from": "022 Read the Small Print (Original Version) - MapKAI - Generic programmes and qualifications - Literacy and Numeracy",
    "to": "022 Read the Small Print - MapKAI - Generic programmes and qualifications - Literacy and Numeracy"
  },
  "cbbdef58-3ec6-40f7-be79-0d7fc96f4c70": {
    "from": "025 Under the Blue (Original Version) - MapKAI - Arts and Humanities - Visual Analysis",
    "to": "025 Under the Blue - MapKAI - Arts and Humanities - Visual Analysis"
  },
  "82525547-93c9-4477-b85d-c1120e29e112": {
    "from": "055 Carry the Light (Rock 1) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "to": "055 Carry the Light (Draft 1) - MapKAI - Arts and Humanities - Dutch Cultural Figures"
  },
  "cb685be8-40cc-40cb-b86e-e8cf0c564f55": {
    "from": "056 Carry the Light (Rock 2) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "to": "056 Carry the Light (Draft 2) - MapKAI - Arts and Humanities - Dutch Cultural Figures"
  },
  "c58a7409-96d7-4e6c-80d4-e455c41e7387": {
    "from": "057 Carry the Light (Folk 1) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "to": "057 Carry the Light (Draft 3) - MapKAI - Arts and Humanities - Dutch Cultural Figures"
  },
  "a5fae2ac-c8f5-452e-8085-67da52598636": {
    "from": "058 Carry the Light (Folk 2) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "to": "058 Carry the Light (Draft 4) - MapKAI - Arts and Humanities - Dutch Cultural Figures"
  },
  "bc8fd5ba-7856-44b0-9bbd-632306897524": {
    "from": "059 Lowland Lights (Rap 1) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "to": "059 Lowland Lights (Draft 1) - MapKAI - Arts and Humanities - Dutch Cultural Figures"
  },
  "6e667622-100f-4b9b-8165-f75d0e90e3bb": {
    "from": "060 Lowland Lights (Rap 2) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "to": "060 Lowland Lights (Draft 2) - MapKAI - Arts and Humanities - Dutch Cultural Figures"
  },
  "16a889d4-0214-41c3-99f4-acab6f2d939d": {
    "from": "061 Your Turn (Rap 1) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "to": "061 Your Turn (Draft 1) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "description": ""
  },
  "b40a2738-3f42-4ef5-a181-7fafaf765574": {
    "from": "062 Your Turn (Rap 2) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "to": "062 Your Turn (Draft 2) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "description": ""
  },
  "8b9e3b50-efea-4e26-ba69-37dc4628d3ed": {
    "from": "063 Your Turn (Philips Trio) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "to": "063 Your Turn (Draft 3) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "description": ""
  },
  "efc8308c-614f-4845-94ce-3b32425c2e4a": {
    "from": "064 Your Turn (Science & ASML) - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "to": "064 Your Turn - MapKAI - Arts and Humanities - Dutch Cultural Figures",
    "description": ""
  }
};

export function publicSongTitle(track) {
  const name = names[track?.id];
  return name && track.title === name.from ? name.to : track.title;
}

export function publicSongDescription(track) {
  const name = names[track?.id];
  return name && track.title === name.from && typeof name.description === 'string' ? name.description : track.description;
}
