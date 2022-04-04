const {ObjectId} = require('mongodb');

module.exports = (app, songsRepository, commentsRepository) => {
    app.get('/songs', (req, res) => {
        let songs = [{
            'title': 'Blank space',
            'price': '1.2'
        }, {
            'title': 'See you again',
            'price': '1.3'
        }, {
            'title': 'Uptown Funk',
            'price': '1.1'
        }]
        let response = {
            seller: 'Tienda de canciones',
            songs: songs
        }
        res.render('shop.twig', response)
    })
    app.get('/shop', (req, res) => {
        let filter = {}
        let options  = {sort: {title: 1}}
        if (req.query.search != null && typeof(req.query.search) != 'undefined' && req.query.search !== '') {
            filter = { 'title' : {$regex : '.*' + req.query.search + '.*'}}
        }
        songsRepository.getSongs(filter, options).then(songs => {
            res.render('shop.twig', {songs: songs})
        }).catch(error => {
            res.send('Se ha producido un error al listar las canciones ' + error)
        })
    })
    app.get('/add', (req, res) => {
        let response = parseInt(req.query.num1) + parseInt(req.query.num2)

        res.send(response)
    })
    app.get('/songs/add', (req, res) => {
        res.render('songs/add.twig');
    })
    app.get('/songs/delete/:id', function (req, res) {
        let filter = {_id: ObjectId(req.params.id)};
        commentsRepository.deleteComments({song_id: ObjectId(req.params.id)}, {})
            .then(r =>{

            }).catch(error => {
                res.send('Se ha producido un error al eliminar la canción: ' + error)
        })
        songsRepository.deleteSong(filter, {}).then(result => {
            if (result == null || result.deletedCount == 0) {
                res.send("No se ha podido eliminar el registro");
            } else {
                res.redirect("/publications");
            }
        }).catch(error => {
            res.send("Se ha producido un error al intentar eliminar la canción: " + error)
        });
    })
    app.get('/songs/:id', (req, res) => {
        let filter = {_id: ObjectId(req.params.id)};
        let options = {};
        songsRepository.findSong(filter, options).then(song => {
            let filterComments = {song_id: ObjectId(req.params.id)}
            commentsRepository.getComments(filterComments, {})
                .then(comments => {
                    console.log(req.params.id + ' ' + filterComments.song_id)
                    let response = {
                        song: song,
                        comments : comments
                    }
                    res.render('songs/song.twig', response);
                }).catch(error => {
                    res.send('Se ha producido un error al buscar los comentarios: ' + error)
                })
        }).catch(error => {
            res.send('Se ha producido un error al buscar la canción ' + error)
        });
    })
    app.get('/publications', (req, res) => {
        let filter = {author: req.session.user}
        let options = {sort: {title: 1}}
        songsRepository.getSongs(filter, options)
            .then(songs => {
                res.render('publications.twig', {songs: songs})
            }).catch(error => {
            res.send('Se ha producido un error al listar las publicaciones del usuario: ' + error)
        })
    })
    app.post('/songs/add', (req, res) => {
        let song = {
            title: req.body.title,
            kind: req.body.kind,
            price: req.body.price,
            author: req.session.user
        }
        songsRepository.insertSong(song, (songId) => {
            if (songId == null) {
                res.send('Error al insertar canción')
            } else {
                if (req.files != null) {
                    let imagen = req.files.cover;
                    imagen.mv(app.get('uploadPath')+'/public/covers/'+songId+'.png', (err) => {
                        if (err) {
                            res.send('Error al subir la portada de la canción')
                        } else {
                            if (req.files.audio != null) {
                                let audio = req.files.audio;
                                audio.mv(app.get('uploadPath')+'/public/audios/'+songId+'.mp3', (err) => {
                                    if (err) {
                                        res.send('Error al subir el audio');
                                    } else {
                                        res.redirect('/publications')
                                    }
                                });
                            }
                        }
                    })
                } else {
                    res.send('Agregada la canción ID: ' + songId)
                }
            }
        })
    })
    app.get('/songs/edit/:id', (req, res) => {
        let filter = {_id: ObjectId(req.params.id)}
        songsRepository.findSong(filter, {})
            .then(song => {
                res.render('songs/edit.twig', {song: song})
            }).catch(error => {
                res.send('Se ha producido un error al recuperar la canción: ' + error)
            })
    })
    app.post('/songs/edit/:id', function (req, res) {
        let song = {
            title: req.body.title,
            kind: req.body.kind,
            price: req.body.price,
            author: req.session.user
        }
        let songId = req.params.id;
        let filter = {_id: ObjectId(songId)};
        //que no se cree un documento nuevo, si no existe
        const options = {upsert: false}
        songsRepository.updateSong(song, filter, options).then(result => {
            //res.send('Se ha modificado '+ result.modifiedCount + ' registro');
            step1UpdateCover(req.files, songId, function (result) {
                if (result == null) {
                    res.send('Error al actualizar la portada o el audio de la canción');
                } else {
                    res.redirect('/publications')
                }
            });
        }).catch(error => {
            res.send('Se ha producido un error al modificar la canción ' + error)
        });
    })
    function step1UpdateCover(files, songId, callback) {
        if (files && files.cover != null) {
            let image = files.cover;
            image.mv(app.get('uploadPath') + '/public/covers/' + songId + '.png', function (err) {
                if (err) {
                    callback(null); // ERROR
                } else {
                    step2UpdateAudio(files, songId, callback); // SIGUIENTE
                }
            });
        } else {
            step2UpdateAudio(files, songId, callback); // SIGUIENTE
        }
    }
    function step2UpdateAudio(files, songId, callback) {
        if (files && files.audio != null) {
            let audio = files.audio;
            audio.mv(app.get('uploadPath') + '/public/audios/' + songId + '.mp3', function (err) {
                if (err) {
                    callback(null); // ERROR
                } else {
                    callback(true); // FIN
                }
            });
        } else {
            callback(true); // FIN
        }
    }
}

