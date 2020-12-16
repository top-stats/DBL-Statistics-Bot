const Influx = require('influx')
const os = require('os')
const config = require('../../config.json')

class InfluxDBPoster {
  constructor() {
    this.influxClient = new Influx.InfluxDB({
      host: config.influxDBHost,
      database: 'dbl_bot_statistics',
      schema: [
        {
          measurement: 'statistics',
          fields: {
            guilds: Influx.FieldType.INTEGER,
            users: Influx.FieldType.INTEGER,
            totalRam: Influx.FieldType.INTEGER,
            clustersUp: Influx.FieldType.INTEGER,
            shardsUp: Influx.FieldType.INTEGER,
            latency: Influx.FieldType.INTEGER
          },
          tags: [
            'host'
          ]
        },
        {
          measurement: 'cluster',
          fields: {
            clusterID: Influx.FieldType.INTEGER,
            guilds: Influx.FieldType.INTEGER,
            users: Influx.FieldType.INTEGER,
            ram: Influx.FieldType.INTEGER,
            uptime: Influx.FieldType.INTEGER
          },
          tags: [
            'host'
          ]
        },
        {
          measurement: 'shard',
          fields: {
            shardID: Influx.FieldType.INTEGER,
            ready: Influx.FieldType.BOOLEAN,
            latency: Influx.FieldType.INTEGER,
            status: Influx.FieldType.STRING
          },
          tags: [
            'host'
          ]
        }
      ]
    })
  }

  post(type, data, host = 'discordBot') {
    return this.influxClient.writePoints([{
      measurement: type,
      tags: { host: host },
      fields: data
    }]).then(() => console.log('Posted')).catch(console.log)
  }
}

module.exports = InfluxDBPoster