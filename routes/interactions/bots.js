const fetch = require('node-fetch');
const DBLStatistics = require("dblstatistics.js");
const DBLStatsClient = new DBLStatistics(process.env.DBLSTATS_API_TOKEN)

module.exports = async function runCommand(body){

    var reply = {};

    const data = body.data.options 
        ? await DBLStatsClient.getUsersBots(body.data.options[0].value).catch(_ => {}) 
        : await DBLStatsClient.getUsersBots(body.member.user.id).catch(_ => {});

    var fields = [];
    console.log(data.bots[0])

    if(!data || data.bots.length < 1) {
        const title = body.data.options
            ? 'You have no bots.'
            : 'No bots found for that user.'

        reply = {
            "type": 4,
            "data": {
            "tts": false,
            "content": "",
            "embeds": [{
                "title": title,
                "color": 5793266
            }],
            "allowed_mentions": { "parse": [] }
            }
        }
    } else {
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
                "title": `${data.bots[0].owners[0].username}#${data.bots[0].owners[0].discriminator}'s bots`,
                "color": 5793266,
                "fields": fields
            }],
            "allowed_mentions": { "parse": [] }
            }
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