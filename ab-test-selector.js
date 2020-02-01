import md5 from 'md5'

export default class ABTestSelector {
  constructor(config = {}) {
    this.setConfiguration(config)
  }

  getEnabled() {
    return this.enabled
  }

  setEnabled(enabled) {
    this.enabled = enabled
    return this.enabled
  }

  getConfiguration() {
    return {
      enabled: this.enabled,
      idIncludes: this.idIncludes,
      idExcludes: this.idExcludes,
      groupIncludes: this.groupIncludes,
      groupExcludes: this.groupExcludes,
    }
  }

  setConfiguration(config = {}) {
    this.enabled = config.enabled == null ? true : config.enabled
    this.idIncludes = config.idIncludes || ['ALL']
    this.idExcludes = config.idExcludes || []
    this.groupIncludes = config.groupIncludes || ['ALL']
    this.groupExcludes = config.groupExcludes || []
    return this.getConfiguration()
  }

  /**
   * @param id e.g. user id
   * @param group optional, e.g. group id
   */
  getAB(id, group) {
    if (this.enabled == null || !this.enabled) return 'A'

    if (this.idExcludes.includes(id) || (!this.idIncludes.includes('ALL') && !this.idIncludes.includes(id))) return 'A'

    if (group != null && (this.groupExcludes.includes(group) || (!this.groupIncludes.includes('ALL') && !this.groupIncludes.includes(group)))) return 'A'

    let ab = 0
    if (id != null) {
      const md5Hash = md5(id)
      ab = parseInt(md5Hash[md5Hash.length - 1], 16) % 2
    }

    return ab ? 'B' : 'A'
  }
}
