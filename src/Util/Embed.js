class Embed {
  constructor () {
    /**
     * @returns {DiscordEmbed<Object>} A embed ready to be posted to discord.
     */
    this.title = ''
    this.description = ''
    this.type = 'rich'
    this.color = null
    this.url = ''
    this.fields = []
    this.image = {
      url: '',
      proxy_url: ''
    },
    this.author = {
      name: '',
      url: '',
      icon_url: '',
      proxy_icon_url: ''
    }
    this.footer = {
      text: '',
      icon_url: '',
      proxy_icon_url: ''
    }
  }

  /**
   * @param {String} url The url of the image you want to set
   * @param {String} proxy_url The proxy url of the image you want to set
   * @param {Number} width Width of the image
   * @param {Number} height Height of the image
   */
  setImage (url, proxy_url, width, height ) {
    this.image.url = url
    this.image.proxy_url = proxy_url
    this.image.width = proxy_url
    this.image.height = proxy_url
    return this
  }

  /**
   * @param {String} title The title of the embed
   */
  setTitle (title) {
    this.title = title
    return this
  }

  /**
   * @param {String} description The description of the embed
   */
  setDescription (description) {
    this.description = description
    return this
  }

  /**
   * @param {String} name The name of the embed field
   * @param {String} value The content the embed field will contain
   * @param {Boolean} inline Set whether the field will be inline or not
   */
  addField (name, value, inline = false) {
    this.fields.push({ name: name, value: value, inline: inline })
    return this
  }

  /**
   * @param {String} text Footer text
   * @param {String} iconURL Icon URL
   * @param {String} proxyURL Proxy Icon URL
   */
  setFooter (text, iconURL, proxyURL) {
    this.footer.text = text || 'undefined'
    this.footer.icon_url = iconURL || null
    this.footer.proxy_icon_url = proxyURL || null
    return this
  }

  /**
   * @param {String} name Author text
   * @param {String} iconURL URL author will link to.
   * @param {String} proxyURL Icon URL
   * @param {String} iconProxyURL Proxy Icon URL
   */
  setAuthor (name, url, iconURL, iconProxyURL) {
    this.author.name = name || 'undefined'
    this.author.url = url || null
    this.author.icon_url = iconURL || null
    this.author.proxy_icon_url = iconProxyURL || null
    return this
  }

  /**
   * @param {Number | String} color Set the color of the embed
   */
  setColor (color) {
    this.color = color
    return this
  }

  /**
   * @returns {Object} Outputs class values in JSON
   */
  toJSON () {
    return {
      ...this
    }
  }
}

module.exports = Embed