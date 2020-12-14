// Set max listeners to stop it throwing a "possible memory leak" warning
process.setMaxListeners(250)
// Dependencies
const DBLStatistics = require('dblstatistics.js')
const Base = require('eris-sharder').Base
const { CommandHandler, EventHandler } = require('./modules')
const Util = require('./Util')
const config = require('../config.json')

class Bot extends Base {
  constructor(base) {
    super(base)
    // Set bot embed color
    this.client.color = 7506394
    // Load Util
    this.client.Util = Util
    // Load commands
    this.client.commandHandler = new CommandHandler(this)
    // Event Handler
    this.client.eventHandler = new EventHandler(this)
    // Setup DBL Stats API handler
    this.client.dblstats = new DBLStatistics(config.tokens.DBLStatistics)
  }

  launch() {
    this.client.connect()
  }
}

module.exports = Bot
