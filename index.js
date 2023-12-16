const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./json/config.json')
const login = require('./functions/login')
const venda = require('./functions/venda')
const recrutamento = require('./functions/recrutamento')
const channelsid = require('./json/channels.json')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Channel]
})

client.on("messageCreate", message => {
    if (message.author.id === client.user.id) return;

    if (message.author.bot == true) return;

    if (channelsid.relatorio_vendas.includes(message.channelId)) venda(message, client);
    console.log("___")

})

client.on("raw", packet => {
    
    login(packet)

    if (packet.t !== "MESSAGE_REACTION_ADD") return;

    if (channelsid.pedir_set.includes(packet.d.channel_id)) recrutamento(client, packet)
})


client.login(config.token.mexico)