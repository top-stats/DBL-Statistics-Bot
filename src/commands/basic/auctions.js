const Command = require('../../structures/Command')

class Auctions extends Command {
  get name () {
    return 'auctions'
  }

  get permissions () {
    return 0
  }

  get aliases () {
    return []
  }

  async run (msg, args) {
    const nextMonday = new Date()
    // checks if today isnt monday
    if (nextMonday.getDay() !== 1) {
      nextMonday.setDate(nextMonday.getDate() + (((8 - nextMonday.getDay()) % 7) || 7))
    }
    nextMonday.setHours(20)
    nextMonday.setMinutes(0)

    // checks if today isnt tuesday
    const nextTuesday = new Date()
    if (nextTuesday.getDay() !== 2) {
      nextTuesday.setDate(nextTuesday.getDate() + (((9 - nextTuesday.getDay()) % 7) || 7))
    }
    nextTuesday.setHours(20)
    nextTuesday.setMinutes(0)

    msg.channel.createMessage({
      embed: {
        color: this.client.color,
        description: `**Auctions information**
You can find out more about top.gg auctions on the [Auctions Support Article](https://support.top.gg/support/solutions/articles/73000508264-how-do-i-use-auctions-)

**Auctions Timing Update**
**Next Starts**: <t:${Math.floor(nextTuesday.getTime() / 1000)}:f> (<t:${Math.floor(nextTuesday.getTime() / 1000)}:R>)
**Next Ends**: <t:${Math.floor(nextMonday.getTime() / 1000)}:f> (<t:${Math.floor(nextMonday.getTime() / 1000)}:R>)
**Next Goes Live**: <t:${Math.floor(nextTuesday.getTime() / 1000)}:f> (<t:${Math.floor(nextTuesday.getTime() / 1000)}:R>)`
      }
    })
  }
}

module.exports = Auctions
