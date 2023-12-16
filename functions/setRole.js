const roles = require('../json/roles.json')
const cores = require('../json/cores.json')

module.exports = (client, guild_id, target_id, user) => {

    const guild = client.guilds.cache.get(guild_id)
    guild.members.fetch(target_id)
    .then( member => {

        rolesUser = []
        rolesStaff = roles.gerente.concat(roles.sublider)

        member.roles.cache.forEach(element => rolesUser.push(element.id))

        if (rolesStaff.some(element => rolesUser.includes(element))) {
            console.log(`${cores.red}[setRoles-error][user: ${user}] Não é possivel alterar o cargo deste usuário${cores.reset}`)

        } else {
            member.roles.add(roles.novato[0])
            console.log(`[setRoles   ][user: ${user}][concluído] Cargo alterado para Novato`)
        }
    })
    .catch( error => {
        console.error(`${cores.red}[setRoles-error][user: ${user}] Erro ao alterar o cargo${cores.reset}`)
        console.error(error)
    })
}