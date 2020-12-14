const { readdirSync } = require('fs')
const Base = require('eris-sharder').Base

class EventHandler extends Base {
  /**
   * @param { Client } base Your bots client
   */
  constructor (base) {
    super(base)
    this.events = new Map()
    this.build()
  }

  build () {
    const events = readdirSync(process.cwd().replace(/[\\]+/g, '/') + '/src/events')
    let index = 0
    for (let event of events) {
      if(event.includes('.md')) continue
      event = new (require(`../events/${event}`))(this.client)
      const exec = event.exec.bind(event)
      event.once ? this.client.once(event.name, event.exec.bind(event)) : this.client.on(event.name, exec)
      this.events.set(event.name, event)
      index++
    }
    process.send({ name: 'debug', msg: `Loaded ${index} client events` })
    this.client.events = this.events
    return this
  }
}

module.exports = EventHandler