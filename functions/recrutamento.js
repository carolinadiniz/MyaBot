const setNickname = require('../functions/setNickname')
const setRole = require('../functions/setRole')
const roles = require('../json/roles.json')
const cores = require('../json/cores.json')
module.exports = (client, packet) => {

    allowedRoles = roles.gerente.concat(roles.sublider)


    if (!packet.d.member.roles.some(elemento => allowedRoles.includes(elemento)) && packet.d.user_id !== "175468439979163648") { 
        console.log(`[recrutamento-error][${packet.d.member.user.username}] Usuário não tem permissão para validar set!`)
        return
    }

    const guild_id = packet.d.guild_id
    const channel_id = packet.d.channel_id
    const message_author_id = packet.d.message_author_id
    const message_id = packet.d.message_id
    const username = packet.d.member.user.username

    const guild = client.guilds.cache.get(guild_id)
    const channel = guild.channels.cache.get(channel_id)
    
    channel.messages.fetch(message_id)
        .then( message => {
            console.log(`[recrutamento][user:${username}] mensagem encontrada`)

            if (message.content.split("\n").length != 3) return

            if (message.content.split(":").length != 4) return console.error(`${cores.red}[recrutamento-error][user:${username}] Formatação incorreta da mensagem${cores.reset}`)

            let user = {
                nome: "",
                id: "",
                recrutador: ""
            }

            message.content.split("\n").forEach( element => {
                let data = element.split(":")
                let atributo = data[0].toLowerCase().trim()
                let dado = data[1].trim()

                switch (atributo) {
                    case "nome":
                        user.nome = dado
                        break
                    case "id":
                        user.id = dado
                        break
                    case "recrutador":
                        user.recrutador = dado
                        break
                    default:
                        console.log("[pedir-ser-error] Dados inseridos estão incorretos")
                        break
                }
                
            })
            console.log(`[recrutamento][user:${username}] atributos definidos`)
            console.log(user)

            setNickname(client, guild_id, message_author_id, `${user.nome} | ${user.id}`, username)
            setRole(client, guild_id, message_author_id, username)
        })
}