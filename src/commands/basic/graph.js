const Command = require('../../structures/Command')

class Graph extends Command {

  get name () {
    return 'graph'
  }

  get permissions () {
    return 0
  }

  get aliases () {
    return []
  }

  async run (msg, args) {
    const botID = args?.[0].replace(/[<@!>]/g, '')
    if(!botID) return this.client.createMessage(msg.channel.id, {
      embed: new this.client.Util.Embed().setTitle('Please give a bot id').setColor(this.client.color)
    })
    const category = args?.[1]
    if (!category || ![
      'servers',
      'shards',
      'votes',
      'totalvotes'
    ].includes(category)) return this.client.createMessage(msg.channel.id, {
      embed: new this.client.Util.Embed()
        .setTitle('Please give a category')
        .setDescription(`Available Categories:
- \`servers\`
- \`shards\`
- \`votes\`
- \`totalvotes\``).setColor(this.client.color)
    })
    let bot
    // try eris's cache
    bot = await this.client.users.get(botID)
    // Fetch from discord
    if(!bot) bot = await this.client.fetchUser(botID).catch(_ => {})
    // 404 User Error
    if(!bot) return this.client.createMessage(msg.channel.id, {
      embed: new this.client.Util.Embed().setTitle('Bot not found').setColor(this.client.color)
    })
    // Check DBL Statistics for user
    const botInfo = await this.client.dblstats.getBot(botID).catch(_ => {})
    // No bots for this user error
    if(!botInfo) return this.client.createMessage(msg.channel.id, {
      embed: new this.client.Util.Embed().setTitle('Bot is not listed.')
        .setDescription('If you you recently added this bot\nwait until the next hour hits.').setColor(this.client.color)
    })
    const types = {
      servers: { api: 'servers', value: 'Server Count', obj: 'server_count' },
      shards: { api: 'shardCount', value: 'Shard Count', obj: 'shard_count' },
      votes: { api:'monthlyVotes', value: 'Monthly Vote Count', obj: 'monthly_votes' },
      totalvotes: { api: 'totalVotes', value: 'Total Vote Count', obj: 'total_votes' }
    }
    const embed = new this.client.Util.Embed()
      .setTitle(`${botInfo.name}'s ${types[category].value} Graph`)
      .setImage(`https://dblstatistics.com/bot/${botInfo.id}/widget/${types[category].api}?width=1500&height=700&backgroundColor=00000000&titleFontSize=55&labelFontSize=32&cache=${Math.ceil(Math.random()*32986457)}`,
        '', 2000, 700).setColor(this.client.color)
    this.client.createMessage(msg.channel.id, { embed: embed })
  }
}

module.exports = Graph
