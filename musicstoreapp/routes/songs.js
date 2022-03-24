
module.exports = function (app) {
    app.get("/songs", (req, res) => {
        let response = ""
        if (req.query.title != null && typeof (req.query.title) != "undefined")
            response = 'Titulo: '+ req.query.title + '<br>'
        if (req.query.author != null && typeof (req.query.author) != "undefined")
            response += 'Author: ' + req.query.author

        res.send(response)
    })
}