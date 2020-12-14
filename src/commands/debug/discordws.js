const Command = require('../../structures/Command')
const fetch = require('node-fetch')
const config = require('../../../config')

class DiscordStats extends Command {
  get name () {
    return 'discordWS'
  }

  get permissions () {
    return 'OWNER'
  }

  get aliases () {
    return ['gateway']
  }

  async run (msg, args) {
    const { session_start_limit: sessionStartLimit, shards, url } = await (await fetch('https://discord.com/api/v8/gateway/bot', {
      headers: {
        Authorization: `Bot ${config.tokens.BOT}`
      }
    })).json()
    const message = {
      embed: new this.client.Util.Embed()
        .setTitle('Bot Gateway Statistics')
        .setDescription(`
Gateway URL: \`${url}\`
Session Start Limit: \`${sessionStartLimit.remaining} / ${sessionStartLimit.total}\`
Recommended Shard Count: \`${shards}\`
Current Shard Count: \`${this.client.options.processOptions.shards} (${this.client.options.processOptions.clusters} Clusters)\`
`)
        .setColor(this.client.color)
    }
    return this.client.createMessage(msg.channel.id, message)
  }
}

module.exports = DiscordStats