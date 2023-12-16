const municao = require('../json/municao.json')
const roles_js = require('../json/roles.json')
const ajuda = require("../functions/ajuda")

module.exports = (message, client) => {
    console.log(`[message][user: ${message.author.globalName}] ${message.content}`)

    if (message.content === "!ajuda") { ajuda(message); return }

    if (isNaN(message.content.split(" ")[0]) == true) return

    municaoArray = []
    Object.keys(municao).forEach( element => {
        municaoArray.push(municao[element].prefix)
    })
    if(!municaoArray.includes(message.content.split(" ")[1])) return

    // criando objeto
    obj_venda = {
        parceria: false,
        valorTotal: 0
    }

    temp_message = "";

    message.content.split(" + ").forEach(operacao => { // verifica se há mais de uma operação

        // formata informações
        temp_operacao = operacao.split(" ")
        user_quantidade = temp_operacao[0]
        user_prefix = temp_operacao[1].toLowerCase()
        user_parceria = temp_operacao[2]

        // insere informações
        if (temp_operacao.length == 3 && temp_operacao[2].toLowerCase() === "p") {
            obj_venda.parceria = true
        }

        if (isNaN(user_quantidade) == false) {

            Object.keys(municao).forEach(arma => {

                if (municao[arma].prefix === user_prefix) {

                    obj_venda[arma] = {
                        nome: municao[arma].nome,
                        valor_unitario: obj_venda.parceria ? municao[arma].preco - 100 : municao[arma].preco,
                        quant: parseInt(user_quantidade)
                    }
                    obj_venda[arma].subValor = user_quantidade * obj_venda[arma].valor_unitario

                    obj_venda.valorTotal += obj_venda[arma].subValor

                    temp_message += `
Munição: ${municao[arma].nome}
Quant: ${user_quantidade}
`
                }
            })
        }
    })

    // vefinindo vendedor
    obj_venda.vendedor = {
        globalName: message.author.globalName,
        nickName: client.guilds.cache.get(message.guildId).members.cache.get(message.author.id).nickname,
        id: message.author.id,
        cargo: {
            nome: "Nenhum",
            id: '04',
            porcentagem: 0.0
        }
    }

    roles_js.gerente.forEach(role => {
        message.member.roles.cache.forEach(roles => {
            if (role === roles.id) {
                obj_venda.vendedor.cargo = {
                    nome: "Gerente",
                    id: '03',
                    porcentagem: 0.25
                }
            }

        })
    })
    roles_js.sublider.forEach(role => {
        message.member.roles.cache.forEach(roles => {
            if (role === roles.id) {
                obj_venda.vendedor.cargo = {
                    nome: "Sublider",
                    id: '02',
                    porcentagem: 0.3
                }
            }
        })
    })

    // valor deposito
    obj_venda.valorDeposito = obj_venda.valorTotal - (obj_venda.valorTotal * obj_venda.vendedor.cargo.porcentagem)

    console.log(obj_venda)

    message.channel.messages.fetch(message.id)
        .then(msg => {
            msg.delete()
                .then(() => { console.log(`[venda][user: ${obj_venda.vendedor.globalName}] Mensagem deletada`) })
                .catch(error => { console.log(`[venda-error][user: ${obj_venda.vendedor.globalName}] Mensagem não deletada`); console.error(error)} );
        })
        .catch( error => {
            console.error(error)
        });


    message.channel.send(
        `
<@${obj_venda.vendedor.id}>
\`\`\`
${temp_message}
parceria: ${obj_venda.parceria == true ? "Sim" : "Não"}
Valor Venda: ${obj_venda.valorTotal}
Valor Deposito: ${obj_venda.valorDeposito}
Vendedor: @${obj_venda.vendedor.nickName === null ? obj_venda.vendedor.globalName : obj_venda.vendedor.nickName}
\`\`\``)
        .then(() => {
            console.log(`[venda][${obj_venda.vendedor.globalName}] Mensagem enviada`)
        })
        .catch(error => {
            console.log(`[venda-error][user: ${obj_venda.vendedor.globalName}] Mensagem não enviada`)
            console.error(error)
        })

}