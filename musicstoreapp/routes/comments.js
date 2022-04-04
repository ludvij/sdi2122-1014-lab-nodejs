const {ObjectId} = require('mongodb');
const {response} = require('express');

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
                res.send('Se ha producido un error al añadir el comentario: ' + error)
            })
    })
    app.post('/comments/delete/:id', (req, res) => {
        if (req.body.author !== req.session.user) {
            res.send('Solo se pueden borrar comentarios propios')
        } else {
            commentsRepository.deleteCommentById(ObjectId(req.params.id))
                .then(() => {
                    res.redirect('back')
                }).catch(error => {
                    res.send('Se ha producido un error al eliminar el comentario: ' + error)
                })
        }
    })
}