module.exports = (app) => {
    app.get('/authors/add', (req, res) => {
        let kinds = ['cantante', 'batería', 'guitarrista', 'teclista', 'bajista']
        let response = {
            kinds: kinds
        }
        res.render('authors/add.twig', response);
    })
    app.post('/authors/add', (req, res) => {
        let response = ''
        if (req.body.name != null && typeof (req.body.name) != 'undefined')
            response += 'Autor agregado: ' + req.body.name + '<br>'
        else
            response += 'Nombre no enviado en la petición'
        if (req.body.group != null && typeof (req.body.group) != 'undefined')
            response += 'Grupo: ' + req.body.group + '<br>'
        else
            response += 'Grupo no enviado en la petición'
        if (req.body.kind != null && typeof (req.body.kind) != 'undefined')
            response += 'Rol: ' + req.body.kind
        else
            response += 'Rol no enviado en la petición'

        res.send(response)
    })
    app.get('/authors', (req, res) => {
        let authors = [{
            'name': 'test name',
            'group': 'test group',
            'kind': 'cantante'
        },{
            'name': 'test name',
            'group': 'test group',
            'kind': 'batería'
        }, {
            'name': 'test name',
            'group': 'test group',
            'kind': 'guitarrista'
        },{
            'name': 'test name',
            'group': 'test group',
            'kind': 'bajista'
        },{
            'name': 'test name',
            'group': 'test group',
            'kind': 'teclista'
        }]
        let response = {
            authors: authors
        }
        res.render('authors/authors.twig', response)
    })
    app.get('/authors/filter/:filter', (req, res) => {
        let authors = [{
            'name': 'test name',
            'group': 'test group',
            'kind': 'cantante'
        },{
            'name': 'test name',
            'group': 'test group',
            'kind': 'batería'
        }, {
            'name': 'test name',
            'group': 'test group',
            'kind': 'guitarrista'
        },{
            'name': 'test name',
            'group': 'test group',
            'kind': 'bajista'
        },{
            'name': 'test name',
            'group': 'test group',
            'kind': 'teclista'
        }]

        let response = {
            authors: authors.filter(x => x.kind === req.params.filter)
        }
        res.render('authors/authors.twig', response)
    })
    app.get('/authors/*', (req, res) => {
        res.redirect('/authors')
    })
}