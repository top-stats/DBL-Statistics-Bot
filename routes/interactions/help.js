const fetch = require('node-fetch');

module.exports = function runCommand(body){

    var object = {
        "type": 4,
        "data": {
        "tts": false,
        "content": "",
        "embeds": [{
            "title": "Available Commands",
            "url": "https://dblstats.com",
            "color": 5793266,
            "fields": [
            {
                "name": "/help",
                "value": "Displays this help command.\nExample: `/help`"
            },
            {
                "name": "/botinfo [mention/id]",
                "value": "Gives info about a single bot.\nExample: `/botinfo 583807014896140293`"
            },
            {
                "name": "/top [category]",
                "value": "Get the top bots based on their statistics.\nExample: `/top"
            },
            {
                "name": "/bots [mention/id]",
                "value": "Get a user's bots.\nExample: `/bots 116930717241311236"
            },
            {
                "name": "/auctions",
                "value": "Get Top.gg's auctions support articles and timings.\nExample: `/auctions`"
            },
            {
                "name": "/graph [mention/id] [category]",
                "value": "Gives a graph of the bots specific counts over time.\nExample: `/graph 583807014896140293 servers`"
            }
            ]
        }],
        "allowed_mentions": { "parse": [] }
        }
    }

    fetch(`https://discord.com/api/v8/interactions/${body.id}/${body.token}/callback`, {
        method: 'POST',
        body: JSON.stringify(object),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => console.log("Request handled."));
}