// Set max listeners to stop it throwing a "possible memory leak" warning
process.setMaxListeners(250)
// Dependencies
const DBLStatistics = require('dblstatistics.js')
const Base = require('eris-sharder').Base
const { CommandHandler, EventHandler } = require('./modules')
const Util = require('./Util')
const config = require('../config.json')
const express = require('express');

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

    // ==== BOT WEB API ====

    const app = express();

    app.listen(config.env.PORT, config.HOST, () => {
      console.log(`Listening on ${config.HOST}:${config.PORT}`);
    });

    app.use(function (req, res, next) {
      const auth = req.headers.authorization;

      if (auth === config.tokens.DBLStatistics) req.master = true;

      if (!req.master) return res.status(401).json({ code: 401, message: 'You are unauthorized to use this endpoint' });

      next()
    });

    const roles = {
      'developer': '265125253443878912',
      'auctions': '556148669242408971',
      'moderator': '304313580025544704'
    };

    app.get('/', (req, res) => {
      res.status(200).json({ message: 'Hello uwu' })
    });

    app.get('/api/access/:role/:id', async (req, res) => {
      const role = req.params.role;
      const id = req.params.id;

      if (!(role && id)) return res.status(400).json({ code: 400, message: 'No role or id provided with params' });

      const guild = client.guilds.get(process.env.DBL_GUILDID);

      if (!guild) return res.status(404).json({ code: 404, message: 'Guild not found' });

      const foundRole = guild.roles.get(roles[role]);

      if (!foundRole) return res.status(404).json({ code: 404, message: 'Role not found' });

      const foundMember = guild.members.get(id) || (await guild.fetchMembers({ userIDs: [ id ] }))[0]

      if (!foundMember) return res.status(404).json({ code: 404, message: 'Member not found' });

      const hasRole = foundMember.roles.get(foundRole.id);

      if (hasRole) return res.status(200).json({ has_access: true });
      else res.status(401).json({ has_access: false });
    });

  }

  launch() {
    this.client.connect()
  }
}

module.exports = Bot
