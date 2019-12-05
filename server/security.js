const jwt = require('jsonwebtoken');
const config = require('./config');

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }
    const token = req.headers.authorization.split(' ')[1];
    if(token === null) {
        return res.status(401).send('Unauthorized request');
    }
    const payload = jwt.verify(token, config.jwt.secretKey);
    if(!payload) {
        return res.status(401).send('Unauthorized request');
    }
    req.userId = payload.subject;
    next();
}

module.exports = verifyToken;    