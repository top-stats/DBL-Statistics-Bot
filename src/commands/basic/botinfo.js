const Command = require('../../structures/Command')

class BotInfoCommand extends Command {

  get name () {
    return 'botinfo'
  }

  get permissions () {
    return 0
  }

  get aliases () {
    return []
  }

  async run (msg, args) {
    const botID = args?.[0]?.replace(/[<@!>]/g, "")
    if(!botID) return this.client.createMessage(msg.channel.id, {
      embed: new this.client.Util.Embed().setTitle('Please give a bot id').setColor(this.client.color)
    })
    let bot
    // try eris's cache
    bot = await this.client.users.get(botID)
    // Fetch from discord
    if(!bot) bot = await this.client.fetchUser(bot).catch(_ => {})
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
    // Build initial embed
    const embed = new this.client.Util.Embed()
      .setAuthor(
        `Bot info for ${bot.username}`,
        'https://dblstats.com',
        `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png?size=1024`).setColor(this.client.color)
      .setDescription(`**[View Here](https://dblstats.com/bot/${bot.id})**
${botInfo.short_desc}`)
      .addField('Library', botInfo.lib || 'None specified', true)
      .addField('Prefix', botInfo.prefix, true)
      .addField('Total Votes', botInfo.total_votes, true)
      .addField('Monthly Votes', botInfo.monthly_votes, true)
      .addField('Shard Count', botInfo.shard_count, true)
      .addField('Server Count', botInfo.server_count, true)
      .setImage(`https://dblstatistics.com/bot/${botInfo.id}/widget/ranks?width=1700&height=900&cache=${Math.ceil(Math.random()*1298723465876)}`, null,1700, 900)
    return this.client.createMessage(msg.channel.id, { embed: embed })
  }
}

module.exports = BotInfoCommand