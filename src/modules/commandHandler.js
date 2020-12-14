const { Base } = require('eris-sharder')
const glob = require('glob')
const fs = require('fs/promises')

class CommandHandler extends Base {
  /**
   * @param { Client } base Your bots client.
   */
  constructor (base) {
    super(base)
    this.load(false).catch(_ => {})
  }

  /**
   * @description List all command categories
   * @returns {Promise<Object>}
   */
  async listCategories () {
    return fs.readdir(`${process.cwd().replace(/[\\]+/g, '/')}/src/commands`)
  }

  /**
   * @returns { String } A tree of all reloadable things in the command folder
   */
  async listReloadable () {
    const outFiles = []
    console.log(outFiles)
    glob(`${process.cwd().replace(/[\\]+/g, '/')}/src/commands/**/*.js`, (_, files) => {
      files.map(f => outFiles.push(f.replace(process.cwd().replace(/[\\]+/g, '/'), '').replace('/src/commands/', '')))
    })
    await new Promise((resolve) => { setTimeout(() => { resolve() }, 200) })
    console.log(outFiles)
    return outFiles
  }

  /**
   * @param {String} category The category the command is in.
   * @param {String} commandName The commands name
   */
  async reloadCommand (category, commandName) {
    // Read Commands Directory, this starts the iteration of command reloads.
    const oldCommand = new (require(`${process.cwd().replace(/[\\]+/g, '/')}/src/commands/${category}/${commandName}.js`))(this)
    if (oldCommand.aliases) {
      oldCommand.aliases.forEach(alias => this.client.commands.set(alias.toLowerCase(), null))
    }
    delete require.cache[require.resolve(`${process.cwd().replace(/[\\]+/g, '/')}/src/commands/${category}/${commandName}.js`)]
    const command = new (require(`${process.cwd().replace(/[\\]+/g, '/')}/src/commands/${category}/${commandName}.js`))(this)
    this.client.commands.set(command.name.toLowerCase(), command)
    if (command.aliases) {
      command.aliases.forEach(alias => this.client.commands.set(alias.toLowerCase(), command))
    }
    return `${category}/${commandName}.js`
  }

  /**
   * @param {String} category The category name
   */
  async reloadCategory (category) {
    // Read Commands Directory, this starts the iteration of command reloads.
    let outFiles = []
    glob(`${process.cwd().replace(/[\\]+/g, '/')}/src/commands/${category}/*.js`, (_, files) => {
      for (let i = 0; i < files.length; i++) {
        const oldCommand = new (require(files[i]))(this)
        if (oldCommand.aliases) {
          oldCommand.aliases.forEach(alias => this.client.commands.set(alias.toLowerCase(), null))
        }
        delete require.cache[require.resolve(files[i])]
        const command = new (require(files[i]))(this)
        this.client.commands.set(command.name.toLowerCase(), command)
        if (command.aliases) {
          command.aliases.forEach(alias => this.client.commands.set(alias.toLowerCase(), command))
        }
      }
      outFiles = files
    })
    await new Promise((resolve) => { setTimeout(() => { resolve() }, 200) })
    return outFiles.map(f => f.replace(process.cwd().replace(/[\\]+/g, '/'), '').replace('/src/commands/', ''))
  }

  async load (options = { deleteCache: false, category: '', command: '' }) {
    // Read Commands Directory, this starts the first iteration of command checks.
    this.client.commands = new Map()
    let outFiles = []
    glob(`${process.cwd().replace(/[\\]+/g, '/')}/src/commands/**/*.js`, (_, files) => {
      for (let i = 0; i < files.length; i++) {
        if (options.deleteCache) delete require.cache[require.resolve(files[i])]
        const command = new (require(files[i]))(this)
        this.client.commands.set(command.name.toLowerCase(), command)
        if (command.aliases) {
          command.aliases.forEach(alias => this.client.commands.set(alias.toLowerCase(), command))
        }
        console.log(`Loaded [ ${command.name} ] with ${command.aliases.length} alias(s)`)
      }
      outFiles = files
    })
    await new Promise((resolve) => { setTimeout(() => { resolve() }, 200) })
    return outFiles.map(f => f.replace(process.cwd().replace(/[\\]+/g, '/'), '').replace('/src/commands/', ''))
  }
}

module.exports = CommandHandler