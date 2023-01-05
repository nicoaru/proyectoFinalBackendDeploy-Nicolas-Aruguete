const { Router } = require("express")
const routerInfo = Router()



// 
routerInfo.get('/', async (req, res) => {
    const info = {
        pathEjecucion: process.execPath,
        sistemaOperativo: process.platform,
        processId: process.pid,
        nodeVersion: process.version,
        carpeta: process.cwd(),
        memoriaTotalReservada: process.memoryUsage.rss()
    }

    res.json(info)
})



module.exports = {routerInfo}
