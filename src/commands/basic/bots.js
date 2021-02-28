const Command = require('../../structures/Command')

class BotsInfo extends Command {

  get name () {
    return 'bots'
  }

  get permissions () {
    return 0
  }

  get aliases () {
    return []
  }

  async run (msg, args) {
    let userID = args?.[0]?.replace(/[<@!>]/g, "")
    if(!userID) userID = msg.author.id
    let user
    // try eris's cache
    user = await this.client.users.get(userID)
    // Fetch from discord
    if(!user) user = await this.client.fetchUser(userID).catch(_ => {})
    // 404 User Error
    if(!user) return this.client.createMessage(msg.channel.id, {
      embed: new this.client.Util.Embed().setTitle('User not found').setColor(this.client.color)
    })
    // Check DBL Statistics for user
    const dblStatsFetch = await this.client.dblstats.getUsersBots(userID).catch(_ => {})
    const bots = dblStatsFetch?.bots
    // No bots for this user error
    if(!bots) return this.client.createMessage(msg.channel.id, {
      embed: new this.client.Util.Embed().setTitle('User has no bots.')
        .setDescription('If you you recently added your bot\nwait until the next hour hits.').setColor(this.client.color)
    })
    // Build initial embed
    const embed = new this.client.Util.Embed()
      .setAuthor(
        `${user.username}#${user.discriminator}'s bots`,
        'https://dblstats.com',
        `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`).setColor(this.client.color)

    // Build bot Listing
    bots.forEach(b => {
      embed.addField(b.name, `[View Here](https://dblstats.com/bot/${b.id})
Monthly Votes: ${b.monthly_votes} (#${b.monthly_votes_rank.toLocaleString()})
Total Votes: ${b.total_votes} (#${b.total_votes_rank.toLocaleString()})
Servers: ${b.server_count} (#${b.server_count_rank.toLocaleString()})
Shards: ${b.shard_count} (#${b.shard_count_rank.toLocaleString()})
`)
    })
    return this.client.createMessage(msg.channel.id, { embed: embed })
  }
}

module.exports = BotsInfo
