const EventEmitter = require('events')
const config = require('../../config.json')

const Error = {
  missingName: new TypeError('Classes extending "Event" must have a getter "name"'),
  missingOnce: new TypeError('Classes extending "Event" must have a getter "once"'),
  missingRun: new TypeError('Classes extending "Event" must implement "run" as async function'),
  directInstantiated: new TypeError('Abstract class "Event" cannot be instantiated directly')
}

class Event extends EventEmitter {
  constructor (client) {
    super()
    this.client = client
    if (this.constructor === Event) throw Error.directInstantiated
    if (this.name === undefined) throw Error.missingName
    if (this.once === undefined) throw Error.missingOnce
    if (this.run?.constructor.name !== 'AsyncFunction') throw Error.missingRun
    this.on('error', (error) => console.error(error))
  }

  /**
   * @param { Message } msg Message Object
   * @param { Permission } perms Permission int
   * @returns Boolean
   */
  checkPerms (msg, perms) {
    if (!Array.isArray(perms)) perms = [perms]
    if (perms.includes('OWNER')) { return config.owners.includes(msg.author.id) }
    return msg.channel.permissionsFor(msg.member).has(perms)
  }

  exec (...args) {
    this.run(...args)
      .catch(error => this.emit('error', error))
  }
}

module.exports = Event