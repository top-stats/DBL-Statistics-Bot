var express = require('express');
require("dotenv").config();
var { verifyKeyMiddleware } = require('discord-interactions');
var router = express.Router();

// Commands
const helpInteraction = require("./interactions/help.js");

/* Interactions counter */
router.post('/', verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY), function(req, res, next) {

  console.log(req.body);

  //Acknowledgement things
  if(req.body.type === 1)
  {
    var ACKobject = {
      "type": 1
    };
  
    res.statusCode = 200;
    res.contentType("application/json");
    res.send(JSON.stringify(ACKobject));
    return;
  }

  //Individual commands
  switch (req.body.data.name) {
    case "help":
      helpInteraction(req.body);
      break;
    default:
      break;
  }
})


module.exports = router;
