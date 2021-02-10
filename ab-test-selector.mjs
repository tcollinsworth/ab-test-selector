import md5 from 'md5'

export class ABTestSelector {
  constructor(config = {}) {
    // Below is order of evaluation precedence, first definitive resolution is returned
    this.setConfiguration({
      enabled: config.enabled == null ? true : config.enabled, // enable/disable A/B selection, false always returns A
      idBonly: config.idBonly || [], // ALL or specific ids/keys to always get B
      groupBonly: config.groupBonly || [], // ALL or specific group ids/keys to always get B
      idExcludes: config.idExcludes || [], // specific ids/keys to exclude from A/B, get A only
      idIncludes: config.idIncludes || ['ALL'], // ALL or specific ids/keys to include in A/B
      groupExcludes: config.groupExcludes || [], // specific group ids/keys to exclude from A/B, get A only
      groupIncludes: config.groupIncludes || ['ALL'], // ALL or specific groups ids/keys to include in A/B
    })
  }

  getEnabled() {
    return this.enabled
  }

  setEnabled(enabled) {
    this.enabled = enabled
    return this.enabled
  }

  getConfiguration() {
    // Below is order of evaluation precedence, first definitive resolution is returned
    return {
      enabled: this.enabled, // enable/disable A/B selection, false always returns A
      idBonly: Array.from(this.idBonly.keys()), // ALL or specific ids/keys to always get B
      groupBonly: Array.from(this.groupBonly.keys()), // ALL or specific group ids/keys to always get B
      idExcludes: Array.from(this.idExcludes.keys()), // specific ids/keys to exclude from A/B, get A only
      idIncludes: Array.from(this.idIncludes.keys()), // ALL or specific ids/keys to include in A/B
      groupExcludes: Array.from(this.groupExcludes.keys()), // specific group ids/keys to exclude from A/B, get A only
      groupIncludes: Array.from(this.groupIncludes.keys()), // ALL or specific groups ids/keys to include in A/B
    }
  }

  /**
  * Any parameters not passed will retain prior settings.
  */
  // Below is order of evaluation precedence, first definitive resolution is returned
  setConfiguration(config = {}) {
    this.enabled = config.enabled == null ? this.enabled : config.enabled // enable/disable A/B selection, false always returns A
    this.idBonly = new Set(config.idBonly || this.idBonly.keys()) // ALL or specific ids/keys to always get B
    this.groupBonly = new Set(config.groupBonly || this.groupBonly.keys()) // ALL or specific group ids/keys to always get B
    this.idExcludes = new Set(config.idExcludes || this.idExcludes.keys()) // specific ids/keys to exclude from A/B, get A only
    this.idIncludes = new Set(config.idIncludes || this.idIncludes.keys()) // ALL or specific ids/keys to include in A/B
    this.groupExcludes = new Set(config.groupExcludes || this.groupExcludes.keys()) // specific group ids/keys to exclude from A/B, get A only
    this.groupIncludes = new Set(config.groupIncludes || this.groupIncludes.keys()) // ALL or specific groups ids/keys to include in A/B
    return this.getConfiguration()
  }

  /**
   * @param id e.g. user id
   * @param group optional, e.g. group id
   */
  getAB(id, group) {
    if (this.enabled == null || !this.enabled) return 'A'

    if (this.idBonly.has('ALL') || (this.idBonly.has(id))) return 'B'

    if (this.groupBonly.has('ALL') || (group != null && this.groupBonly.has(group))) return 'B'

    if (this.idExcludes.has(id) || (!this.idIncludes.has('ALL') && !this.idIncludes.has(id))) return 'A'

    if (group != null && (this.groupExcludes.has(group) || (!this.groupIncludes.has('ALL') && !this.groupIncludes.has(group)))) return 'A'

    let ab = 0
    if (id != null) {
      const md5Hash = md5(id)
      ab = parseInt(md5Hash[md5Hash.length - 1], 16) % 2
    }

    return ab ? 'B' : 'A'
  }
}
