const jwt = require("jsonwebtoken");
const express = require('express');
const songAuthor = express.Router();
const songsRepository = require("../repositories/songsRepository");
const {ObjectId} = require("mongodb");
const path = require("path");

songAuthor.use((req, res, next) => {
    console.log('Song author')
    let token = req.headers['token'] || req.body.token || req.query.token;
    // token is not null, we already checked that

    let songId = path.basename(req.originalUrl);
    let filter = {_id: ObjectId(songId)};
    console.log(req.body)
    songsRepository.findSong(filter,{}).then(result => {
        if (req.user !== result.author) {
            res.status(401).send("You don't own this song")
        } else {
            res.user = req.user
            next();
        }
    }).catch(error => {
        res.status(500).send("Se ha producido un error al comprobar la autoría: " + error)
    })
})

module.exports = songAuthor;