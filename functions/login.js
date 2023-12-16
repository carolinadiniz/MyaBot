module.exports = (packet)=>{

    if (packet.t === "READY") {
        console.log(`-- Bot ${packet.d.user.username} inciado --`)
    }
    
    if (packet.t === "GUILD_CREATE") {
        console.log(`[🛜 conectando à ${packet.d.name}]`)
    }

}