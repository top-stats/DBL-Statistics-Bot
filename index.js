require('eris-sharder/src/sharding/clustermanager').prototype.printLogo = (...args) => { }
const Sharder = require('eris-sharder').Master
const {
  tokens: { BOT },
  client: { clusterCount, shardCount }
} = require('./config')

new Sharder(BOT, '/src/Bot.js', {

  // Debugging options
  stats: true,
  debug: true,

  // Cluster / Shard Values
  clusters: clusterCount,
  shards: shardCount,

  // Webhook posting settings
  // webhooks: {
  //   shard: {
  //     id: '',
  //     token: ''
  //   },
  //   cluster: {
  //     id: '',
  //     token: ''
  //   }
  // },

  // Client Options
  clientOptions: {
    messageLimit: 150,
    defaultImageFormat: 'png',
    processOptions: {
      clusters: clusterCount,
      shards: shardCount
    }
  }
})

// Will use this for when posting to influx
// sharder.on('stats', stats => {
//   console.log(stats)
// })