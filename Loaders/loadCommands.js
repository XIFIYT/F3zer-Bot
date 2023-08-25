const fs = require("fs")
const moment = require("moment")

module.exports = async (bot) => {

   fs.readdirSync("./Commandes").filter(f => f.endsWith(".js")).forEach(async file => {

      let command = require(`../Commandes/${file}`)
      if (!command.name || typeof command.name !== "string") throw new TypeError(`La commande ${file.slice(0, file.length - 3)} na pas de nom !`)
      bot.commands.set(command.name, command)
      console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] [ Commandes ] ${file} charge avec succes ! `)
   })
}

