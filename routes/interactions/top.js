const fetch = require('node-fetch');
const DBLStatistics = require("dblstatistics.js");
const DBLStatsClient = new DBLStatistics(process.env.DBLSTATS_API_TOKEN)

module.exports = async function runCommand(body){

    var reply = {};

    var sorting = "";
    var field = "";
    var sortingName = "";

    switch (body.data.options[0].value) {
        case "server_count":
            sorting = "servers";
            sortingName = "Server Count";
            field = "server_count"
            break;
        case "shard_count":
            sorting = "shards";
            sortingName = "Shard Count";
            field = "shard_count";
            break;
        case "monthly_votes":
            sorting = "monthly votes";
            sortingName = "Monthly Votes";
            field = "monthly_votes"
            break;
        case "total_votes":
            sorting = "total votes";
            sortingName = "Total Votes";
            field = "total_votes";
            break;
        default:
            break;
    }

    const bots = await DBLStatsClient.getTop(sorting, 12).catch(_ => {});
    const fields = [];

    for(i = 0;i < 12;i++)
    {
        fields[fields.length] = {
            "name": fields.length + 1 + ") " + bots[i].name + ":",
            "value": `[${bots[i][field].toLocaleString()}](https://dblstats.com/bot/${bots[i].id})`,
            "inline": true
        };
    }


    reply = {
        "type": 4,
        "data": {
        "tts": false,
        "content": "",
        "embeds": [{
            "title": `Top 12 Bots Sorted by ${sortingName}`,
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
    .then(response => console.log("/top: Request handled."));
}