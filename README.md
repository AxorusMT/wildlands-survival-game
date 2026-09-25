# Wildlands

A standalone, offline side-view survival crafting adventure in pixel art. Open `index.html` in a modern desktop browser. The checked-in `dist/wildlands.js` bundle runs without a server, build step, account, or online service. Art, adaptive music, effects, and terrain are generated locally. The interface bundles Pixelify Sans and Silkscreen (and the older journal faces EB Garamond and Caveat) under the SIL Open Font License; their license texts are in `assets/fonts`.

## Pixel art

The world is drawn at low resolution into an art buffer (one art pixel is two world pixels) and scaled up by a whole number with no smoothing, so every pixel stays square and crisp at any screen size. Everything is painted procedurally in `src/renderer/`, with nothing drawn by hand:

- **Terrain:** autotiled 16×16 tiles with seamless textures (cobbled stone, pebbled soil, slate, veined hellrock, each dungeon's brick, fungal stone, cloud, voidstone), rims and rounded corners, grass, snow and dust caps with tufts and flowers, and darkened walls behind caves.
- **Light:** colour light per tile, as in Terraria. It comes from the sky, lava, glowing blocks, torches, fires, glowing creatures and shots, floods through air, and fades quickly into rock.
- **Sprites:** hue-shifted colour ramps with selective outlines.
  - A tree style for each region.
  - An animated, layered player whose armour shows.
  - Creatures built from shared body templates (four-legged, two-legged, winged, crawling, slime, floating, worm).
  - 16×16 item icons, shared by drops, the item in hand and every journal slot.
- **Distinctive touches:** dithered banded skies, parallax silhouettes, and the old field-journal palette of muted, earthy colours.

## Development

TypeScript source is in `src/`. `src/main.ts` bundles the UI, audio, simulation, data and renderer into `dist/wildlands.js` for the offline page. Run `npm install` once, then `npm run format`, `npm run typecheck`, `npm test` and `npm run build` after changes. The compiler uses strict type checking.

- **Rules and data:** gameplay rules are in `src/game/rules.ts`. World geometry, dungeons, dimensions, items, gear and creatures are in `src/data/`.
- **Systems:** each concern has its own system in `src/game/systems/`: the hotbar and equipment, combat and projectiles, bosses, the Rift and dungeon furnishings (`Realms.ts`), and the generated realms (`Pocket.ts`).
- **Generated realms:** each realm is a template in `src/data/realms/`. It builds its land from a seed and lists its creatures, resources, hazard, boss and loot.
- **Renderer:** `src/renderer/` is split into the pixel core (`px.ts`), tiles, sky, lighting, nature, structures, actors, icons and effects.

## Music

The soundtrack is twenty-five one-minute looping tracks, synthesised live by the browser. There are no audio files. Tracks are written as data in `src/audio/tracks/` using the small notation in `src/audio/score.ts`: melodies, chord progressions, arpeggios, bass patterns, drum grids, and filter or volume automation. Bar lines in a melody are checked when the track is built. `src/audio/instruments.ts` holds the General MIDI-style voices and drum kit. `src/audio/engine.ts` schedules notes ahead of the clock through a mixer with reverb, tempo-synced echo, sidechain ducking, and crossfades between tracks. `src/audio/scenes.ts` picks the track:

| Track                       | Plays                                               |
| --------------------------- | --------------------------------------------------- |
| Wildlands                   | Main menu                                           |
| First Light on the Meadow   | Meadow by day, and any temperate fallback           |
| Salt Wind Waltz             | Coast by day                                        |
| Under the Canopy            | Forest by day                                       |
| Lanterns Out                | Meadow, coast, and forest at night                  |
| Mire Shuffle                | Marsh                                               |
| Hoarfrost                   | Tundra, taiga, and alpine                           |
| Mirage Caravan              | Desert and badlands                                 |
| Squall Line                 | Any surface region during a storm                   |
| Lantern Glow                | The upper mines                                     |
| Crystal Dark                | The lower mines                                     |
| Brimstone Forges            | Upper hell                                          |
| Throne of Cinders           | Lower hell                                          |
| Direwolf                    | A Direwolf hunt or a dungeon boss                   |
| What the Wild Takes         | The death page                                      |
| Halls of the Hollow King    | The Mossy Crypt and the Frost Keep                  |
| Sand and Silence            | The Sunken Tomb                                     |
| Spore Light                 | The Mycelial Deep                                   |
| Above the Cloud Sea         | Skyreach                                            |
| The Hollow Between          | The Hollow Void                                     |
| UNMAKER (Montagem do Vazio) | The Unmaker, phase I (two minutes, Brazilian phonk) |
| UNMAKER II, III, IV         | Its later phases: faster and heavier at each        |
| Wildlands (Unmade)          | Its death: a phonk turn on the title theme          |
| Lamplight on the Square     | A town of two or more settlers                      |
| Brine and Blossom           | The Drowned Orchard                                 |
| The Kiln Road               | The Ashen Steppe                                    |
| Under the Amber             | The Hollow Warren                                   |

Surface changes wait a moment before the music follows, so walking along a border does not flip tracks. The menu, boss, and death tracks cut in straight away, and the Unmaker's cut in on the beat of what happens on screen. Music is muffled while the journal is open over the game.

## Sound

Sound effects are synthesised live too (`src/audio/sfx.ts`), and are panned and faded by where they happen:

- **You:** footsteps that change with the ground (grass, soil, stone, sand, snow, mud, ash), jumps, landings, strikes, hurt, burning, and death.
- **Your work:** axe chops, the creak and crash of a falling tree, pick strikes, rock crumbling, digging, picking plants, pickups, crafting (hammering, the anvil at a forge or furnace, sizzling at a campfire, bubbling at the apothecary), placing, eating, drinking, medicine, equipping, dressing, fishing, and opening caches and chests.
- **Creatures:** each has its own call, attack cry, and hurt cry. Deer bleat as they bolt, wolves howl and snarl, boars grunt, bats squeak, scorpions click and hiss, ember bats crackle, and hellhounds roar. The deep places add their own voices: rattling bones, ghouls, moaning wraiths, grinding golems, squelching slimes, hissing serpents, shrieking imps, clanking knights, puffing shroomlings, harpies, and chiming wisps.
- **Combat and magic:** bowstrings, darts, spells, potions, crystals ringing, falling stars, portals, boss slams, and blocks set in place.
- **Ambience:** rain, storm thunder and wind, birdsong by day, crickets at night, surf on the coast, campfire crackle, cave drips, the rumble of hell, and bubbling lava.

## Field console

Press ` (backquote) during play to open the field console. Tab completes commands and names, and ↑/↓ recalls earlier lines. Console switches last for the session and are not saved.

| Command                                  | Effect                                                             |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `give <item> [qty]`                      | Put items in the pack (`give obsidian pick 2`)                     |
| `items [filter]`, `recipes [filter]`     | List item and recipe ids                                           |
| `unlock <recipe\|all>`, `lock …`         | Make recipes craftable anywhere, without materials                 |
| `god`                                    | No damage; every need stays met                                    |
| `noclip`                                 | Fly through rock with WASD                                         |
| `speed <x>`                              | Scale movement speed                                               |
| `summon <mob> [count]`                   | Any creature or boss, e.g. `summon skeleton 3`, `summon unmaker`   |
| `kill [radius\|all]`                     | Slay nearby creatures                                              |
| `heal`                                   | Restore every vital and cure illness                               |
| `tp <x [y] \| region \| layer \| place>` | `tp alpine`, `tp lower_hell`, `tp crypt`, `tp skyreach`, …         |
| `time <hh:mm\|dawn\|noon\|dusk\|night>`  | Set the time of day                                                |
| `weather <clear\|cloudy\|rain\|storm>`   | Change the weather                                                 |
| `realm <id> [tier]`, `realm home\|close` | Open a generated realm (`realm warren 3`), go home, or collapse it |
| `pos`, `help`, `clear`                   | Where you are, the command list, and clear the log                 |

## Controls

| Key / mouse                  | Action                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------- |
| A / D or left / right arrows | Move                                                                          |
| W, Space, or up arrow        | Jump or climb a cave shaft                                                    |
| S or down arrow              | Descend a cave shaft or drop through a platform                               |
| 1–9, 0, or the mouse wheel   | Choose a quick slot on the hotbar                                             |
| Left click (hold to repeat)  | Use the held item at the cursor: dig, chop, build, strike, shoot, cast, drink |
| Right click or E             | Gather a nearby resource or use a structure, chest, altar, or portal          |
| F                            | Strike (or shoot) with the ready weapon                                       |
| R                            | Mine the tile in front of you                                                 |
| G                            | Fish while near water with a fishing rod                                      |
| J, I, or Tab                 | Open or close the animated journal                                            |
| ` (backquote)                | Open or close the field console (developer commands)                          |
| M                            | Open Field Notes and the world map                                            |
| 1–8 (journal open)           | Change journal pages                                                          |
| Esc                          | Open the journal as a pause menu, close it, or cancel placement               |

The hotbar fills itself with tools, weapons, blocks, placeables and consumables as you pick them up. Picks crack tiles over several strikes, depending on their hardness. Blocks and torches go wherever the cursor points. Swords hit everything in their arc, and bows and staves fire at the cursor.

Recipes are made from the **Recipes** page. Select **Details** to inspect a recipe. Structures are crafted into the pack, then placed by clicking nearby ground. Stand by a station to make its recipes. Use items, equip weapons, stow goods in a chest, and plant seeds from **Pack**. **Gear** shows your armour, accessories, health, mana, defense, set bonus and active effects, and lets you assign quick slots. Open **Vitals** to see exposure, diagnosis, treatment and the wash action. **Beasts** holds the Effergy folio and a bestiary of everything you have slain. **Atlas** lists the generated realms, opens them at a Waystone, and leads to the Rift page, which tracks the four sigils and the worlds they open. **Town** lists your settlers and their shops. **Notes** contains the tutorial, expedition chapters, side elevation map, manual save, and return to menu. The main menu has an expedition guide and saved music and effects sliders.

The game automatically saves to browser local storage every 40 seconds and when returning to the menu or closing the page. **Continue field record** reloads it. Perishable food and water, icebox fuel, and campfire fuel age while the game is closed. A death lets you recover in the meadow with reduced loose supplies or load the last saved record.

For a quick starting route: gather wood, stone, and fiber in the meadow; make a stone axe and pickaxe; find flint and make a spear; place a campfire; collect water at a blue pool and boil it at the fire. The field task in the upper right follows this route live.

### The Training Grounds

A new expedition starts in the **Training Grounds**, a short hand-laid course, unless you untick _Start in the Training Grounds_ when creating the world. The same page also takes an optional world seed: a number, or any words.

The course has eleven stations, each with a signpost. The HUD shows the lesson you are on, with its sign's text beneath it. In order, the stations teach:

1. moving;
2. jumping and climbing ladders;
3. gathering and crafting a stone axe, a pickaxe and a campfire;
4. collecting, boiling and drinking water;
5. mining copper;
6. fighting and hunting, then cooking and eating;
7. stowing food in an icebox;
8. treating bleeding from the brambles with a bandage from the chest;
9. wearing and mending clothes;
10. what Waystones and realm keys do;
11. what the journal holds: Skills, the Codex, Feats and the Atlas.

The course is also where you leave it:

- **Finishing:** the portal at the far end takes you to the meadow. You keep everything you made, and the field tasks there catch up with what you have already done.
- **Skipping:** press E twice at the portal where you arrived, or use _Leave the Training Grounds_ on the journal's Notes page.
- **Falling:** if you fall on the course, you wake at its start.

In the field console, `realm course` enters the course or leaves it.

## Progression

Stone → copper → iron → steel → obsidian → hellstone → myconite → starmetal → voidsteel. Tool tiers gate ore and hard ground. Nine wide biomes form a 30,000 × 4,480 side-view overworld. Each region has its own lie of the land (flat marsh and tundra, rolling meadow and forest, hilly taiga, alpine peaks, desert dunes, terraced badlands mesas), and each border has its own feature: a lagoon, a river valley, ridges, a frozen lake, an escarpment, and a canyon. Every slope stays walkable.

Below the surface the world descends through four layers, joined by ladder shafts. The **upper mines** hold three winding tunnels and the region's ores. The **lower mines** are blue-black deepstone (tier 3 pickaxe), with caverns, iron, crystal, and bats. **Upper hell** is scorched ash rock (tier 4) with pools of lava, sulfur, obsidian, and ember bats; its heat wears at your health. **Lower hell** is an open underworld of hellrock (tier 5) over lava lakes, where hellhounds hunt and hellstone glows in the rock. Without a **Cinder Ward** (obsidian, sulfur, hide, and ice at a forge) the heat kills within a minute, and lava burns even with one. Hellstone ingots make the Hellfire Blade.

The world changes as you work it. Chopped trees topple and leave stumps that slowly sprout and regrow; rock and ore veins break apart and are gone for good; plants are stripped and grow back. Whatever you break or kill drops its materials on the ground, and they fly to you when you walk near. Mined tiles stay mined, and saves record only the tiles you have changed. Copper comes from the forest, iron and coal from cold regions, sulfur from the desert and badlands, and obsidian from the badlands. Deer, wolves, boars, bats, and scorpions have distinct behavior and drops. The camp gear includes fishing gear, camp shelters, rain catchers, food preservation, protective clothing, lanterns, platforms, traps, and storage. A furnace smelts copper and iron; a forge makes steel and obsidian tools. Farm plots grow herb, wheat, or potato. An icebox supplied with mined ice slows nearby spoilage. The Effergy of Beasts is a costly forge craft; place it, open the **Beasts** folio, attune wolves, and complete hunts to summon each Direwolf. Only obsidian-tier or better weapons can damage a Direwolf. Existing local saves are migrated when loaded; records from the earlier, narrower world keep the pack, camp, and progress, and move to the same place in each wider region.

### Hard survival: food, cold, and disease

- **Rot:** food rots faster the hotter the air (up to ×2.6 in hell) and slower in the cold. It goes **stale** (less nourishing), then **spoiled** (it may give you food poisoning), then **rotten** (it will make you ill). Every food shows a freshness bar, and food of one kind shares a row showing the oldest.
- **Cold storage:** a ladder of storages, each holding food in its own larder.

  | Storage     | Rot                           | Cold source                                              |
  | ----------- | ----------------------------- | -------------------------------------------------------- |
  | Cool pit    | ×0.6 (×0.45 dug below ground) | None needed                                              |
  | Icebox      | ×0.18                         | Ice, which melts faster in the heat                      |
  | Snow cellar | ×0.14                         | Ice lasts a long time, and none is needed below freezing |
  | Frost chest | ×0.06                         | Frost shards                                             |
  | Rime vault  | ×0.02                         | None needed                                              |

  Stow food and add ice from the larder page. A storage warns you before its cold runs out. Standing beside cold storage also cools your pack.

- **Ice:** ice in the pack melts into water unless it is freezing out. The **insulated satchel**, **frost-lined pack** and **rime-lined pack** keep the pack cool and slow the melting.
- **Preserves:** a salting barrel makes salted meat and fish and pickled mushrooms. Berry preserves come from the campfire. Preserves keep for hours.
- **Meals:** the kitchen hearth cooks meals that leave a comfort behind them:

  | Comfort    | Effect                      |
  | ---------- | --------------------------- |
  | Well fed   | Faster health and stamina   |
  | Fiery      | +10% damage                 |
  | Sugar rush | +10% speed                  |
  | Clear mind | Mana returns twice as fast  |
  | Warm belly | The cold bites less         |
  | Feasted    | Well fed and fiery together |

- **Exposure:** being wet chills you, and it chills you hardest when the air is cold, so a rainy summer night is uncomfortable rather than deadly.
  - **Hypothermia** sets in after about a minute and a half with your body below 34.6°.
  - **Frostbite** needs freezing air as well.
  - **Pneumonia** takes five minutes of being soaked and chilled.

  A new expedition starts dressed in a linen underlayer and a hide vest.

- **Vitamins:** fruit, greens and preserves keep your vitamins up. Run out for long and scurvy sets in.
- **Water:** wild water can carry dysentery, so boil it. Water in the generated realms is **brackish** and can carry cholera; only a **water filter** makes it safe.
- **Ailments:** twenty diseases and injuries, each following the same course:
  - **Incubation:** it starts with no symptoms, and the journal only says you feel a little off.
  - **Stages:** once it shows, it is mild, then severe, then critical, worsening on its own clock unless treated.
  - **Recovery:** some mild ones pass off while you are fed, watered and warm, and exposure ailments ease once the cause is gone.
  - **Chains:** a critical infected wound can become blood poisoning, and a critical hypothermia can turn to pneumonia.
  - **Too late:** rabies serum works only before rabies takes hold.
  - **Immunity:** many leave you immune for a while, and a field vaccine guards against tetanus, rabies and cholera.

  | Group            | Ailments                                                                           |
  | ---------------- | ---------------------------------------------------------------------------------- |
  | Food and water   | Dysentery, fever, food poisoning, tapeworm, cholera, scurvy                        |
  | Wounds and bites | Infected wounds, blood poisoning, tetanus, rabies, venom                           |
  | Exposure         | Hypothermia, frostbite, heatstroke, pneumonia                                      |
  | The realms       | Spore lung, void rot, glass cough, marrow rot, fever-dream, gold sickness, rickets |
  | Injuries         | Bleeding, fractures, burns                                                         |

  Each ailment has its own treatment: bandages, splints, salves, teas, serums, and the older remedies. The **Vitals** page lists every ailment with its stage, symptoms, treatment and time left. A strip of ailments on the HUD shows their stages at a glance.

- **Clothing:** worn in three layers apart from armour: under, mid and outer. There are eleven garments, from linen underlayers to the rime parka and ember mantle. Each keeps out some cold, heat or rain, and wears through in hard weather until it is mended at a workbench.
- **Wear and mending:**
  - weapons blunt with use, and a worn-out weapon strikes for half;
  - tools dull with use, and a worn-out tool will not cut its tier;
  - nothing is lost, and everything is mended at its station (the Wardrobe lists what needs it);
  - a **repair kit** patches the weapon in hand anywhere.
- **Water, further:**
  - waterskins and flasks make each drink go further;
  - water in the pack freezes in hard cold unless it is in an insulated flask;
  - purification tablets clean three draughts at once;
  - a **distiller** boils brackish and wild water with wood.
- **Preserving, further:**
  - a smoking rack makes smoked fish;
  - a canning kettle makes canned stew and fruit that barely rot;
  - an ice harvester cuts ice wherever it freezes;
  - a cold box stops the ice in your pack from melting.
- **Diet:** food falls into seven groups: meat, fish, grain, fruit, greens, fungus and sweets. Four or more kinds in recent meals keep you strong, while the same food meal after meal leaves you malnourished.
- **Darkness:** twenty minutes without sunlight brings on rickets, which sunlight or fish oil cures. The miner's lamp burns resin in the dark.
- **Weight:** everything weighs something. Carry more than your pack holds (120 kg, more with a satchel, pack or expedition frame) and you slow down and tire.

### Dungeons

Four dungeons are built into the world. Each has its own brick, torches and music, a spanning tree of rooms linked by corridors and ladders, and a boss arena at the far end:

| Dungeon            | Where                                | Guardians                                      | Boss            | Sigil            |
| ------------------ | ------------------------------------ | ---------------------------------------------- | --------------- | ---------------- |
| The Mossy Crypt    | Under a mausoleum in the forest      | Skeletons, skeleton archers, bone bats, ghouls | The Hollow King | Sigil of Bone    |
| The Frost Keep     | Under an ice tower on the tundra     | Frost wraiths, ice golems, snow slimes         | Rime Colossus   | Sigil of Rime    |
| The Sunken Tomb    | Under a buried pyramid in the desert | Mummies, scarabs, tomb serpents                | Pharaoh Ankhet  | Sigil of the Sun |
| The Cinder Citadel | Rising from the underworld floor     | Imps, cinder knights, magma slimes             | Archdemon Vahl  | Sigil of Cinders |

- **Traps:** spikes, dart traps and flame vents guard the halls.
- **Chests:** loot chests hold draughts, potions, arrows, life crystals, keys and rare accessories.
- **Walls:** the brick needs a hellstone pickaxe to break, and the Citadel's needs myconite.
- **Bosses:** the first fight at each altar is free. After that the boss needs its key, crafted from what its dungeon drops.
- **Boss drops:** each boss has its own moves and drops its sigil, a life crystal and gear:
  - the Lich staff, Bone bow and Hollow crown;
  - Frostbrand and the Glacier staff;
  - the Sunspear, the Staff of the sun and the Scarab charm;
  - the Hellrazor and Demon wings.

### The Rift and the dimensions

Build the **Rift Gate** at a forge from obsidian, crystal, hellstone ingots and the Crypt's grave dust. Set sigils into it: one opens the **Mycelial Deep**, two open **Skyreach**, and all four open the **Hollow Void**. Each world lies in its own strip of the map, walled off by bedrock. A portal by the arrival point leads home.

| World         | What it is                                                          | Ore, tier                  | Boss            |
| ------------- | ------------------------------------------------------------------- | -------------------------- | --------------- |
| Mycelial Deep | One vast glowing cavern of fungus, a tunnel below, the Heart Hollow | Myconite (hellstone pick)  | The Sporemother |
| Skyreach      | Seventeen islands over a sea of cloud, joined by rope ladders       | Starmetal (myconite pick)  | Tempest Roc     |
| Hollow Void   | A dark shore of voidstone and crystal spires, shards adrift         | Voidsteel (starmetal pick) | The Unmaker     |

- **Getting around:** walk, climb the ladders, or jump between islands.
- **Gear:** each world's ore makes the next tier of tools, weapons and armour at the **Starforge**.
- **Boss summons:** each boss is called with an item crafted from its world: the Spore lure, the Storm totem and the Void seal.
- **The end:** the Unmaker's final fight. See below.

### The Unmaker

The last great foe waits behind the altar in the Maw of the Hollow Void. You summon it with a Void Seal, or in the console with `god`, `tp void`, `summon unmaker`. It has 48,000 health.

- **The entrance.** Its entrance is timed to the four-bar build of its theme:
  - the void tears open above the altar and drinks in the light on every beat;
  - it rises through the tear while the title lands one word per beat ("THE", "UN", "MAKER");
  - the world goes grey for a beat of silence;
  - the beat drops on the reveal, with a shockwave, a ring of light, and the boss bar slamming in.

  You cannot move or be hurt while it enters. Once you have beaten it, Esc skips the entrance.

- **Phases.** It has four phases and a last stand:

  | Phase      | Name          | Begins at  | Its host          |
  | ---------- | ------------- | ---------- | ----------------- |
  | I          | The Gaze      | start      | watchers          |
  | II         | The Swarm     | 75% health | adds void wisps   |
  | III        | The Unweaving | 50% health | void shades       |
  | IV         | The Collapse  | 25% health | void stalkers too |
  | Last stand | "Unmaking"    | 10% health | all of them       |
  - Each phase begins with a short cutscene: the world slows, the camera turns to it, it convulses, and the phase's name slams onto the screen.
  - Each phase has its own theme, faster and heavier than the last (145, 150 and 160 BPM).
  - While two void shades live, they take most of its wounds, so kill them first.

- **It gets exponentially harder.** Its danger doubles for every 38% of health it loses, to about six times its starting level at the end. Its shots hit harder and fly faster, it fires more of them, it rests less between moves, it dodges more, and it calls its host more often.
- **Its mind.** Its AI reads the fight rather than following a script:
  - it leads its shots to where you will be;
  - it sidesteps your arrows and backs off from a blade;
  - it keeps close if you fight from range, and far if you fight up close;
  - it marks the ground where you like to stand;
  - it punishes healing and standing still;
  - if you hide behind rock, it comes through the dark to find you.

  Its moves:
  - a gaze of led shots;
  - rings of beams (counter-rotating from phase III);
  - sweeping lances that pass through rock;
  - a blink behind you with a point-blank blast;
  - rift spikes erupting from marked ground;
  - seeking orbs that burst into rings;
  - a gravity well that drags you in;
  - a curtain of lances with one gap, marked in white.

  Every move is telegraphed.

- **Its look.**
  - **Aura and body:** an aura pulses on every beat of its theme. Shards orbit it, and more eyes open with each phase. From phase III it wears a crown of black glass horns with burning cracks, and at the end afterimages trail it.
  - **Sky and weather:** they turn with the fight, from a violet void with a great eye watching you, to void rain, to a crimson sky raining ash, to a black storm split by lightning on the beat.
- **Its death.**
  - The killing blow lands with a hit-stop, and the finale starts: a phonk turn on the title theme, at the title's own tempo.
  - The Unmaker convulses and cracks with light on every beat while its host goes out one by one.
  - On the finale's drop it bursts in a supernova: "UNMADE".
  - Then the fourth wall breaks. The screen cracks like a struck monitor, bleeds ink and dead lines, and falls away in pieces into "NO SIGNAL".
  - It comes back like an old tube switching on, to a dawn breaking where the eye used to watch.
- **Its spoils:**
  - **Oblivion,** the strongest greatsword;
  - **the Unmaker's Gaze,** the strongest staff (three seeking beams a cast);
  - **the Aura of the Unmade,** +30% damage, regeneration and speed, plus a void aura that sears every foe near you;
  - **the Heart of the Void,** which raises your health past every other limit, twice at most;
  - fracture shards, ascended ingots, and the Crown of the Wildlands.

### Waystones and generated realms

Beyond the Rift lie realms that are built anew every time you enter.

- **Waystones:** craft one at a workbench from stone, iron ingots and crystal, and set it down in the wildlands. Use it to open the **Atlas** page.
- **Keys:** each realm needs its own key. Three key fragments make a key at a Waystone. You can craft fragments, buy some from the Tinker, or find them in the realms. Each band's fragments are made from the spoils of the band before, so the realms open in order: Band I and II at the workbench, III at the forge, IV and V at the starforge. A **respirator** (workbench) triples your breath underwater.
- **Opening a realm:** turning a key builds the realm from a fresh seed in a strip of its own, and you arrive beside a portal home. The realm stays open until you turn another key.
- **Tiers I–V:** each tier gives monsters more health and harm and gives more loot. Clearing a tier's boss unlocks the next one.
- **Modifiers:** a realm rolls one modifier per tier above I. Boons include Bountiful, Rich veins, Treasure trove, Lucky and Low gravity. Banes include Fortified, Savage, Swarming, Frenzied, Hunted, Hungering, Frostbound, Scorched, Starless, Unstable, Blighted and Echoing. Every modifier adds to the loot.
- **Inside each realm:** you'll find resources, chests, two shrines that each grant a blessing once, a roaming elite, and the boss's altar. The first boss kill in each realm wins its **relic**.
- **Exploring:**
  - lore tablets: 30 fragments of the realms' history, which fill a Codex page;
  - a hidden vault sealed in the rock under each cairn;
  - a wandering merchant in about half of all expeditions, selling rare goods and the next band's key fragments.
- **More modifiers:** Toxic air (needs a respirator) and Silent (no music, and monsters hear you from further off).
- **How creatures fight:**
  - **kite:** keeps its distance and shoots;
  - **burrow:** sinks into the ground and bursts up beneath you;
  - **tether:** reels you in;
  - **mirror:** turns your shots back;
  - **split:** falls apart into two;
  - **swarm:** never comes alone.
- **Completion:** the Atlas shows how much of each realm you have done.
- **Resistances:** each creature resists some kinds of harm and fears others, and its Codex entry says which. The weapon's infusion sets the kind of harm, so choose it for the realm.
- **The Mycelial Deep:** it now exists in template form too, as a Band III realm. Its fragments are made at a forge from glowcaps, prism glass and a marrow ingot, and its keys at the seventh Waystone tier. The Deep beyond the Rift Gate is its seed 0, and Waystone expeditions regrow it with spore blooms (a respirator keeps them out).

| Realm                      | Hazard                                                                          | Signature                                         | Gear                                                                                   | Boss and relic                                                              |
| -------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Drowned Orchard            | The tide rises and falls; wading slows and chills you                           | Brinewood, tide pearls, crab shell                | Tidecaller set (swim freely), tidecaller spear, brine wand                             | The Orchard Mother · Tide conch                                             |
| Ashen Steppe               | Ash storms choke and blind in the open                                          | Cinderflax, kilnstone, old kilns that still smelt | Ashwalker set (storm-proof), kiln greataxe, ember sling                                | The Kiln Beast · Kiln heart                                                 |
| Hollow Warren              | Cave-ins: dust, then falling rock                                               | Burrow amber, beetle carapace                     | Amberguard set (sense cave-ins), amber repeater, amber pickaxe                         | The Warren Queen, who burrows · Queen's mandible                            |
| Glasswood (II)             | Shardfall: a glint in the canopy, then falling glass that cuts                  | Prism glass, lumen moss                           | Prismweave set (shards glance off; magic +10%), prism wand, shard glaive               | The Lumen Stag · Lumen antler                                               |
| Bone Marches (II)          | The marrow mire slows, soaks and can bring on marrow rot                        | Marrow-iron, bone                                 | Bonewalker set (mire-proof; +3 defense), bonecleaver, vertebra whip                    | The Ossuary Hydra, which regrows unless burned · Hydra tooth                |
| Clockwork Barrow (III)     | Steam vents blast on a rhythm along the halls                                   | Brass gears and ingots                            | Gearwright set (vents cannot scald; ranged +10%), brass repeater, piston hammer        | The Engine Saint · Saint's cog                                              |
| Salt Flats of Oru (III)    | The white sun parches the open flats by day; mirages look like real foes        | Saltglass, salt                                   | Saltwarden set (sun-proof; reveals mirages; +10% speed), mirage blade, saltglass bow   | The Mirage Tyrant, who splits into copies · Tyrant's eye                    |
| Frozen Choir (III)         | The hymn: every 90 s you slow and freeze unless by a fire. Food never rots here | Rime silver, frost lilies, bell bronze            | Choirsilver set (hymn-proof; +6° cold resistance), choir stave, bellhammer             | The Hymnal · Hymnal bell                                                    |
| Feverlands (IV)            | Every bite may carry a disease; the fever-dream scrambles your HUD              | Plague ivory, fever bloom                         | Plague doctor set (bites carry nothing; sickness resisted), venom blade, plague censer | The Mother of Rot, who leaps and floods the field with toads · Rot mask     |
| Sunken Observatory (IV)    | Low gravity; star pulses gather overhead and crash down                         | Astral lens                                       | Astral set (pulses pass through; magic +10%), astral tome, star spear                  | The Astronomer, who turns the sky over · Astrolabe                          |
| Gutter of Kings (IV)       | Cursed gold: picking it up risks gold sickness. Ten vaults of loot              | Crown gold, coin                                  | Gilded set (curse-proof; +25% marks), gilded greatblade, thief's whip                  | The Pauper King, who taxes your purse to heal · Pauper's crown              |
| The Undertow (V)           | All underwater: 40 s of breath, refilled at diving bells                        | Abyssal pearl                                     | Leviathan set (breathe and swim freely; +3 defense), leviathan harpoon, tidebreaker    | The Leviathan · Leviathan scale                                             |
| Emberheart (V)             | Magma rises through the lower ledges every two minutes                          | Heartstone                                        | Forgeborn set (magma- and lava-proof; +4 defense), anvil maul, heartfire staff         | The Anvil God · Anvil spark                                                 |
| Garden of Lost Seasons (V) | The season turns every 150 s: summer scorches, autumn rots, winter freezes      | Seasonbloom                                       | Druid set (seasons cannot touch you; regenerate), season bow, thornlash                | The Four-Faced Warden, whose attacks change with its face · Seed of Seasons |

### The Fractured Realms

Beyond Band V the realms come apart. **Fracture shards** drop from the great foes of Band V, and four of them make a **Fractured key**.

- **Splicing:** each Fractured expedition joins two realms at a seam, with a shaft and ladder between them.
- **Hazard and creatures:** it borrows one realm's hazard and gathers creatures from both.
- **The great foe:** it calls a boss from any realm, empowered with half again its health.
- **Tiers never end:** the Atlas counts them in Roman numerals, and each tier scales monsters and loot further.
- **Rewards:** shards drop in plenty. They forge **Ascended ingots** for the twelfth weapon tier. In the Armoury a shard can reforge a weapon, rolling its quality twice and keeping the better.
- **Relic:** the Prism of worlds.

### Homes and the town

- **Building:** place **back walls** (dirt, stone, wood, brick, glass and the stones of every dungeon and world), **doors**, **chairs**, **tables** and **beds**. Walls must touch ground or another wall. A **hammer** knocks walls down and picks furniture back up. Dungeon walls need an iron hammer.
- **Doors:** a closed door is solid. Walk into it or press **E** to open it, and it swings shut once the doorway is clear.
- **Beds:** sleeping in a bed passes the night and makes it your spawn point for as long as it stands.
- **Homes:** a room is a home when it is enclosed, backed by walls everywhere, 10 to 160 tiles in size, and has a door, a seat, a table, and a light. Use a chair or table to check what a room still needs.
- **Settlers:** eight settlers arrive as the expedition goes on. The Guide comes after your first campfire, the Trader after your first 50 silver marks, the Smith after your first copper ingot, the Herbalist after your first apothecary, the Tinker after the Mossy Crypt, the Mystic after your first sigil, the Sky-sailor after Skyreach, and the Void-touched after the Void. Each takes a free home, one settler to a room. They wander near home, cannot be harmed, and leave if their home is broken.
- **Trade:** creatures drop **silver marks**. Talk to a settler to open the **Town** page, where you can buy their wares and sell anything you carry to any settler nearby.
- **Town bonus:** two or more settlers nearby give a gentle healing bonus, and the town gets its own music.
- **Silver, gold, and gems:** silver and gold ores, and rubies, sapphires and emeralds, lie in the mines. Silver and gold make tools, broadswords and armour between iron and steel, and the gems make staves.

### The weapon hierarchy

One table in `src/data/weapons.ts` governs every weapon: twelve material tiers by ten families. The **Armoury**, reached from the Gear page, shows the whole grid and which weapons you have found.

| Tier | Material  | Tier | Material   |
| ---- | --------- | ---- | ---------- |
| 1    | Flint     | 7    | Cinder     |
| 2    | Copper    | 8    | Myconite   |
| 3    | Iron      | 9    | Starmetal  |
| 4    | Steel     | 10   | Voidsteel  |
| 5    | Obsidian  | 11   | Riftforged |
| 6    | Hellstone | 12   | Ascended   |

| Family     | Its gift at every tier                                |
| ---------- | ----------------------------------------------------- |
| Blade      | Every third blow in quick succession strikes for ×1.8 |
| Greatsword | Slow, heavy cleaves across a wide arc                 |
| Spear      | The longest melee reach                               |
| Battleaxe  | Blows open bleeding wounds                            |
| Warhammer  | Staggers foes and cracks their armour                 |
| Whip       | Long, quick lashes that mark foes to take more harm   |
| Bow        | Arrows at range                                       |
| Crossbow   | Slow to load; bolts hit hard and pass through         |
| Staff      | Mana shaped into bolts                                |
| Tome       | A torrent of small seeking sparks                     |

Each weapon also has its own upgrade line:

- **Quality:** rolled when the weapon first comes to you. It is Crude, Common, Fine, Masterwork or Mythic (×0.85 to ×1.4 damage), and it also sets how many gem sockets the weapon has. Finds inside higher-tier realms roll better. Reforging at the anvil rerolls it.
- **Level:** +1 to +10 at the anvil (a workbench, forge or starforge, by tier), paid in the tier's material and silver marks. Each level adds 7% damage.
- **Evolutions:** at +5 and again at +10 you choose one of two paths for the family. For example, a battleaxe can become Serrated or Balanced, then Reaper or Berserk; a bow can gain Volley or become a Sniper.
- **Infusions:** fire (burning), frost (slows), venom (poison), void (ignores half of armour), holy (+50% against the undead) and storm (lightning leaps to a second foe).
- **Gems:** ruby (damage), sapphire (magic), emerald (critical hits), topaz (speed), onyx (armour piercing) and opal (life drain). Topaz, onyx and opal are found in the realms.

Ranged families (bow, crossbow and staff) hit a little softer than melee to pay for their safety. The balance tests hold each band's great foes to between about 12 s and a minute for a +5 Common melee weapon of that band's tier, and to about 15–90 s for a ranged one. A weapon from the band before takes far longer.

Signature weapons, such as the Tidecaller spear and the Hellrazor, belong to a family and tier but stand outside the grid.

### Builds and lasting progress

Nothing here resets. The world is persistent, and so is everything you learn in it.

- **Renown** (the bar under DEFENSE on the HUD) comes from nearly everything: the first kill of each creature, crafting, placing, gathering, reaching new places, clearing realm tiers, curing illnesses and settling townsfolk. Each of its 60 levels grants a skill point.
- **Skills** (Gear › Skills) come in five trees:
  - **Warfare**: melee weapons, health and defense.
  - **Marksman**: bows, crossbows and critical hits.
  - **Arcana**: staves, tomes, mana and infusions.
  - **Survival**: hunger, thirst, cold, disease and food keeping.
  - **Wayfinding**: realms, keys, loot, gathering and movement.

  Each tree has four rows of six skills. The rows open after 3, 6 and 10 points spent in that tree. After 14 points in a tree come its three keystones (2 points each), which change how you play:

  | Tree       | Keystones                              |
  | ---------- | -------------------------------------- |
  | Warfare    | Berserker, Juggernaut, Bladestorm      |
  | Marksman   | Deadeye, Quiver master, Skirmisher     |
  | Arcana     | Overchannel, Mana shield, Elementalist |
  | Survival   | Iron gut, Cold-blooded, Field medic    |
  | Wayfinding | Riftborn, Treasure sense, Wanderer     |

  Unlearning everything costs 3 fallen stars and 200 marks.

- **Weapon mastery**: every family levels from 1 to 20 as you deal damage with it. Each level adds 1% damage. Level 5 steadies a blade's combo, 10 adds critical chance, 15 quickens your blows, and 20 adds another 10%.
- **Archetype armour**: four builds (Vanguard, Ranger, Arcanist and Wayfarer), each available at three tiers (iron, hellstone and starmetal). Their bonuses:
  - **Vanguard**: defense, and foes that bite you take damage back.
  - **Ranger**: critical hits, and a chance to keep your ammunition.
  - **Arcanist**: +40 mana.
  - **Wayfarer**: resistance to disease and cold, and food keeps longer in your pack.
- **The Codex** (Beasts › The Codex) has 20 pages:
  - the creatures of every region, dungeon and realm;
  - the regions, dungeons and worlds you have visited;
  - the maladies you have survived, the foods you have eaten, the families of arms, the weapons you have hoarded, and the relics.

  Finishing a page grants a lasting bonus.

- **The relic shelf** is built at the workbench. Relics set on it (the realm bosses' prizes and great trophies) lend their gifts wherever you are. It holds three relics, four at renown 20 and five at renown 40.

### Stations, study, and mastery

- **Station lines:** each upgrade does everything the stations below it did, adds recipes, and makes finer weapons.

  | Line     | Stations                                   | New at the top                 |
  | -------- | ------------------------------------------ | ------------------------------ |
  | Benches  | workbench → tinker's bench → artisan bench | Repair kits, packs, whetstones |
  | Forges   | furnace → forge → starforge → rift forge   | Ascended ingots and tier 12    |
  | Medicine | apothecary → laboratory                    | Panacea                        |
  | Fires    | campfire → hearth → kitchen                | A fire that needs no feeding   |

- **Research desk:** study an item to learn what it goes into (and, for a weapon, how it can evolve). Each study earns renown.
- **Mastery perks:** at mastery 10 each weapon family learns a move of its own. For example, spears get a leaping thrust from the air, blade finishers heal, the bow's fifth arrow is free and the staff looses an extra bolt. At mastery 20 the weapon glints in your hand.
- **Armour forge:** the Armoury has an Armour tab. Each piece levels to +5, takes gems in its sockets (two in a chestplate) and one infusion.
- **Compare:** each weapon's Armoury page compares it with the one in hand.

### Feats and titles

Sixty-three feats (Beasts › The Codex › Feats) record what the expedition has done. They fall into seven groups: hunting, great foes, wayfaring, survival, making, arms and renown. Each shows its progress. Completing one grants a small permanent perk and a title, such as _the Blooded_, _Walker of Worlds_ or _the Realmbreaker_. The title you choose to wear shows beside your renown on the HUD.

### Gear, potions, and crystals

- **Armour:** forty sets (copper, iron, silver, gold, the fourteen realm sets, the twelve archetype sets, steel, obsidian, hellstone, the four dungeon sets, myconite, starmetal, voidsteel). Each piece adds defense, and a full set adds a bonus: extra defense or damage, heat or cold immunity, regeneration, speed, or mana.
- **Accessories:** three can be worn at once, including double jumps, gliding, speed, regeneration, light, lava resistance and more.
- **Ranged weapons:** bows fire arrows (plain, fire, crystal), and staves spend mana: embers, bone shards, icicles, homing sun bolts, spores and void beams.
- **Healing:** healing draughts heal instantly and bring on a short potion sickness.
- **Buff potions:** swiftness, ironskin, regeneration, shine, delving, featherfall, fireward and wrath.
- **Crystals:** life crystals raise your health up to 300, and life fruit takes it to 400. Stars fall on clear surface nights, and five make a mana crystal.
- **Blocks:** dirt, stone, sand, ice, planks, stone, clay and sandstone bricks, glass, obsidian brick, and the stones of every dungeon and world can all be placed.

There are 467 recipes and 659 items (156 weapons), and 143 kinds of creature including 21 great bosses (plus the three Direwolves). The expedition chapters continue past the Effergy through every dungeon and world, to the Unmaker.

All diseases and treatments are fictional game mechanics, not medical advice.

## Tests

Run `npm test` with a recent Node.js release. It checks:

- the Training Grounds (its layout, lessons, brambles, portals, saving, and staying out of the Atlas), the tutorial, crafting and ore gates, illness, spoilage, offline saves, farming, side-view physics and mining;
- Effergy placement, Direwolf hunts, rewards and upgrades;
- the dungeons (loot, traps, guardians, altars and brick);
- boss fights and sigils, the Rift Gate, travel and portals home, and every dimension's walls, life and boss;
- the hotbar (digging, building and torches), armour and set bonuses, potions, buffs and crystals, bows, staves and mana, and monsters of the deep;
- survival: rot by temperature, the cold-storage ladder, melting ice, freshness stages, ailments that incubate, worsen, chain and pass off, exposure and injuries, meals and brackish water, and older records' diseases;
- the weapon hierarchy: a complete, ever-stronger grid, quality, the anvil and evolutions, family mechanics, infusions and gems, crossbows and tomes;
- generated realms: seeds, keys and tiers, furnishing, modifiers, hazards, bosses and relics, and saving an open realm;
- homes, doors, walls and hammers, settlers moving in and out, trade and coins, bed spawns, and the silver and gold tier;
- the Unmaker: its entrance, phases and cutscenes, how it grows harder, its aim and dodging, its shades, its death, its spoils, and saving mid-entrance;
- balance: time to kill for every band and family, bands gated in order, how long food keeps in the warm and in cold storage, and a night spent in the open;
- save migration from every earlier layout;
- the music and sound.

`npm run build` refreshes the offline browser bundle.

Typeface sources and licenses: [Pixelify Sans](https://github.com/eifetx/Pixelify-Sans), [Silkscreen](https://github.com/googlefonts/silkscreen), [EB Garamond](https://github.com/google/fonts/tree/main/ofl/ebgaramond) and [Caveat](https://github.com/google/fonts/tree/main/ofl/caveat).
