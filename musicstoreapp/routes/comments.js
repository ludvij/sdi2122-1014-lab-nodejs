const {ObjectId} = require("mongodb");

module.exports = (app, commentsRepository) => {
    app.post('/comments/:song_id', (req, res) => {
        let comment = {
            author: req.session.user,
            text: req.body.text,
            song_id: ObjectId(req.params.song_id)
        }
        commentsRepository.insertComment(comment)
            .then(() => {
                res.redirect('back')
            }).catch(error => {
                res.send("Se ha producido un error al añadir el comentario: " + error)
            })
    })
}