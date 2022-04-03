
module.exports = (app, MongoClient) => {
    app.get("/songs", (req, res) => {
        let songs = [{
            "title": "Blank space",
            "price": "1.2"
        },{
            "title": "See you again",
            "price": "1.3"
        }, {
            "title": "Uptown Funk",
            "price": "1.1"
        }]
        let response = {
            seller: "Tienda de canciones",
            songs: songs
        }
        res.render("shop.twig", response)
    })
    app.get('/add', (req, res) => {
        let response = parseInt(req.query.num1) + parseInt(req.query.num2)

        res.send(response)
    })
    app.get('/songs/add', (req, res) => {
        res.render("add.twig");
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
    app.post('/songs/add', (req, res) => {
        let song = {
            title: req.body.title,
            kind: req.body.kind,
            price: req.body.price
        }
        MongoClient.connect(app.get('connectionString'), (err, dbClient) => {
            if (err) {
                res.send("Error de conexión: " + err);
            } else {
                const database = dbClient.db("musicStore");
                const collectionName = 'songs';
                const songsCollection = database.collection(collectionName);
                songsCollection.insertOne(song)
                    .then(result => res.send("canción añadida id: " + result.insertedId))
                    .then(() => dbClient.close())
                    .catch(err => res.send("Error al insertar " + err));
            }
        })
    })
}

