# Wildlands: what's left

This file tracks the three-pillar plan: portals and realms, hard survival, and builds and meta progression.

- **Done:** milestones M1–M5 are finished and pushed:
  - the realm engine and the eight generated realms of Bands I–III;
  - the weapon hierarchy;
  - the survival overhaul;
  - renown, skills, mastery, the Codex and the relic shelf.
- **Still to do:** everything below, in the planned order.

## M6 · Bands IV–V and the Fractured Realms

Each new realm follows the Band I–III pattern. It needs:

- a template in `src/data/realms/`, with a hazard handled in `Pocket.update`;
- 5 mobs, an elite and a boss script in `Bosses.ts`;
- 2 tile kinds;
- a material, an armour set, 2 signature weapons, a relic and a trophy;
- a music track, a Codex page, and fragment and key recipes made from Band III spoils.

| Band | Realm                  | Hazard idea                                                  | Boss                  |
| ---- | ---------------------- | ------------------------------------------------------------ | --------------------- |
| IV   | Feverlands             | Every bite carries a disease; fever-dream makes the HUD lie  | Mother of Rot         |
| IV   | Sunken Observatory     | Low gravity; star pulses                                     | The Astronomer        |
| IV   | Gutter of Kings        | Cursed gold causes gold sickness; loot-heavy vaults          | The Pauper King       |
| V    | The Undertow           | Pressure and an air meter; needs a respirator or diving bell | The Leviathan (worm)  |
| V    | Emberheart             | Magma rises in cycles                                        | The Anvil God         |
| V    | Garden of Lost Seasons | The season shifts every few minutes                          | The Four-Faced Warden |

**The Fractured Realms:**

- Templates are spliced at random and the tiers never end: tier scaling continues past V, which needs an open-ended `MAX_TIER`.
- Fracture shards work as reroll and upgrade catalysts.
- Its boss is drawn from the boss pool and empowered.

**Weapon tier 12 (Fractured / Ascended):**

- Add the tier to `TIERS` in `src/data/weapons.ts`.
- Add its grid entries and recipes.

**Feats and achievements:**

- Write about 60 feats, each with a title and a small permanent perk.
- Build a journal page for them.
- Hook them into `Progress.record`.

## M7 · Balance and polish

**Balance sims:**

- Script a fight for each weapon tier and family against that band's boss.
- Assert that time-to-kill stays inside a target band.

**Survival tuning:**

- Measure how many minutes food lasts in each biome and storage tier.
- Retune the idle-night-exposure death spiral, which is currently hypothermia followed by pneumonia.

**Realm balance:**

- Check Band II and III monster and boss numbers against the gear available at each band.
- Check that fragment costs gate the bands in order.

**Onboarding and docs:**

- Add tooltips, and a short tutorial for realms, keys, the larder, ailments, skills and the Codex.
- Do a final README pass.

## Deferred from earlier milestones

**Survival (M3):**

- Clothing layers (under, mid and outer), with insulation, heat, waterproofing and durability, kept separate from armour.
- Durability and repair for tools, weapons and clothing at stations.
- More water treatment:
  - purification tablets;
  - a distiller for salt water;
  - waterskin tiers that hold more and resist freezing.
- More preservation crafts: a smoking rack, a canning kettle, and a cold cart or ice harvester for the ice supply chain.
- Nutrition groups (carbs and fats), and a malnutrition debuff for a monotonous diet.
- Rickets, from dark realms.
- Dark zones where lanterns burn fuel.

**Builds and meta (M4):**

- Station upgrade lines, where each step unlocks recipe tiers and better quality rolls:
  - workbench → tinker's bench → artisan bench;
  - furnace → forge → starforge → rift forge;
  - apothecary → laboratory;
  - campfire → hearth → kitchen.
- Pack upgrades (satchel → pack → expedition frame), with a carry-weight system that slows you when overloaded.
- Weapon-mastery family perks beyond stat bumps (for example, a leaping thrust at Spear 10), and cosmetic variants.
- A research desk that reveals recipes and upgrade paths by studying items.

**Weapons and armour (M2):**

- Enemy resistances by damage type, so that the choice of infusion matters per realm.
- Upgrade levels, infusions and sockets for armour, using the same systems as weapons.
- A compare view in the Armoury, showing DPS, reach and effects side by side.

**Realms (M1):**

- Port the Mycelial Deep to the template form (it is still a handcrafted dimension).
- Exploration extras:
  - lore tablets (Codex entries);
  - hidden vaults behind breakable walls;
  - wandering realm merchants.
- The missing modifiers: Toxic air (needs a respirator) and Silent (no music, and mobs hear you).
- More mob behaviours: burrow, split, tether, mirror, swarm and ranged kite. Band II–III mobs reuse the walker, flier and floater movement.
- Atlas completion percentages.

## Known rough edges from M5

- The Bone Marches mire tint is subtle in dark scenes, and could be made clearer.
- Saltglass rock dominates the underground of the Salt Flats, and could be thinned.
- Mirages give a little renown when killed. Consider excluding `mirage` and `tyrant_mirage` from kill records.
