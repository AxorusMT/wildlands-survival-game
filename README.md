# Wildlands

A standalone, offline side-view survival crafting adventure. Open `index.html` in a modern desktop browser. The checked-in `dist/wildlands.js` bundle runs without a server, build step, account, or online service. Art, adaptive music, effects, and terrain are generated locally. The journal bundles EB Garamond and Caveat under the SIL Open Font License; their license texts are in `assets/fonts`.

## Development

TypeScript source is in `src/`. `src/main.ts` bundles the UI, audio, simulation, data, and renderer into `dist/wildlands.js` for the offline page. Run `npm install` once, then `npm run format`, `npm run typecheck`, `npm test`, and `npm run build` after changes. The compiler uses strict type checking. Gameplay rules are in `src/game/rules.ts`; world geometry and item data are in `src/data/`. The renderer is split into sky, terrain, resources, structures, actors, atmosphere, and drawing helpers under `src/renderer/`.

## Music

The soundtrack is fifteen one-minute looping tracks, synthesised live by the browser. There are no audio files. Tracks are written as data in `src/audio/tracks/` using the small notation in `src/audio/score.ts`: melodies, chord progressions, arpeggios, bass patterns, drum grids, and filter or volume automation. Bar lines in a melody are checked when the track is built. `src/audio/instruments.ts` holds the General MIDI-style voices and drum kit. `src/audio/engine.ts` schedules notes ahead of the clock through a mixer with reverb, tempo-synced echo, sidechain ducking, and crossfades between tracks. `src/audio/scenes.ts` picks the track:

| Track                     | Plays                                     |
| ------------------------- | ----------------------------------------- |
| Wildlands                 | Main menu                                 |
| First Light on the Meadow | Meadow by day, and any temperate fallback |
| Salt Wind Waltz           | Coast by day                              |
| Under the Canopy          | Forest by day                             |
| Lanterns Out              | Meadow, coast, and forest at night        |
| Mire Shuffle              | Marsh                                     |
| Hoarfrost                 | Tundra, taiga, and alpine                 |
| Mirage Caravan            | Desert and badlands                       |
| Squall Line               | Any surface region during a storm         |
| Lantern Glow              | The upper mines                           |
| Crystal Dark              | The lower mines                           |
| Brimstone Forges          | Upper hell                                |
| Throne of Cinders         | Lower hell                                |
| Direwolf                  | An active Direwolf hunt                   |
| What the Wild Takes       | The death page                            |

Surface changes wait a moment before the music follows, so walking along a border does not flip tracks. The menu, boss, and death tracks cut in straight away. Music is muffled while the journal is open over the game.

## Controls

| Key / mouse                  | Action                                                          |
| ---------------------------- | --------------------------------------------------------------- |
| A / D or left / right arrows | Move                                                            |
| W, Space, or up arrow        | Jump or climb a cave shaft                                      |
| S or down arrow              | Descend a cave shaft or drop through a platform                 |
| E                            | Gather a nearby resource or use a structure                     |
| F or right click             | Strike an animal in front of you                                |
| R or left click solid ground | Mine a nearby tile                                              |
| G                            | Fish while near water with a fishing rod                        |
| J, I, or Tab                 | Open or close the animated journal                              |
| M                            | Open Field Notes and the world map                              |
| 1–5                          | Change journal pages                                            |
| Left click in the world      | Place the selected structure within reach                       |
| Esc                          | Open the journal as a pause menu, close it, or cancel placement |

Recipes are made from the **Recipes** page. Select **Details** to inspect a recipe. Structures are crafted into the pack, then placed by clicking nearby ground. Stand by a station to make its recipes. Use items, equip weapons, stow goods in a chest, and plant seeds from **Pack**. Open **Vitals** to see exposure, diagnosis, treatment, and the wash action. **Field Notes** contains the tutorial, expedition chapters, side elevation map, manual save, and return to menu. The main menu has an expedition guide and saved music and effects sliders.

The game automatically saves to browser local storage every 40 seconds and when returning to the menu or closing the page. **Continue field record** reloads it. Perishable food and water, icebox fuel, and campfire fuel age while the game is closed. A death lets you recover in the meadow with reduced loose supplies or load the last saved record.

For a quick starting route: gather wood, stone, and fiber in the meadow; make a stone axe and pickaxe; find flint and make a spear; place a campfire; collect water at a blue pool and boil it at the fire. The field task in the upper right follows this route live.

## Progression

Stone → copper → iron → steel → obsidian → hellstone. Tool tiers gate ore and hard ground. Nine wide biomes form a 30,000 × 4,480 side-view world. Each region has its own lie of the land (flat marsh and tundra, rolling meadow and forest, hilly taiga, alpine peaks, desert dunes, terraced badlands mesas), and each border has its own feature: a lagoon, a river valley, ridges, a frozen lake, an escarpment, and a canyon. Every slope stays walkable.

Below the surface the world descends through four layers, joined by ladder shafts. The **upper mines** hold three winding tunnels and the region's ores. The **lower mines** are blue-black deepstone (tier 3 pickaxe), with caverns, iron, crystal, and bats. **Upper hell** is scorched ash rock (tier 4) with pools of lava, sulfur, obsidian, and ember bats; its heat wears at your health. **Lower hell** is an open underworld of hellrock (tier 5) over lava lakes, where hellhounds hunt and hellstone glows in the rock. Without a **Cinder Ward** (obsidian, sulfur, hide, and ice at a forge) the heat kills within a minute, and lava burns even with one. Hellstone ingots make the Hellfire Blade.

The world changes as you work it. Chopped trees topple and leave stumps that slowly sprout and regrow; rock and ore veins break apart and are gone for good; plants are stripped and grow back. Whatever you break or kill drops its materials on the ground, and they fly to you when you walk near. Mined tiles stay mined, and saves record only the tiles you have changed. Copper comes from the forest, iron and coal from cold regions, sulfur from the desert and badlands, and obsidian from the badlands. Deer, wolves, boars, bats, and scorpions have distinct behavior and drops. There are 56 recipes and 92 items, including fishing gear, camp shelters, rain catchers, food preservation, protective clothing, lanterns, platforms, traps, and storage. A furnace smelts copper and iron; a forge makes steel and obsidian tools. Farm plots grow herb, wheat, or potato. An icebox supplied with mined ice slows nearby spoilage. The Effergy of Beasts is a costly forge craft; place it, open the **Beasts** folio, attune wolves, and complete hunts to summon each Direwolf. Only obsidian-tier or better weapons can damage a Direwolf. Existing local saves are migrated when loaded; records from the earlier, narrower world keep the pack, camp, and progress, and move to the same place in each wider region.

All diseases and treatments are fictional game mechanics, not medical advice.

## Tests

Run `npm test` with a recent Node.js release. It checks the tutorial, crafting and ore gates, illness, spoilage, offline saves, farming, side-view physics, mining, new survival content, Effergy placement, boss summons, rewards, and upgrades. `npm run build` refreshes the offline browser bundle.

Typeface sources and licenses: [EB Garamond](https://github.com/google/fonts/tree/main/ofl/ebgaramond) and [Caveat](https://github.com/google/fonts/tree/main/ofl/caveat).
