const Command = require('../../structures/Command')
const fetch = require('node-fetch')
const config = require('../../../config')

class Help extends Command {
  get name () {
    return 'help'
  }

  get permissions () {
    return 0
  }

  get aliases () {
    return ['gateway']
  }

  async run (msg, args) {
    const embed = new this.client.Util.Embed()
      .setTitle('Available Commands')
      .addField(
        `${config.prefix}help`,
        `Displays this help command
Example: \`${config.prefix}help\``)
      .addField(
        `${config.prefix}botinfo [mention / id]`,
        `Gives info about a single bot 
Example: \`${config.prefix}botinfo 583807014896140293\``)
      .addField(
        `${config.prefix}top [category]`,
        `Get the top bots based on their counts 
Example: \`${config.prefix}top servers\``)
      .addField(
        `${config.prefix}bots [mention / id]`,
        `Get a user's bots 
Example: \`${config.prefix}bots 116930717241311236\``)
      .addField(
        `${config.prefix}graph [mention / id] [category]`,
        `Gives a graph of the bots specific count over time.
Example: \`${config.prefix}graph 583807014896140293 servers\``)
      .setColor(this.client.color)

      .setFooter('© DBL Statistics | https://dblstats.com', this.client.user.avatarURL, '')
    return this.client.createMessage(msg.channel.id, {embed: embed})
  }
}

module.exports = Help