// .env
import { config } from 'dotenv'
config()
// Imports
import { Client, GatewayIntentBits } from 'discord.js'
import events from './events';

const application = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
})

application.on('ready', events.ready)

application.login(process.env.DISCORD_TOKEN)