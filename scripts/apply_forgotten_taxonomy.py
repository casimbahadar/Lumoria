#!/usr/bin/env python3
"""Update the Forgotten archetype/type classifications in taxonomy.md (matched by name)."""
import re, io

# name -> (types-display, archetype)
DATA = [
 ("Auravian","Aether/Primal","aether-divine messenger"),
 ("Lumarix","Crystal/Stellar","constellation-being"),
 ("Celestrix","Aether/Crystal","seraph"),
 ("Nyxviper","Dark/Chrono","temporal-assassin"),
 ("Morrath","Dark/Primal","darkfire elemental"),
 ("Duskmourn","Crystal/Chrono","stopped-clock being"),
 ("Electrak","Electric/Crystal","tesla-coil being"),
 ("Arcvolt","Electric/Chrono","fulgurite / petrified-lightning being"),
 ("Fulgureis","Electric/Primal","typhon"),
 ("Rootborn","Poison/Primal","mandragora"),
 ("Tellurak","Crystal/Primal","geode-being"),
 ("Gaiasurge","Primal/Fighting","atlas"),
 ("Pelagor","Aquatic/Chrono","oracle-seer"),
 ("Bathykor","Aquatic/Stellar","anglerfish"),
 ("Tidecrest","Aquatic/Primal","leviathan"),
 ("Aetherveil","Aether","wind-chime being"),
 ("Zephyrak","Wind/Crystal","harpy"),
 ("Skydrak","Wind/Stellar","roc"),
 ("Pyraeon","Fire/Crystal","nemean-lion"),
 ("Emberon","Fire/Chrono","sabertooth / smilodon"),
 ("Dracofire","Draconic/Primal","primal-dragon"),
 ("Frigalum","Ice/Crystal","arctic-fox"),
 ("Cryvorn","Ice/Chrono","fenrir"),
 ("Frostdrax","Ice/Primal","ymir / frost-giant"),
 ("Psydrak","Dream/Chrono","dream-dragon"),
 ("Luneveth","Stellar/Dream","moonlight-fairy"),
 ("Dreamaith","Dream/Aether","sandman"),
 ("Ironvast","Metal/Crystal","ankylosaurus"),
 ("Forgerak","Metal/Aether","smith / forge-spirit"),
 ("Alloydrax","Metal/Chrono","talos"),
 ("Volteon","Chrono","clockwork-being"),
 ("Sparkeis","Aether/Chrono","hourglass-being"),
 ("Thunderax","Chrono/Primal","chronos / father-time"),
 ("Nihilax","Stellar/Spectral","silence-being"),
 ("Vantarix","Chrono/Stellar","silhouette-being"),
 ("Abysdrak","Primal/Stellar","apophis"),
 ("Cosmolith","Aether/Stellar","celestial-globe / star-chart being"),
 ("Stardrax","Stellar/Sonic","supernova-being"),
 ("Stellarion","Stellar","star-spirit"),
]

txt = io.open('taxonomy.md', encoding='utf-8').read()
n = 0
for name, types, arch in DATA:
    pat = re.compile(r'(Forgotten ' + re.escape(name) + r' \| )[^`]*')
    txt, c = pat.subn(lambda m: m.group(1) + types + ' | ' + arch, txt)
    if c == 0:
        print("WARN: no match for", name)
    n += c
io.open('taxonomy.md','w',encoding='utf-8').write(txt)
print("taxonomy.md: %d Forgotten lines updated." % n)
