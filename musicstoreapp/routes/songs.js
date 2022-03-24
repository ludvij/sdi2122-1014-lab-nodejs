
module.exports = (app) => {
    app.get("/songs", (req, res) => {
        let response = ""
        if (req.query.title != null && typeof (req.query.title) != "undefined")
            response = 'Titulo: '+ req.query.title + '<br>'
        if (req.query.author != null && typeof (req.query.author) != "undefined")
            response += 'Author: ' + req.query.author

        res.send(response)
    })
    app.get('/add', (req, res) => {
        let response = parseInt(req.query.num1) + parseInt(req.query.num2)

        res.send(response)
    })
    app.get('/songs/:id', (req, res) => {
        let response = 'id: ' + req.params.id
        res.send(response)
    })
    app.get('/songs/:kind/:id', (req, res) => {
        let response = 'id: ' + req.params.id + '<br>'
            + 'Tipo de música: ' + req.params.kind
        res.send(response)
    })
}

