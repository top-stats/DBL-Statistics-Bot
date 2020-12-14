const Event = require('../structures/Event.js.js')

const { defaultPrefix, ownerOnly, owners } = require('../../config/clientOptions.json')

class MessageCreate extends Event {
  get name () {
    return 'messageCreate'
  }

  get once () {
    return false
  }

  async run (msg) {
    try {
      if (msg.author.bot) return
      if (ownerOnly && !owners.includes(msg.author.id)) return
      const prefix = msg.content.toLowerCase().substr(0, defaultPrefix.length)
      const args = msg.content
        .substr(defaultPrefix.length)
        .replace(/[ ]+/g, ' ').split(' ')
      const commandGiven = args.splice(0, 1)[0]?.toLowerCase()
      if (prefix === defaultPrefix) {
        const command = this.client.commands.get(commandGiven)
        // This is temporary
        if (!command) return
        if (command.permissions === 'OWNER' && !owners.includes(msg.author.id)) return
        await command.run(msg, args)
      }
    } catch (error) {
      this.emit('error', error)
    }
  }
}

module.exports = MessageCreate