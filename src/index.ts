// .env
import { config } from 'dotenv'
config()
// Imports
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js'
import events from './events';
import commandHandler from './commands'

const application = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
})

commandHandler.init()

application.on(Events.ClientReady, events.ready)
application.on(Events.InteractionCreate, events.interactionCreate)

application.login(process.env.DISCORD_TOKEN)