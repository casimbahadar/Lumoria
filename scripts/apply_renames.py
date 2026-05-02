#!/usr/bin/env python3
"""Apply 100 Lumori name renames to data.js (Option C cleanup)."""

import re

RENAMES = {
    "Embrix": (10, "IgnitRend"),
    "Pearlith": (34, "AquaRend"),
    "Sleetkin": (47, "CryoRend"),
    "Speculith": (57, "CryoFang"),
    "Sporix": (63, "FloraRend"),
    "Mycovast": (65, "FloraFang"),
    "Verdovast": (71, "FloraGolem"),
    "Zapoveth": (86, "VoltRend"),
    "Amperix": (87, "VoltFang"),
    "Surgolith": (89, "VoltGolem"),
    "Petrovast": (94, "VoltGuard"),
    "Venomvast": (100, "GeoRend"),
    "Crustvast": (103, "GeoFang"),
    "Arenikin": (104, "TitanRend"),
    "Gustkin": (108, "GaleRend"),
    "Shadowvast": (119, "NoxRend"),
    "Noctovast": (120, "NoxFang"),
    "Noxalin": (121, "NoxGolem"),
    "Umbraveth": (122, "NoxGuard"),
    "Phantomvast": (125, "NoxBolt"),
    "Vexakin": (126, "NoxRidge"),
    "Voidaxis": (129, "PsyRend"),
    "Obsidrix": (132, "PetroRend"),
    "Ferrovast": (136, "FerroRend"),
    "Lumkin": (137, "FaeRend"),
    "Prisoveth": (141, "FaeFang"),
    "Adamovast": (149, "FerroFang"),
    "Forgekin": (153, "FerroGolem"),
    "Acidoloth": (158, "VenomRend"),
    "Acidovast": (159, "VenomFang"),
    "Miasoveth": (160, "VenomGolem"),
    "Noxoveth": (165, "VenomGuard"),
    "Novakin": (166, "PsyFang"),
    "Psychovast": (167, "PsyGolem"),
    "Espelith": (168, "PsyGuard"),
    "Scalevorn": (174, "DrakoRend"),
    "Neruveth": (175, "AquaFang"),
    "Tempyroth": (176, "VoltBolt"),
    "Glaciroth": (177, "CryoGolem"),
    "Lopikin": (180, "TitanFang"),
    "Boundrix": (181, "TitanGolem"),
    "Airellin": (185, "TitanGuard"),
    "Airovast": (186, "TitanBolt"),
    "Quirelin": (189, "TitanRidge"),
    "Petrikin": (191, "PetroFang"),
    "Lithavast": (192, "PetroGolem"),
    "Frigolith": (196, "PetroGuard"),
    "Vermelin": (197, "ChitinRend"),
    "Colerix": (200, "ChitinFang"),
    "Sericrix": (202, "ChitinGolem"),
    "Mentovast": (217, "PsyBolt"),
    "Cerebrix": (223, "PsyRidge"),
    "Glimmerkin": (225, "PsyPeak"),
    "Prismolt": (229, "VoltRidge"),
    "Serpenthorn": (233, "DrakoFang"),
    "Permafrix": (240, "CryoGuard"),
    "Zappling": (242, "VoltPeak"),
    "Arcdrix": (243, "VoltSpire"),
    "Wavrix": (255, "AquaGolem"),
    "Waveling": (256, "AquaGuard"),
    "Seedling": (262, "FloraGuard"),
    "Vinrix": (263, "FloraBolt"),
    "Thornvast": (264, "FloraRidge"),
    "Shadowpup": (266, "NoxPeak"),
    # #272 Embrix — exact dupe of #10, rename second occurrence
    "Cindling": (274, "IgnitGolem"),
    "Scorchvast": (276, "IgnitGuard"),
    "Ironling": (278, "FerroGuard"),
    "Fluffkin": (284, "TitanPeak"),
    "Cuddrix": (287, "TitanSpire"),
    "Breezekin": (291, "GaleFang"),
    "Plagueoth": (298, "VenomBolt"),
    "Icethorn": (304, "PetroBolt"),
    "Seafraith": (308, "AquaBolt"),
    "Sandrix": (313, "GeoGolem"),
    "Galeaxis": (314, "GaleGolem"),
    "Temporith": (317, "PsySpire"),
    "Gaiavorn": (318, "GeoGuard"),
    "Voidraxis": (319, "NoxSpire"),
    "Venomwraith": (322, "VenomRidge"),
    "Silthorn": (326, "FloraPeak"),
    "Quarrex": (327, "PetroRidge"),
    "Smogveil": (328, "VenomPeak"),
    "Thornmoth": (331, "ChitinGuard"),
    "Wraithking": (342, "WraithRend"),
    "Astralwing": (346, "PsyForge"),
    "Abyssalith": (355, "AquaRidge"),
    "Pyrocrown": (358, "IgnitBolt"),
    "Chromavast": (363, "TitanForge"),
    "Cinderking": (365, "IgnitRidge"),
    "Gravithorn": (369, "PsyGale"),
    "Vortexwing": (370, "GaleGuard"),
    "Nullform": (371, "NoxForge"),
    "Oblivionwing": (382, "NoxGale"),
    "Stormcrown": (389, "VoltForge"),
    "Voidgarden": (390, "FaeGolem"),
    "Solarvast": (394, "IgnitPeak"),
    "Cosmoveil": (401, "PsyMaw"),
    "Mirkling": (405, "NoxMaw"),
    "Voidwarden": (407, "NoxJaw"),
}

EMBRIX_SECOND_ID = 272  # second Embrix (Fire/Dragon), renamed to IgnitFang

DATA_JS = "/home/user/Lumoria/js/data.js"

with open(DATA_JS, "r") as f:
    content = f.read()

original = content
renames_applied = 0
skipped = []

# Build a map of id -> new_name for fast lookup
id_to_new_name = {v[0]: (k, v[1]) for k, v in RENAMES.items()}
id_to_new_name[EMBRIX_SECOND_ID] = ("Embrix", "IgnitFang")

def replace_name_at_id(content, mon_id, old_name, new_name):
    """Replace name:"<old>" in the block with id:<mon_id>."""
    # Match the block header pattern with this specific id
    pattern = r'(id\s*:\s*' + str(mon_id) + r'\s*,\s*name\s*:\s*")[^"]+(")'
    replacement = r'\g<1>' + new_name + r'\g<2>'
    new_content, n = re.subn(pattern, replacement, content, count=1)
    if n == 0:
        # Try alternate spacing
        pattern2 = r'(id:' + str(mon_id) + r',\s*name:")[^"]+(")'
        new_content, n = re.subn(pattern2, replacement, content, count=1)
    return new_content, n

for mon_id, (old_name, new_name) in id_to_new_name.items():
    new_content, n = replace_name_at_id(content, mon_id, old_name, new_name)
    if n > 0:
        print(f"  #{mon_id:3d}  {old_name:20s} → {new_name}")
        content = new_content
        renames_applied += 1
    else:
        print(f"  MISS #{mon_id:3d}  {old_name}")
        skipped.append((mon_id, old_name))

print(f"\nApplied: {renames_applied}  |  Missed: {len(skipped)}")
if skipped:
    print("Missed entries:")
    for mid, mn in skipped:
        print(f"  #{mid} {mn}")

with open(DATA_JS, "w") as f:
    f.write(content)

print("data.js updated.")
