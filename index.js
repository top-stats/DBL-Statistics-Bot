require('eris-sharder/src/sharding/clustermanager').prototype.printLogo = (...args) => { }
const InfluxDBHandler = require('./src/modules/influxDB')
const InfluxDB = new InfluxDBHandler()
const Sharder = require('eris-sharder').Master
const { isMaster } = require('cluster')
const TopGG = require('@top-gg/sdk')
const {
  tokens: { BOT, TOPGG },
  client: { clusterCount, shardCount }
} = require('./config')
const TopGGClient = new TopGG.Api(TOPGG)

const sharder = new Sharder(BOT, '/src/Bot.js', {

  // Debugging options
  stats: true,
  debug: true,
  statsInterval: 1000,

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

setInterval(async () => {
  if (isMaster) {
    const { stats } = sharder.stats
    const shardsUp = stats.clusters.map(c => c.shardsStats.filter(ss => ss.status === 'ready').length).reduce((a, b) => a + b, 0)
    if (stats.clusters.length === clusterCount && shardsUp === shardCount) {
      await TopGGClient.postStats({
        serverCount: stats.guilds,
        shardCount: shardCount
      })
    }
  }
}, 600000)

// Will use this for when posting to influx
// sharder.on('stats', stats => {
//   const shardsUp = stats.clusters.map(c => c.shardsStats.length).reduce((a,b) => a + b, 0)
//   const shardsAvgLatency = stats.clusters.map(c => c.shardsStats.map(s => s.latency).reduce((a,b) => a + b, 0)).reduce((a,b) => a + b, 0) / shardsUp
//   InfluxDB.post('statistics', {
//     guilds: stats.guilds,
//     users: stats.users,
//     totalRam: stats.totalRam,
//     clustersUp: parseInt(stats.clusters.length),
//     latency: isNaN(shardsAvgLatency) ? 0 : shardsAvgLatency,
//     // Get all shards and add the number together
//     shardsUp: shardsUp
//   }).catch(console.log)
//   if(stats.clusters.length > 0) {
//     stats.clusters.forEach(c => {
//       const clusterData = {
//         clusterID: c.cluster,
//         guilds: c.guilds,
//         users: c.users,
//         ram: c.ram,
//         uptime: c.uptime
//       }
//       InfluxDB.post('cluster', clusterData, `cluster-${c.cluster}`).catch(console.log)
//       if(c.shardsStats.length > 0) {
//         c.shardsStats.forEach(s =>{
//           // console.log(s)
//           const shardData = {
//             shardID: s.id,
//             ready: s.ready,
//             status: s.status,
//             latency: s.latency
//           }
//           InfluxDB.post('shard', shardData, `shard-${s.id}`).catch(console.log)
//         })
//       }
//     })
//   }
// })
