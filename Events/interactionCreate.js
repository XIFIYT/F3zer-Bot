const Discord = require("discord.js")
const ownerId = "778541824490602496";
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js")
const ticket = require('../Fonctions/ticket')
const loadDatabase = require("../Loaders/loadDatabase")
module.exports = async (bot, interaction) => {

   bot.db = await loadDatabase()

   if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {

      let entry = interaction.options.getFocused()

      if (interaction.commandName === "trivial") {


         let choices = bot.commands.filter(cmd => cmd.name.includes(entry))
         await interaction.respond(entry === "" ? bot.commands.map(cmd => ({ name: cmd.name, value: cmd.name })) : choices.map(choice => ({ name: choice.name, value: choice.name })))
      }

      if (interaction.commandName === "setstatus") {

         let choices = ["Listening", "Watching", "Playing", "Competing"]
         let sortie = entry.length ? choices.filter(cmd => cmd.includes(entry)) : choices

         await interaction.respond(entry === "" ? sortie.map(cmd => ({ name: cmd, value: cmd.toLowerCase() })) : sortie.map(c => ({ name: c, value: c.toLowerCase() })))

      }

      if (interaction.commandName === "setantispam") {

         let choices = ["on", "off"]
         let sortie = choices.filter(cmd => cmd.includes(entry))

         await interaction.respond(entry === "" ? sortie.map(cmd => ({ name: cmd, value: cmd.toLowerCase() })) : sortie.map(c => ({ name: c, value: c.toLowerCase() })))

      }
   }


   if (interaction.type === Discord.InteractionType.ApplicationCommand) {

      let command = require(`../Commandes/${interaction.commandName}.js`)

      if (command.ownerOnly && interaction.user.id != ownerId) return await interaction.reply({ content: 'Seul le développeur du bot peut utiliser cette commande !', ephemeral: true });

      command.run(bot, interaction, interaction.options, bot.db)



   }

	const ID = await ticket("TICKET");
   if (interaction.isButton()) {
          if (interaction.customId === 'close') {
        await interaction.channel.delete()
        
           const Embed = new EmbedBuilder()
           .setDescription("Details sur le ticket")
           .addFields(
         { name : "Auteur qui a ouvert le ticket", value : `<@${interaction.user.id}>`, inline :true},
         { name : "Auteur qui a fernet le ticket", value : `<@${interaction.user.id}>`, inline :true},
         { name : "ID de la personne", value : `\`\`\`yaml\n${interaction.client.user.id}\`\`\``, inline :true},
         { name : "Ticket ID", value : ` \`\`\`yaml\n${ID}\`\`\``, inline :true},)
         
         .setColor("#00FFFF")
         const button2 = new ButtonBuilder()
         .setLabel(`Support`)
         .setURL(`https://discord.gg/TTqvMNQX6V`)
         .setStyle(ButtonStyle.Link);
         const button3 = new ButtonBuilder()
         .setLabel(`Hebergeur`)
         .setURL(`https://discord.gg/cloudheaven`)
         .setStyle(ButtonStyle.Link);

     const row = new ActionRowBuilder()
         .addComponents(button2, button3);
         await interaction.user.send({ embeds: [Embed], components : [row] })
      }
      if (interaction.customId === 'openticket') {
         const Modal = new Discord.ModalBuilder()
            .setCustomId('ticketmodal')
            .setTitle('Plus d\informations sur votre ticket')

         const question1 = new Discord.TextInputBuilder()
            .setCustomId('question1')
            .setLabel('Plus d\'informations sur votre ticket !')
            .setPlaceholder('Merci de rentré votre sujet dans cette case... :')
            .setStyle(Discord.TextInputStyle.Paragraph)

         const first = new Discord.ActionRowBuilder().addComponents(question1)

         Modal.addComponents(first)

         await interaction.showModal(Modal)

         try {
            const reponse = await interaction.awaitModalSubmit({ time: 600000 });
            const utilisateur = interaction.user.id;
            const description = reponse.fields.getTextInputValue('question1');
            const embed = new Discord.EmbedBuilder()
               .setDescription(`**Description : \`\`\`${description}\`\`\`**`)

            bot.db.query(`SELECT * FROM serveur WHERE guild = '${interaction.guild.id}'`, async (err, req) => {
               if(err) {
                  console.log(err);
               }
               if (req.length < 1) {
                  reponse.reply({ content: "Le serveur n'est pas inscrit dans la base de donnée, merci d'en renseigner le fondateur", ephemeral: true });
               } else {
                  const ticketCategory = req[0].ticketCategory;
                  let categorie = await interaction.guild.channels.cache.get(ticketCategory);
                  if (!categorie) { categorie = interaction.guild.channels.cache.get(interaction.channel.parentId) };

                  let channel = await interaction.guild.channels.create({
                     name: `TICKET-${interaction.user.username}`,
                     type: 0,
                     parent: categorie,
                  });
                  await channel.permissionOverwrites.create(interaction.guild.id, {
                     ViewChannel: false,
                  });

                  await channel.permissionOverwrites.create(interaction.user.id, {
                     ViewChannel: true,
                     SendMessages: true,
                     ReadMessageHistory: true,
                     AttachFiles: true,
                     EmbedLinks: true,
                  });

                  await channel.permissionOverwrites.create(interaction.client.user.id, {
                     ViewChannel: true,
                     SendMessages: true,
                     ReadMessageHistory: true,
                     AttachFiles: true,
                     EmbedLinks: true,
                  });

                  bot.db.query(`SELECT * FROM tickets`, async () => {
                   bot.db.query(`INSERT INTO tickets(ticketID, userID, channelID) VALUES ('${ID}', '${interaction.user.id}', '${channel.id}')`);
                  });

                  const EmbedReply = new Discord.EmbedBuilder()
                     .setColor('Blue')
                     .setDescription(`**Votre texte s'est envoyé correctement.\n> ${channel}**`);

                  reponse.reply({ embeds: [EmbedReply], ephemeral: true });

                  const Row = new Discord.ActionRowBuilder()
                     .addComponents(new Discord.ButtonBuilder()
                        .setCustomId('close')
                        .setLabel('Fermer le ticket')
                        .setEmoji('🗑️')
                        .setStyle(Discord.ButtonStyle.Danger),
                     );


                  const EmbedCreateChannel = new Discord.EmbedBuilder()
                     .setColor('Blue')
                     .setTitle('Ticket Ouvert')
                     .setDescription(`> Voici votre ticket.\nNous espérons que vous nous avez tous détaillé dans la description lors de l'ouverture !`)
                     .setTimestamp()
                     .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) });

                  await channel.send({
                     content: `${interaction.user}`,
                     embeds: [EmbedCreateChannel],
                     components: [Row],
                  });

                  await channel.send({ embeds: [embed] });
               }
            })
         } catch (err) {
            console.error(err)
         }
      }
   }
}
