/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class KnightActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
  // the following, in order: data reset (to clear active effects),
  // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
  // prepareDerivedData().
    super.prepareData();
  }
  
  /** @override */
  prepareBaseData() {
  // Data modifications in this step occur before processing embedded
  // documents or derived data.
  }
  prepareDerivedData(){
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.Knight || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;

    // Make modifications to data here. For example:

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(data.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value - 10) / 2);
    }
  }

  /**
   * Prepare NPC type specific data
   */
  _prepareNpcData(actorData){
    if(actorData.type !=='npc') return;

    const data = actorData.data;
    data.xp = (data.cr * data.cr) * 100;
  }

  /**
   * Override getRollData()
   */
  getRollData(){
    const data = super.getRollData();

    //prepare character roll data
    this._getCharacterRollData(data);
    this._get.NpcRollData(data);

    return data;
  }

  /**
 * Prepare character roll data.
 */
_getCharacterRollData(data) {
  if (this.data.type !== 'character') return;

  // Copy the ability scores to the top level, so that rolls can use
  // formulas like `@str.mod + 4`.
  if (data.abilities) {
    for (let [k, v] of Object.entries(data.abilities)) {
      data[k] = foundry.utils.deepClone(v);
    }
  }

  // Add level for easier access, or fall back to 0.
  if (data.attributes.level) {
    data.lvl = data.attributes.level.value ?? 0;
  }
}

/**
 * Prepare NPC roll data.
 */
_getNpcRollData(data) {
  if (this.data.type !== 'npc') return;

  // Process additional NPC data here.
}

}