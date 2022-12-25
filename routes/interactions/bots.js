const fetch = require('node-fetch');
const DBLStatistics = require("dblstatistics.js");
const DBLStatsClient = new DBLStatistics(process.env.DBLSTATS_API_TOKEN)

module.exports = async function runCommand(body){

    var reply = {};

    console.log(body.data)

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
        return fetch(`https://discord.com/api/v8/interactions/${body.id}/${body.token}/callback`, {
            method: 'POST',
            body: JSON.stringify(reply),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => console.log("/bots: Request handled."));
    }

    const data = await DBLStatsClient.getUsersBots(body.data.options[0].value).catch(_ => {});

    var fields = [];

    data.bots.forEach(element => {
        fields[fields.length] = {
            "name": element.name,
            "value": `[View Here](https://dblstats.com/bot/${element.id})
            Monthly Votes: ${element.monthly_votes} (#${element.monthly_votes_rank})
            Total Votes: ${element.total_votes} (#${element.total_votes_rank})
            Servers: ${element.server_count} (#${element.server_count_rank})
            Shards: ${element.shard_count} (#${element.shard_count_rank})`
        }
    });

    reply = {
        "type": 4,
        "data": {
        "tts": false,
        "content": "",
        "embeds": [{
            "title": `${body.data.user.username}#${body.data.user.discriminator}'s bots`,
            "color": 5793266,
            "fields": fields
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
    .then(response => console.log("/bots: Request handled."));
}