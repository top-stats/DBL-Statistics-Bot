const fetch = require('node-fetch');
const DBLStatistics = require("dblstatistics.js");
const DBLStatsClient = new DBLStatistics(process.env.DBLSTATS_API_TOKEN)

module.exports = async function runCommand(body){

    var reply = {};

    if(!body.data.options || body.data.options.length < 2)
    {
        reply = {
            "type": 4,
            "data": {
                "tts": false,
                "content": "",
                "embeds": [{
                    "title": "Please give a Bot ID or Mention"
                }],
                "allowed_mentions": { "parse": [] }
            }
        }
    }

    const bot = await DBLStatsClient.getBot(body.data.options[1].value).catch(_ => {
        console.log("error catched by library");
        console.log(_);
    });

    console.log(`https://dblstatistics.com/bot/${body.data.options[1].value}/widget/${body.data.options[0].value}?width=1700&height=900&cache=${Math.ceil(Math.random()*1298723465876)}`);

    if(bot != undefined)
    {
        reply = {
            "type": 4,
            "data": {
            "tts": false,
            "content": "",
            "embeds": [{
                "title": `${bot.name}'s ${body.data.options[0].value}`,
                "color": 5793266,
                "image": {
                    "url": `https://dblstatistics.com/bot/${body.data.options[1].value}/widget/${body.data.options[0].value}?width=1700&height=900&backgroundColor=00000000&titleFontSize=55&labelFontSize=32&cache=${Math.ceil(Math.random()*1298723465876)}`
                }
            }],
            "allowed_mentions": { "parse": [] }
            }
        }
    }
    else{
        reply = {
            "type": 4,
            "data": {
            "tts": false,
            "content": "",
            "embeds": [{
                "title": `Bot does not appear to exist on DBL Stats`,

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
    .then(response => console.log("/graph: Request handled."));
}