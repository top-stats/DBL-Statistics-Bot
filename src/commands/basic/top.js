const Command = require('../../structures/Command')

class DiscordStats extends Command {

  get name () {
    return 'top'
  }

  get permissions () {
    return 0
  }

  get aliases () {
    return []
  }

  async run (msg, args) {
    const category = args?.[0]
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
    const types = {
      servers: { api: 'servers', value: 'Server Count', obj: 'server_count' },
      shards: { api: 'shards', value: 'Shard Count', obj: 'shard_count' },
      votes: { api:'monthly votes', value: 'Monthly Vote Count', obj: 'monthly_votes' },
      totalvotes: { api: 'votes', value: 'Total Vote Count', obj: 'total_votes' }
    }
    const topBots = await this.client.dblstats.getTop(types[category].api, 12)
    const embed = new this.client.Util.Embed()
      .setTitle(`Top 12 Bots Sorted by ${types[category].value}`)
      .setColor(this.client.color)
    let i = 0
    topBots.forEach(b => {
      i++
      if(topBots.indexOf(b) > 11) return
      if(i === 2) {
        i = 0
        embed.addField('​', '​', true)
        embed.addField(`${topBots.indexOf(b)+1}) ${b.name}:`, `[${b[types[category].obj].toLocaleString()}](https://dblstats.com/bot/${b.id})`, true)
      } else {
        embed.addField(`${topBots.indexOf(b)+1}) ${b.name}:`, `[${b[types[category].obj].toLocaleString()}](https://dblstats.com/bot/${b.id})`, true)
      }
    })
    this.client.createMessage(msg.channel.id, { embed: embed })
  }
}

module.exports = DiscordStats
