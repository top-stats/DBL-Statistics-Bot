require('eris-sharder/src/sharding/clustermanager').prototype.printLogo = (...args) => { }
const InfluxDBHandler = require('./src/modules/influxDB')
const InfluxDB = new InfluxDBHandler()
const Sharder = require('eris-sharder').Master
const {
  tokens: { BOT },
  client: { clusterCount, shardCount }
} = require('./config')

const sharder = new Sharder(BOT, '/src/Bot.js', {

  // Debugging options
  stats: true,
  debug: true,
  statsInterval: 5000,

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
      shards: shardCount,
    }
  }
})

// Will use this for when posting to influx
sharder.on('stats', stats => {
  InfluxDB.post('statistics', {
    guilds: stats.guilds,
    users: stats.users,
    totalRam: stats.totalRam
  }).then(() => { console.log(`[--:--:--] Master    | Full cluster stats sent to influx.`) }).catch(console.log)
  if(stats.clusters.length > 0) {
    stats.clusters.forEach(c => {
      const clusterData = {
        clusterID: c.cluster,
        guilds: c.guilds,
        users: c.users,
        ram: c.ram,
        uptime: c.uptime
      }
      InfluxDB.post('cluster', clusterData, `cluster-${c.cluster}`).then(() => { console.log(`[--:--:--] Cluster ${c.cluster} | Data posted to influx.`) }).catch(console.log)
      if(c.shardsStats.length > 0) {
        c.shardsStats.forEach((s) =>{
          const shardData = {
            shardID: s.id,
            ready: s.ready,
            latency: s.latency,
            status: s.status
          }
          InfluxDB.post('shard', shardData, `shard-${s.id}`).then(() => { console.log(`[--:--:--] Cluster ${c.cluster} | Shard ${s.id} data posted to influx.`) }).catch(console.log)
        })
      }
    })
  }
})