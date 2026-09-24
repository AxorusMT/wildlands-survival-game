// Ids for nodes, animals, structures, and caches are unique across the whole session.
let nextId = 0;

export const uniqueId = () => ++nextId;

/** Makes sure new ids never collide with ids already present in a loaded record. */
export function reserveIds(highest: number) {
  nextId = Math.max(nextId, highest);
}
