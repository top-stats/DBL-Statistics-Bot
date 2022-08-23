const fetch = require('node-fetch');
const DBLStatistics = require("dblstatistics.js");
const DBLStatsClient = new DBLStatistics(process.env.DBLSTATS_API_TOKEN)

module.exports = async function runCommand(body){

    var reply = {};

    if(!body.data.options)
    {
        reply = {
            "type": 4,
            "data": {
                "tts": false,
                "content": "",
                "embeds": [{
                    "title": "Please give a Bot ID"
                }],
                "allowed_mentions": { "parse": [] }
            }
        }
    }

    const bot = await DBLStatsClient.getBot(body.data.options[0].value).catch(_ => {});

    reply = {
        "type": 4,
        "data": {
        "tts": false,
        "content": "",
        "embeds": [{
            "title": `Bot Info for ${bot.name}`,
            "description": `**[View ${bot.name} on DBL Stats](https://dblstats.com/bot/${bot.id})**\n${bot.short_desc}`,
            "color": 5793266,
            "image": {
                "url": `https://dblstatistics.com/bot/${bot.id}/widget/ranks?width=1700&height=900&cache=${Math.ceil(Math.random()*1298723465876)}`
            },
            "fields": [
                {
                    "name": "Prefix",
                    "value": `${bot.prefix}`,
                    "inline": true
                },
                {
                    "name": "Total Votes",
                    "value": `${bot.total_votes}`,
                    "inline": true
                },
                {
                    "name": "Monthly Votes",
                    "value": `${bot.monthly_votes}`,
                    "inline": true
                },
                {
                    "name": "Shard Count",
                    "value": `${bot.shard_count}`,
                    "inline": true
                },
                {
                    "name": "Server Count",
                    "value": `${bot.server_count}`,
                    "inline": true
                }
            ]
        }],
        "allowed_mentions": { "parse": [] }
        }
    }

    fetch(`https://discord.com/api/v8/interactions/${body.id}/${body.token}/callback`, {
        method: 'POST',
        body: JSON.stringify(reply),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => console.log("/botinfo: Request handled."));
}