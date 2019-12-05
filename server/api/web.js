const express = require('express');
const router = express.Router();
const UserController = require('../db/db').UserController;
const uc = new UserController();
const verifyToken = require('../security');

router.post('/signin', (req, res) => {
    const {email, password } = req.body;
    uc.signin(email, password).then(result => {
        res.send(result);
    }).catch(err => {
        res.status(400).send('Authentication failed');
    });
});

router.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    uc.add(name, email, password).then(result => {
        res.send(result);
    }).catch(err => {
        console.error(err);
        res.status(500).send('Database operation failed');
    });
});

router.get('/profile', verifyToken, (req, res) => {
    uc.getById(req.userId).then(user => {
        delete user['password'];
        res.send(user);
    }).catch(err => {
        console.error(err);
        res.status(500).send('Database operation failed');
    });
});

module.exports = router;