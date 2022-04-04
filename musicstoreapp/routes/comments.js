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
    app.get('/comments/delete/:id', (req, res) => {
        commentsRepository.findComment({_id: ObjectId(req.params.id)}, {})
            .then(response => {
                if (response.author !== req.session.user) {
                    res.send('Solo se puede borrar un comentario propio')
                }
                else {
                    commentsRepository.deleteComment(response)
                        .then(() => {
                            res.redirect('back')
                        }).catch(error => {
                            res.send('Se ha producido un error al eliminar el comentario: ' + error)
                        })
                }
            }).catch(error => {
                res.send('Se ha producido un error al buscar el comentario: ' + error)
            })
    })
}