const Command = require('../../structures/Command')

class Ping extends Command {
  get name () {
    return 'ping'
  }

  get permissions () {
    return 0
  }

  get aliases () {
    return ['pong']
  }

  async run (msg, args) {
    msg.channel.createMessage('PONG')
  }
}

module.exports = Ping
