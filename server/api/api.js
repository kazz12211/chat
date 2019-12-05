const express = require('express');
const router = express.Router();
const RoomController = require('../db/db').RoomController;
const rc = new RoomController();
const TalkController = require('../db/db').TalkController;
const tc = new TalkController();
const verifyToken = require('../security');

router.get('/rooms', verifyToken, (req, res) => {
    rc.list().then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send('Invalid request');
    });
});

router.get('/talks/:roomid', verifyToken, (req, res) => {
    tc.list(req.params.roomid).then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send('Invalid query');
    });
});

module.exports = router;
