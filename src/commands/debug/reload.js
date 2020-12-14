const Command = require('../../structures/Command')

class Reload extends Command {
  get name () {
    return 'reload'
  }

  get permissions () {
    return 'OWNER'
  }

  get aliases () {
    return []
  }

  async run (msg, args) {
    const category = args?.[0]
    const command = args?.[1]
    if (category === '--list') {
      const categories = []
      const reloadableCommands = await this.client.commandHandler.listReloadable()
      console.log(reloadableCommands)
      let commandsSuccessfullyReloaded = ''
      reloadableCommands.forEach(c => {
        if (c.split('/')[1] !== '' && !categories.includes(c.split('/')[0])) {
          const category = c.split('/')[0]
          categories.push(category)
          commandsSuccessfullyReloaded += `${category}/
+   ├───/ ${c}\n`
        } else {
          commandsSuccessfullyReloaded += `+   ├───> ${c}\n`
        }
      })
      return msg.channel.createMessage({
        embed: new this.client.Util.Embed()
          .setTitle('All reloadable commands.')
          .setDescription(`\`\`\`diff\n${commandsSuccessfullyReloaded}\`\`\``)
          .setColor(this.client.color)
      })
    }

    if (category && command) {
      const availableCategories = await this.client.commandHandler.listCategories()
      if (!availableCategories.includes(category)) {
        return msg.channel.createMessage({
          embed: new this.client.Util.Embed()
            .setTitle('Please give a valid category')
            .setColor(this.client.color)
        })
      }
      const commandReloaded = await this.client.commandHandler.reloadCommand(category, command)
      console.log(commandReloaded)
      msg.channel.createMessage({
        embed: new this.client.Util.Embed()
          .setTitle(`Reloaded ${category} command.`)
          .setColor(this.client.color)
      })
    } else if (category && !command) {
      const availableCategories = await this.client.commandHandler.listCategories()
      if (!availableCategories.includes(category)) {
        return msg.channel.createMessage({
          embed: new this.client.Util.Embed()
            .setTitle('Please give a valid category')
            .setColor(this.client.color)
        })
      }
      const commandsReloaded = await this.client.commandHandler.reloadCategory(category, command)
      let commandsSuccessfullyReloaded = `+${category}/\n`
      commandsReloaded.forEach(c => { commandsSuccessfullyReloaded += `+   ├───> ${c}\n` })
      msg.channel.createMessage({
        embed: new this.client.Util.Embed()
          .setTitle(`Reloaded ${category} commands.`)
          .setDescription(`\`\`\`diff\n${commandsSuccessfullyReloaded}\`\`\``)
          .setColor(this.client.color)
      })
    } else {
      const categories = []
      const commandsReloaded = await this.client.commandHandler.load(true)
      let commandsSuccessfullyReloaded = ''
      if (!category) {
        commandsReloaded.forEach(c => {
          if (c.split('/')[1] !== '' && !categories.includes(c.split('/')[0])) {
            const category = c.split('/')[0]
            categories.push(category)
            commandsSuccessfullyReloaded += `${category}/
+   ├───/ ${c}\n`
          } else {
            commandsSuccessfullyReloaded += `+   ├───/ ${c}\n`
          }
        })
      }
      return msg.channel.createMessage({
        embed: new this.client.Util.Embed()
          .setTitle('Reloaded all commands.')
          .setDescription(`\`\`\`diff\n${commandsSuccessfullyReloaded}\`\`\``)
          .setColor(this.client.color)
      })
    }
  }
}

module.exports = Reload