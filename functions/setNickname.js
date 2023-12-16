const roles = require('../json/roles.json')
const cores = require('../json/cores.json')

module.exports = (client, guild_id, target_id, nickName, user) => {


    client.guilds.cache.get(guild_id).members.fetch(target_id)
    .then(member=> {

        
        rolesUser = []
        rolesStaff = roles.gerente.concat(roles.sublider)

        member.roles.cache.forEach(element => rolesUser.push(element.id))

        if (rolesStaff.some(element => rolesUser.includes(element))) {
            console.log(`${cores.red}[setNickname-error][user: ${user}] Não é possivel alterar o nickName deste usuário${cores.reset}`) 
        } else {
            member.setNickname(nickName)
            console.log(`[setNickname][user: ${user}][concluído] Nickname alterado para ${nickName}`)
        }
    })
    .catch(error => {
        console.error(`${cores.red}[setNickname-error][user: ${user}] Erro ao alterar nickname${cores.reset}`)
        console.error(error)
    })
}