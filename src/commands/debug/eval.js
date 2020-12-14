const Command = require('../../structures/Command')
const { tokens } = require('../../../config')
const tokenArray = Object.values(tokens)
const util = require('util')

class Eval extends Command {
  get name () {
    return 'eval'
  }

  get aliases () {
    return ['eval', 'ev']
  }

  get permissions () {
    return 'OWNER'
  }

  trim (string, max) {
    return string.length > max ? string.slice(0, max) : string
  }

  async run (msg, args) {
    const code = args.join(' ')
    let res

    try {
      /* eslint-disable no-eval */
      res = await eval(code)
      res = util.inspect(res, { depth: 0 })
    } catch (error) {
      res = util.inspect(error, { depth: 0 })
    }

    // Filter tokens out
    tokenArray.forEach(t => {
      res = res.replace(
        new RegExp(t.replace('.', '\\.'), 'g'),
        '[REDACTED]')
    })

    const message = {
      embed: {
        name: 'output',
        description: `\`\`\`js\n${this.trim(res, 2000)}\`\`\``,
        color: 2131668
      }
    }

    return msg.channel.createMessage(message)
  }
}

module.exports = Eval