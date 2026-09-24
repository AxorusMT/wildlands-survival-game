# Wildlands

A standalone, offline side-view survival crafting adventure. Open `index.html` in a modern desktop browser. The checked-in `dist/wildlands.js` bundle runs without a server, build step, account, or online service. Art, adaptive music, effects, and terrain are generated locally. The journal bundles EB Garamond and Caveat under the SIL Open Font License; their license texts are in `assets/fonts`.

## Development

TypeScript source is in `src/`. `src/main.ts` bundles the UI, audio, simulation, data, and renderer into `dist/wildlands.js` for the offline page. Run `npm install` once, then `npm run format`, `npm run typecheck`, `npm test`, and `npm run build` after changes. The compiler uses strict type checking. Gameplay rules are in `src/game/rules.ts`; world geometry and item data are in `src/data/`. The renderer is split into sky, terrain, resources, structures, actors, atmosphere, and drawing helpers under `src/renderer/`.

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

Stone → copper → iron → steel → obsidian. Tool tiers gate ore and hard ground. Nine biomes form a 10,800 × 1,920 side-view world with shifting elevation, cave entrances, and three winding underground passages. Copper comes from the forest, iron and coal from cold regions, sulfur from the desert and badlands, and obsidian from the badlands. Deer, wolves, boars, bats, and scorpions have distinct behavior and drops. There are 53 recipes and 88 items, including fishing gear, camp shelters, rain catchers, food preservation, protective clothing, lanterns, platforms, traps, and storage. A furnace smelts copper and iron; a forge makes steel and obsidian tools. Farm plots grow herb, wheat, or potato. An icebox supplied with mined ice slows nearby spoilage. The Effergy of Beasts is a costly forge craft; place it, open the **Beasts** folio, attune wolves, and complete hunts to summon each Direwolf. Only obsidian-tier or better weapons can damage a Direwolf. Existing version-one and version-two local saves are migrated when loaded.

All diseases and treatments are fictional game mechanics, not medical advice.

## Tests

Run `npm test` with a recent Node.js release. It checks the tutorial, crafting and ore gates, illness, spoilage, offline saves, farming, side-view physics, mining, new survival content, Effergy placement, boss summons, rewards, and upgrades. `npm run build` refreshes the offline browser bundle.

Typeface sources and licenses: [EB Garamond](https://github.com/google/fonts/tree/main/ofl/ebgaramond) and [Caveat](https://github.com/google/fonts/tree/main/ofl/caveat).
