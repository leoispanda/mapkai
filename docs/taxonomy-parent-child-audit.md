# MapKAI Taxonomy Parent-Child Relationship Audit

Date: 2026-06-21

Scope: audit the current MapKAI 11 categories and 57 submodules only. This report does not rename, reorder, delete, or redesign the taxonomy.

## Source Files

| Role | File | Lines / Notes |
|---|---|---|
| Primary taxonomy source | `/Users/leoyang/Documents/mapkai/script.js` | `const categories = [...]`, lines 993-1367 |
| Published mirror | `/Users/leoyang/Documents/mapkai/public/script.js` | Same `categories` structure; parsed output is identical to `script.js` |
| Derived coordinate layer | `/Users/leoyang/Documents/mapkai/script.js` | `knowledgeCoordinateCategories`, `knowledgeAreas`, `knowledgeNarrowFields`, and `knowledgeFields`, lines 5586-5627 |
| Excluded special bucket | `/Users/leoyang/Documents/mapkai/script.js` | `specialKnowledgeCategory` adds `99/999 Field unknown`; excluded from the 11/57 audit |

Not treated as taxonomy submodules in this audit:

- Field-level entries inside each group, such as `0313 Psychology` or `0613 Software and applications development and analysis`.
- `baseLensStories`, `groupLensStories`, `conceptFables`, and `historicalStories`; these are content layers that reference the taxonomy.
- Project packs described in documentation; project packs should remain routes or content bundles, not submodules.

## Method

1. Parsed `script.js` and `public/script.js` to compare the category arrays.
2. Counted official categories and group-level submodules.
3. Checked every group code for parent count.
4. Confirmed that every submodule is nested under exactly one category.
5. Used ISCED-F 2013 only as reference logic for parent fit; no replacement taxonomy was introduced.
6. Marked semantic boundary risks in `issue_type`; these do not change the primary parent.

## Summary

| Metric | Result |
|---|---:|
| Total categories | 11 |
| Total submodules | 57 |
| Clear primary parent relationships | 57 |
| Ambiguous parent relationships | 0 |
| Missing parent relationships | 0 |
| Duplicated parent relationships | 0 |
| Rows with `issue_type = none` | 18 |
| Rows with `issue_type = cross-disciplinary` | 21 |
| Rows with `issue_type = too_broad` | 18 |
| Project packs found inside taxonomy submodules | 0 |

Important reading: `relationship_status = clear` means the source code gives exactly one primary parent. `issue_type` records content governance risks, such as broad administrative buckets or cross-disciplinary usage that should be handled through `related_paths`.

## Categories

| display_order | category_code | category_name_en | category_name_zh |
|---:|---|---|---|
| 1 | 00 | Generic programmes and qualifications | 通用课程与资格 |
| 2 | 01 | Education | 教育 |
| 3 | 02 | Arts and Humanities | 艺术与人文 |
| 4 | 03 | Social Sciences, Journalism and Information | 社会科学、新闻与信息 |
| 5 | 04 | Business, Administration and Law | 商业、管理与法律 |
| 6 | 05 | Natural Sciences, Mathematics and Statistics | 自然科学、数学与统计 |
| 7 | 06 | Information and Communication Technologies | 信息与通信技术 |
| 8 | 07 | Engineering, Manufacturing and Construction | 工程、制造与建筑 |
| 9 | 08 | Agriculture, Forestry, Fisheries and Veterinary | 农业、林业、渔业与兽医 |
| 10 | 09 | Health and Welfare | 健康与福利 |
| 11 | 10 | Services | 服务 |

## Submodule Relationship Audit

Submodule Chinese names are not currently defined in the source `groups` objects. Category Chinese names are defined as `chineseTitle`.

| submodule_code | submodule_name_en | submodule_name_zh | current_parent | confirmed_primary_parent | relationship_status | issue_type |
|---|---|---|---|---|---|---|
| 000 | Generic programmes and qualifications not further defined |  | 00 Generic programmes and qualifications | 00 Generic programmes and qualifications | clear | too_broad |
| 001 | Basic programmes and qualifications |  | 00 Generic programmes and qualifications | 00 Generic programmes and qualifications | clear | none |
| 002 | Literacy and numeracy |  | 00 Generic programmes and qualifications | 00 Generic programmes and qualifications | clear | none |
| 003 | Personal skills and development |  | 00 Generic programmes and qualifications | 00 Generic programmes and qualifications | clear | cross-disciplinary |
| 009 | Generic programmes and qualifications not elsewhere classified |  | 00 Generic programmes and qualifications | 00 Generic programmes and qualifications | clear | too_broad |
| 011 | Education |  | 01 Education | 01 Education | clear | none |
| 018 | Inter-disciplinary programmes and qualifications involving education |  | 01 Education | 01 Education | clear | cross-disciplinary |
| 020 | Arts and humanities not further defined |  | 02 Arts and Humanities | 02 Arts and Humanities | clear | too_broad |
| 021 | Arts |  | 02 Arts and Humanities | 02 Arts and Humanities | clear | none |
| 022 | Humanities (except languages) |  | 02 Arts and Humanities | 02 Arts and Humanities | clear | none |
| 023 | Languages |  | 02 Arts and Humanities | 02 Arts and Humanities | clear | none |
| 028 | Inter-disciplinary programmes and qualifications involving arts and humanities |  | 02 Arts and Humanities | 02 Arts and Humanities | clear | cross-disciplinary |
| 029 | Arts and humanities not elsewhere classified |  | 02 Arts and Humanities | 02 Arts and Humanities | clear | too_broad |
| 030 | Social sciences, journalism and information not further defined |  | 03 Social Sciences, Journalism and Information | 03 Social Sciences, Journalism and Information | clear | too_broad |
| 031 | Social and behavioural sciences |  | 03 Social Sciences, Journalism and Information | 03 Social Sciences, Journalism and Information | clear | cross-disciplinary |
| 032 | Journalism and information |  | 03 Social Sciences, Journalism and Information | 03 Social Sciences, Journalism and Information | clear | cross-disciplinary |
| 038 | Inter-disciplinary programmes and qualifications involving social sciences, journalism and information |  | 03 Social Sciences, Journalism and Information | 03 Social Sciences, Journalism and Information | clear | cross-disciplinary |
| 039 | Social sciences, journalism and information not elsewhere classified |  | 03 Social Sciences, Journalism and Information | 03 Social Sciences, Journalism and Information | clear | too_broad |
| 040 | Business, administration and law not further defined |  | 04 Business, Administration and Law | 04 Business, Administration and Law | clear | too_broad |
| 041 | Business and administration |  | 04 Business, Administration and Law | 04 Business, Administration and Law | clear | none |
| 042 | Law |  | 04 Business, Administration and Law | 04 Business, Administration and Law | clear | none |
| 048 | Inter-disciplinary programmes and qualifications involving business, administration and law |  | 04 Business, Administration and Law | 04 Business, Administration and Law | clear | cross-disciplinary |
| 049 | Business, administration and law not elsewhere classified |  | 04 Business, Administration and Law | 04 Business, Administration and Law | clear | too_broad |
| 050 | Natural sciences, mathematics and statistics not further defined |  | 05 Natural Sciences, Mathematics and Statistics | 05 Natural Sciences, Mathematics and Statistics | clear | too_broad |
| 051 | Biological and related sciences |  | 05 Natural Sciences, Mathematics and Statistics | 05 Natural Sciences, Mathematics and Statistics | clear | none |
| 052 | Environment |  | 05 Natural Sciences, Mathematics and Statistics | 05 Natural Sciences, Mathematics and Statistics | clear | cross-disciplinary |
| 053 | Physical sciences |  | 05 Natural Sciences, Mathematics and Statistics | 05 Natural Sciences, Mathematics and Statistics | clear | none |
| 054 | Mathematics and statistics |  | 05 Natural Sciences, Mathematics and Statistics | 05 Natural Sciences, Mathematics and Statistics | clear | cross-disciplinary |
| 058 | Inter-disciplinary programmes and qualifications involving natural sciences, mathematics and statistics |  | 05 Natural Sciences, Mathematics and Statistics | 05 Natural Sciences, Mathematics and Statistics | clear | cross-disciplinary |
| 059 | Natural sciences, mathematics and statistics not elsewhere classified |  | 05 Natural Sciences, Mathematics and Statistics | 05 Natural Sciences, Mathematics and Statistics | clear | too_broad |
| 061 | Information and Communication Technologies (ICTs) |  | 06 Information and Communication Technologies | 06 Information and Communication Technologies | clear | none |
| 068 | Inter-disciplinary programmes and qualifications involving Information and Communication Technologies (ICTs) |  | 06 Information and Communication Technologies | 06 Information and Communication Technologies | clear | cross-disciplinary |
| 070 | Engineering, manufacturing and construction not further defined |  | 07 Engineering, Manufacturing and Construction | 07 Engineering, Manufacturing and Construction | clear | too_broad |
| 071 | Engineering and engineering trades |  | 07 Engineering, Manufacturing and Construction | 07 Engineering, Manufacturing and Construction | clear | none |
| 072 | Manufacturing and processing |  | 07 Engineering, Manufacturing and Construction | 07 Engineering, Manufacturing and Construction | clear | none |
| 073 | Architecture and construction |  | 07 Engineering, Manufacturing and Construction | 07 Engineering, Manufacturing and Construction | clear | cross-disciplinary |
| 078 | Inter-disciplinary programmes and qualifications involving engineering, manufacturing and construction |  | 07 Engineering, Manufacturing and Construction | 07 Engineering, Manufacturing and Construction | clear | cross-disciplinary |
| 079 | Engineering, manufacturing and construction not elsewhere classified |  | 07 Engineering, Manufacturing and Construction | 07 Engineering, Manufacturing and Construction | clear | too_broad |
| 080 | Agriculture, forestry, fisheries and veterinary not further defined |  | 08 Agriculture, Forestry, Fisheries and Veterinary | 08 Agriculture, Forestry, Fisheries and Veterinary | clear | too_broad |
| 081 | Agriculture |  | 08 Agriculture, Forestry, Fisheries and Veterinary | 08 Agriculture, Forestry, Fisheries and Veterinary | clear | none |
| 082 | Forestry |  | 08 Agriculture, Forestry, Fisheries and Veterinary | 08 Agriculture, Forestry, Fisheries and Veterinary | clear | none |
| 083 | Fisheries |  | 08 Agriculture, Forestry, Fisheries and Veterinary | 08 Agriculture, Forestry, Fisheries and Veterinary | clear | none |
| 084 | Veterinary |  | 08 Agriculture, Forestry, Fisheries and Veterinary | 08 Agriculture, Forestry, Fisheries and Veterinary | clear | cross-disciplinary |
| 088 | Inter-disciplinary programmes and qualifications involving agriculture, forestry, fisheries and veterinary |  | 08 Agriculture, Forestry, Fisheries and Veterinary | 08 Agriculture, Forestry, Fisheries and Veterinary | clear | cross-disciplinary |
| 089 | Agriculture, forestry, fisheries and veterinary not elsewhere classified |  | 08 Agriculture, Forestry, Fisheries and Veterinary | 08 Agriculture, Forestry, Fisheries and Veterinary | clear | too_broad |
| 090 | Health and welfare not further defined |  | 09 Health and Welfare | 09 Health and Welfare | clear | too_broad |
| 091 | Health |  | 09 Health and Welfare | 09 Health and Welfare | clear | none |
| 092 | Welfare |  | 09 Health and Welfare | 09 Health and Welfare | clear | cross-disciplinary |
| 098 | Inter-disciplinary programmes and qualifications involving health and welfare |  | 09 Health and Welfare | 09 Health and Welfare | clear | cross-disciplinary |
| 099 | Health and welfare not elsewhere classified |  | 09 Health and Welfare | 09 Health and Welfare | clear | too_broad |
| 100 | Services not further defined |  | 10 Services | 10 Services | clear | too_broad |
| 101 | Personal services |  | 10 Services | 10 Services | clear | none |
| 102 | Hygiene and occupational health services |  | 10 Services | 10 Services | clear | cross-disciplinary |
| 103 | Security services |  | 10 Services | 10 Services | clear | cross-disciplinary |
| 104 | Transport services |  | 10 Services | 10 Services | clear | cross-disciplinary |
| 108 | Inter-disciplinary programmes and qualifications involving services |  | 10 Services | 10 Services | clear | cross-disciplinary |
| 109 | Services not elsewhere classified |  | 10 Services | 10 Services | clear | too_broad |

Full row-level reasons, related paths, recommended actions, and source paths are in `/Users/leoyang/Documents/mapkai/taxonomy_parent_child_audit.csv`.

## Top 10 Cases Needing Human Review

These are not parent errors. They are the highest-risk boundaries for future content placement.

| Rank | Submodule | Primary parent | Reason to review | Recommended handling |
|---:|---|---|---|---|
| 1 | 102 Hygiene and occupational health services | 10 Services | Name sounds partly health-related, but source places it under services. | Keep parent `10`; add related paths to `09`, `07`, or `04` when content is clinical, industrial-safety, or regulatory. |
| 2 | 084 Veterinary | 08 Agriculture, Forestry, Fisheries and Veterinary | Veterinary content can look like health or biology. | Keep parent `08`; add related paths to `09` or `05` for clinical/public-health/biology content. |
| 3 | 052 Environment | 05 Natural Sciences, Mathematics and Statistics | Environment regularly crosses agriculture, engineering, services, and social policy. | Keep parent `05`; use related paths for applied environmental policy, sanitation, engineering, and land-use stories. |
| 4 | 031 Social and behavioural sciences | 03 Social Sciences, Journalism and Information | Psychology, economics, and behaviour can overlap with health, business, education, and biology. | Keep parent `03`; related paths should carry applied domains. |
| 5 | 054 Mathematics and statistics | 05 Natural Sciences, Mathematics and Statistics | Data science and analytics may tempt a second ICT or business parent. | Keep parent `05`; use related paths to `06`, `04`, or `03` for applied analytics. |
| 6 | 003 Personal skills and development | 00 Generic programmes and qualifications | Personal development overlaps with education, psychology, work skills, and welfare. | Keep parent `00`; related paths should clarify applied context. |
| 7 | 103 Security services | 10 Services | Security can mean law, cyber security, defence, public safety, or service operations. | Keep parent `10`; add related paths to `04`, `06`, or `09` where needed. |
| 8 | 104 Transport services | 10 Services | Transport crosses service operations, engineering infrastructure, logistics, and environmental impact. | Keep parent `10`; add related paths to `07`, `04`, or `05` based on the story. |
| 9 | 032 Journalism and information | 03 Social Sciences, Journalism and Information | Information can overlap with ICT, publishing, media art, and business communication. | Keep parent `03`; add related paths for digital systems, archives, media production, or marketing contexts. |
| 10 | 073 Architecture and construction | 07 Engineering, Manufacturing and Construction | Architecture can drift toward design, environment, or urban services. | Keep parent `07`; add related paths to `02`, `05`, or `10` when those aspects are central. |

## Recommendations

1. Keep the existing 11 categories and 57 submodules unchanged.
2. Treat the code nesting in `categories[].groups[]` as the single source of primary parent truth.
3. If the taxonomy is later normalized into data files, store `primary_parent_code` explicitly but derive it from the current nesting.
4. Add cross-disciplinary links through `related_paths`, never by assigning multiple parents.
5. Keep project packs outside the taxonomy. They can reference submodules, but should not become submodules.
6. Keep detailed `fields` below submodules. Do not promote field-level items into submodules unless they already exist in the current 57.
7. Consider adding optional group-level `chineseTitle` later for display consistency; this would be a content localization improvement, not a parent-child taxonomy change.
