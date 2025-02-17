const fetch = require('node-fetch');

module.exports = function runCommand(body){

    //(2022-02-19 Marco): I ripped this code straight from V1, blame Luke for this

    const nextMonday = new Date()
    // checks if today isnt monday
    if (nextMonday.getDay() !== 1) {
        nextMonday.setDate(nextMonday.getDate() + (((8 - nextMonday.getDay()) % 7) || 7))
    }
    nextMonday.setHours(20)
    nextMonday.setMinutes(0)

    // checks if today isnt tuesday
    const nextTuesday = new Date()
    if (nextTuesday.getDay() !== 2) {
        nextTuesday.setDate(nextTuesday.getDate() + (((9 - nextTuesday.getDay()) % 7) || 7))
    }
    nextTuesday.setHours(20)
    nextTuesday.setMinutes(0)

    var object = {
        "type": 4,
        "data": {
        "tts": false,
        "content": "",
        "embeds": [{
            "title": "Auctions Information",
            "description": "You can find out more about Top.gg auctions on the [Auctions Support Article](https://support.top.gg/support/solutions/articles/73000508264-how-do-i-use-auctions-)",
            "color": 5793266,
            "fields": [
            {
                "name": "Next Auction starts at",
                "value": `<t:${Math.floor(nextTuesday.getTime() / 1000)}:f> (<t:${Math.floor(nextTuesday.getTime() / 1000)}:R>)`
            },
            {
                "name": "Current Auction ends at",
                "value": `<t:${Math.floor(nextMonday.getTime() / 1000)}:f> (<t:${Math.floor(nextMonday.getTime() / 1000)}:R>)`
            },
            {
                "name": "Ads from current auction start going live at",
                "value": `<t:${Math.floor(nextTuesday.getTime() / 1000)}:f> (<t:${Math.floor(nextTuesday.getTime() / 1000)}:R>)`
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
    .then(response => console.log("/auctions: Request handled."));
}