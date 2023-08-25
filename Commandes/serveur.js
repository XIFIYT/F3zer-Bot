const Discord = require("discord.js")


module.exports = {

    name: "serveur",
    description: "info serveur",
    utilisation: "/serveur",
    permission: "Aucune",
    dm: false,
    category: "informations",
    options: [],

    async run(client, interaction) {
        const securityLevel = interaction.guild.verificationLevel;
        let securityLevelText = '';

        switch (securityLevel) {
            case 0:
                securityLevelText = `Aucune`;
                break;
            case 1:
                securityLevelText = `Faible`;
                break;
            case 2:
                securityLevelText = `Moyen`;
                break;
            case 3:
                securityLevelText = `Élevée`;
                break;
            case 4:
                securityLevelText = `Très Élevée`;
                break;
        }
        const afkChannel = interaction.guild.afkChannel;
        const afkChannelName = afkChannel ? afkChannel : `\`aucun\``;
        const botMembers = interaction.guild.members.cache.filter(member => member.user.bot);
        const rulesChannel = interaction.rulesChannel;
        const rule = rulesChannel ? rulesChannel : `\`aucun\``;
        let embed = new Discord.EmbedBuilder()
            .setColor('#000000')
            .setTitle(` **Information sur le server \`${interaction.guild.name}\`**`)
            .setDescription(`
        
        ➞ **__Informations du Serveur__**
              **Nom du Server**  
            \`${interaction.guild.name}\`
              **ID**
             \`${interaction.guild.id}\`
              **Description** 
            \`${interaction.guild.description ? interaction.guild.description : `Aucune`}\`
              **Boost(s)** 
            \`${interaction.guild.premiumSubscriptionCount} (tier ${interaction.guild.premiumTier})\`
              **Badge** 
            \`Aucun\`
              **Protection du serveur** 
            \`${securityLevelText}\`
              **Date de Création**  
            <t:${Math.floor(interaction.guild.createdAt / 1000)}:F> (<t:${Math.floor(interaction.guild.createdAt / 1000)}:R>)\n
              **Membre(s)** 
            \`${interaction.guild.memberCount}\`
              **Bot(s)**  
            \`${botMembers.size}\`
              **Membres Totaux** 
            \`${interaction.guild.memberCount}/500000\`
              **Règlement** 
            ${rule}
              **AFK** 
            ${afkChannelName}
              **Nombre de Salons** 
             \`${interaction.guild.channels.cache.size}\`
              **Rôles** 
            \`${interaction.guild.roles.cache.size}\`
        `)
            .setTimestamp()
            .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))

        await interaction.reply({ embeds: [embed] })
    }
}
