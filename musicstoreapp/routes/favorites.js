const {ObjectId} = require("mongodb");
module.exports = (app, songsRepository) => {
    app.get('/favorites/add/:song_id', (req, res) => {
        if (req.session.favorites == null) {
            req.session.favorites = []
        }
        songsRepository.findSong({_id: ObjectId(req.params.song_id)}, {})
            .then(song => {
                req.session.favorites.push({
                    song_id: req.params.song_id,
                    price: parseFloat(song.price),
                    title: song.title
                })
                res.redirect('back')
            }).catch(error => {
                res.send('Se ha producido un error al añadir una canción a favoritos: ' + error)
            })
    })
    app.get('/favorites', (req, res) => {
        let response = {
            favorites : req.session.favorites
        }
        res.render('favorites.twig', response)
    })
    app.get('/favorites/delete/:song_id', (req, res) => {
        let favs = req.session.favorites
        let index = favs.map(x => x.song_id).indexOf(req.params.song_id)
        favs.splice(index,1)
        console.log(req.session.favorites)
    })
}