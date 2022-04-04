const express = require('express');
const userSessionRouter = express.Router();

userSessionRouter.use((req, res, next) => {
    console.log('routerUsuarioSession');
    if ( req.session.user ) {
        // dejamos correr la petición
        next();
    } else {
        console.log('va a: ' + req.originalUrl);
        res.redirect('/users/login');
    }
});

module.exports = userSessionRouter;