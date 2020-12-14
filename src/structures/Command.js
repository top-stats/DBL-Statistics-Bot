const Base = require('eris-sharder').Base

const error = {
  missingGetter: (name) => new TypeError(`Classes extending "Command" must have a getter "${name}"`),
  missingImplement: (name) => new TypeError(`Classes extending "Command" must implement "${name}" as async function`)
}

class Command extends Base {
  constructor (base) {
    super(base)
    if (this.constructor === Command) throw new TypeError('Abstract class "Command" cannot be instantiated directly')
    if (this.name === undefined) throw error.missingGetter('name')
    if (this.aliases === undefined) throw error.missingGetter('aliases')
    if (this.run?.constructor.name !== 'AsyncFunction') throw error.missingImplement('run')
  }

  get permissions () {
    return null
  }
}

module.exports = Command