// Dex Reorganization Script
// Renumbers all Lumo IDs so evolution families are consecutive, legendaries at end
// Usage: node reorganize_dex.js

const fs = require('fs');

// Complete old ID -> new ID mapping
// Families are grouped: base -> mid -> final
// Legendaries moved to end (206-212)
const ID_MAP = {
  // Starters (unchanged)
  1:1, 2:2, 3:3,
  4:4, 5:5, 6:6,
  7:7, 8:8, 9:9,

  // Fire families (new 10-24)
  10:10, 11:11, 178:12,           // Embrix->Helioveth->Inferarch
  12:13, 13:14, 179:15,           // Taurcin->Molteroth->Pyroclasm
  14:16, 15:17, 180:18,           // Ignicula->Pyroveth->Helixareth
  110:19, 130:20, 181:21,         // Magmaurin->Pyroterrath->Terravore
  144:22, 145:23, 182:24,         // Ignorin->Pyraxis->Ignitheon

  // Water families (new 25-41)
  16:25, 17:26, 183:27,           // Coralix->Aquidon->Tidalossus
  20:28, 21:29, 185:30,           // Corelin->Neraxis->Nepturix
  113:31, 133:32, 186:33,         // Toxaquil->Noxaquith->Noxarith
  117:34, 135:35, 187:36,         // Pearlith->Undirael->Thalassira
  114:37, 177:38,                  // Coralossus->Titanariel
  115:39, 175:40,                  // Thalveth->Marevanos
  127:41,                          // Titanomare (standalone)

  // Ice families (new 42-62)
  18:42, 19:43, 184:44,           // Cryonik->Boreon->Polarveth
  53:45, 169:46,                   // Slatis->Boreoveth
  47:47, 48:48, 203:49,           // Cryokin->Boreovast->Frigidvorn
  49:50, 50:51, 204:52,           // Nivelin->Glacivern->Glaciovast
  51:53, 52:54,                    // Cryovane->Arcturex
  124:55, 141:56,                  // Glacirin->Cryovast
  125:57, 142:58,                  // Speculith->Irisarael
  126:59, 143:60,                  // Lunaveris->Boreadrake
  160:61, 161:62,                  // Borix->Boreovane

  // Grass families (new 63-80)
  22:63, 23:64, 188:65,           // Sporix->Myceloth->Mycovast
  24:66, 25:67, 189:68,           // Viridix->Terravin->Rootvorn
  26:69, 27:70, 190:71,           // Germix->Verdurus->Morralyn
  111:72, 131:73, 192:74,         // Floralin->Faelomis->Junglevolt
  146:75, 147:76, 193:77,         // Sylvolt->Arborvolt->Voltanox
  118:78, 136:79, 191:80,         // Sylvnox->Morraveth->Faevernal

  // Electric families (new 81-94)
  28:81, 29:82, 194:83,           // Joltan->Galvanos->Zapoveth
  30:84, 31:85, 195:86,           // Electrix->Voltharpe->Surgolith
  32:87, 33:88, 196:89,           // Amperix->Volterel->Petrovast
  34:90, 168:91,                   // Zephyrel->Cyclomathos
  108:92, 128:93, 197:94,         // Voltrix->Petravolt->Aeolarch

  // Ground families (new 95-107)
  35:95, 36:96, 198:97,           // Terrakin->Seismith->Tectonvast
  37:98, 38:99, 199:100,          // Aridix->Geovenoth->Geovenomvast
  39:101, 40:102, 200:103,        // Limoux->Geoloth->Geovast
  112:104, 132:105,                // Arenikin->Dravanas
  154:106, 155:107,                // Geodrak->Terraquon

  // Wind families (new 108-117)
  41:108, 42:109, 201:110,        // Zephyrkin->Aeolomane->Cyclavorn
  43:111, 44:112, 202:113,        // Aeolin->Cyclavel->Aeolarch2
  45:114, 46:115,                  // Nimbusel->Aetherworn
  116:116, 134:117,                // Zephyrin->Pneumathos

  // Dark families (new 118-136)
  54:118, 55:119, 205:120,        // Umbrakin->Noctivast->Noctovast
  56:121, 57:122,                  // Noxalin->Umbraveth
  58:123, 59:124, 206:125,        // Nocturil->Phantorvex->Phantomvast
  120:126, 138:127,                // Vexakin->Specraxis
  121:128, 139:129,                // Mentarix->Voidaxis
  122:130, 176:131,                // Necralia->Necrothon
  148:132, 149:133,                // Obsidrix->Monolithox
  109:134, 129:135, 210:136,      // Aeronyx->Ferrovex->Ferrovast

  // Fairy families (new 137-146)
  60:137, 61:138, 207:139,        // Lumkin->Aetherael->Lumiarch
  62:140, 63:141,                  // Faeling->Prisoveth
  64:142, 65:143, 208:144,        // Dawnirel->Lunarael->Celestarch
  162:145, 163:146,                // Faerrin->Shinarith

  // Steel families (new 147-154)
  66:147, 67:148, 209:149,        // Ferrokin->Adamavast->Adamovast
  68:150, 69:151,                  // Gearon->Ferrotron
  70:152,                          // Imperion (standalone)
  152:153, 153:154,                // Forgekin->Ferrolith

  // Poison families (new 155-165)
  71:155, 72:156,                  // Toxirin->Venekon
  73:157, 74:158, 211:159,        // Acidelix->Toxoloth->Acidovast
  75:160, 170:161,                 // Miasoveth->Toxivane
  119:162, 137:163,                // Marlix->Venomalis
  150:164, 151:165,                // Venomite->Noxoveth

  // Psychic families (new 166-171)
  76:166, 77:167,                  // Mentakin->Psychovast
  78:168, 79:169,                  // Espelith->Mentarael
  80:170,                          // Oneiron (standalone)
  81:171,                          // Drakorius (standalone)

  // Dragon families (new 172-177)
  82:172, 83:173, 84:174,         // Drakurin->Serpenthos->Dragemian
  85:175,                          // Neruveth (standalone)
  86:176,                          // Tempyroth (standalone)
  87:177,                          // Glaciroth (standalone)

  // Normal families (new 178-190)
  88:178, 89:179,                  // Fluffen->Velvetine
  90:180, 91:181,                  // Lopikin->Boundrix
  92:182, 93:183, 212:184,        // Rotunden->Glutoros->Behemovast
  94:185, 171:186,                 // Airellin->Airovast
  95:187, 172:188,                 // Norindel->Plentorus
  156:189, 157:190,                // Quirelin->Aetherflock

  // Rock families (new 191-196)
  96:191, 97:192,                  // Petrikin->Lithavast
  98:193, 173:194,                 // Rugothon->Lithomere
  99:195, 174:196,                 // Prismolith->Frigolith

  // Bug families (new 197-205)
  100:197, 101:198, 102:199,      // Vermelin->Chrysalix->Aeridaleth
  103:200, 104:201,                // Colerix->Scarabion
  123:202, 140:203,                // Sericrix->Arachnalis
  158:204, 159:205,                // Terramite->Geodrix

  // Legendaries at end (new 206-212)
  105:206,                         // Aeolaxis
  106:207,                         // Pyrovanus
  107:208,                         // Thalassovex
  164:209,                         // Temporith
  165:210,                         // Gaiavorn
  166:211,                         // Voidraxis
  167:212,                         // Ferrothon
};

// Validate the mapping
const newIds = Object.values(ID_MAP);
const oldIds = Object.keys(ID_MAP).map(Number);

const uniqueNew = new Set(newIds);
if (uniqueNew.size !== newIds.length) {
  const seen = new Set();
  for (const [k,v] of Object.entries(ID_MAP)) {
    if (seen.has(v)) console.error(`DUPLICATE new ID: ${v} (from old ${k})`);
    seen.add(v);
  }
  process.exit(1);
}

let valid = true;
for (let i = 1; i <= 212; i++) {
  if (!uniqueNew.has(i)) { console.error(`Missing new ID: ${i}`); valid = false; }
  if (!oldIds.includes(i)) { console.error(`Old ID ${i} not in map!`); valid = false; }
}
if (!valid) process.exit(1);

console.log('ID_MAP validated: ' + Object.keys(ID_MAP).length + ' entries, covers IDs 1-212');

// Read the file
let content = fs.readFileSync('./js/data.js', 'utf8');

// Two-pass approach:
// Pass 1: Replace old IDs with temp IDs (add 5000 offset) to avoid collision
// Pass 2: Replace temp IDs with new IDs
// Use very specific patterns for each context

const TEMP_OFFSET = 5000;

// Sort old IDs descending to avoid partial matches (e.g., replace 100 before 10)
const sortedOldIds = [...oldIds].sort((a, b) => b - a);

// PASS 1: old -> temp
for (const oldId of sortedOldIds) {
  const tempId = oldId + TEMP_OFFSET;

  // 1. Monster definition key: "  X: { id:X," (with space after {)
  content = content.split(`\n  ${oldId}: { id:${oldId},`).join(`\n  ${tempId}: { id:${tempId},`);

  // 2. evolveTo field
  content = content.split(`evolveTo:${oldId},`).join(`evolveTo:${tempId},`);

  // 3. monsterId field (in battles, gyms, quests, elite four)
  content = content.split(`monsterId:${oldId},`).join(`monsterId:${tempId},`);

  // 4. wildMonsters id (no space after {)
  content = content.split(`{id:${oldId},`).join(`{id:${tempId},`);

  // 5. monsterId with space (some entries have "monsterId: X,")
  content = content.split(`monsterId: ${oldId},`).join(`monsterId: ${tempId},`);

  // 6. STARTER_IDS array elements
  // Handle carefully: [1, 4, 7] - only starters 1,4,7
  if (oldId === 1 || oldId === 4 || oldId === 7) {
    // Replace as array elements with surrounding context
    content = content.split(`STARTER_IDS = [1, 4, 7]`).join(`STARTER_IDS_TEMP = [1, 4, 7]`);
  }
}

// PASS 2: temp -> new
const sortedTempIds = sortedOldIds.map(id => id + TEMP_OFFSET).sort((a, b) => b - a);

for (const oldId of sortedOldIds) {
  const tempId = oldId + TEMP_OFFSET;
  const newId = ID_MAP[oldId];

  content = content.split(`\n  ${tempId}: { id:${tempId},`).join(`\n  ${newId}: { id:${newId},`);
  content = content.split(`evolveTo:${tempId},`).join(`evolveTo:${newId},`);
  content = content.split(`monsterId:${tempId},`).join(`monsterId:${newId},`);
  content = content.split(`{id:${tempId},`).join(`{id:${newId},`);
  content = content.split(`monsterId: ${tempId},`).join(`monsterId: ${newId},`);
}

// Fix STARTER_IDS
content = content.replace(
  'STARTER_IDS_TEMP = [1, 4, 7]',
  `STARTER_IDS = [${ID_MAP[1]}, ${ID_MAP[4]}, ${ID_MAP[7]}]`
);

// Check for any remaining temp IDs
const tempPattern = new RegExp(`\\b${TEMP_OFFSET + 1}\\b|\\b${TEMP_OFFSET + 50}\\b|\\b${TEMP_OFFSET + 100}\\b`);
if (tempPattern.test(content)) {
  console.warn('WARNING: Possible temp IDs remaining in output');
}

// Also update LEVEL_CAPS which references gym leader names (not IDs), should be fine
// But check for any references to specific IDs in comments or LEVEL_CAPS
// LEVEL_CAPS uses string keys like "rex", "marina" - no ID numbers

// Write the output
fs.writeFileSync('./js/data.js', content, 'utf8');
console.log('Done! data.js has been updated with reorganized Lumo IDs.');
console.log('Legendaries are now IDs 206-212.');
