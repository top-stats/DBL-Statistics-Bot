const Command = require('../../structures/Command')
const fetch = require('node-fetch')
const { client: { shardCount } } = require('../../../config')

class Ping extends Command {
  get name () {
    return 'ping'
  }

  get description () {
    return 'Pong'
  }

  get category () {
    return 'misc'
  }

  get aliases () {
    return []
  }

  get permissions () {
    return 0
  }

  async run (msg) {
    const embed = {
      author: {
        name: '|  Pong!',
        icon_url: msg.author.avatarURL
      },
      color: this.client.color
    }

    const apiStart = Date.now()
    let apiFin
    await fetch('https://discord.com/api/gateway').then(() => { apiFin = Date.now() })

    const now = Date.now()
    return msg.channel.createMessage({ embed }).then(pingMsg => {
      const end = Date.now()
      embed.description = `API Latency: \`${apiFin - apiStart}ms\`
      Message Roundtrip: \`${end - now}ms\`
      Websocket: \`${this.client.shards.values().next().value.latency}ms\`
      Shard ID: \`${(msg.channel.guild.id >> 22) % shardCount}\``
      pingMsg.edit({ embed })
    })
  }
}

module.exports = Ping
