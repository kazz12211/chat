const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/chat');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

class Room {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Talk {
    constructor(id, name, message, timestamp, roomid, type) {
        this.id = id;
        this.name = name;
        this.message = message;
        this.timestamp = timestamp;
        this.roomid = roomid;
        this.type = type;
    }
}

class User {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

module.exports.Room = Room;
module.exports.Talk = Talk;
module.exports.User = User;

class RoomController {
    list() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Room ORDER BY name", (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(r => new Room(r.id, r.name)));
                }
            });
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Room where id=$id", { $id: id }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Room(res.id, res.name));
                }
            })
        });
    }
};

class TalkController {
    get(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Talk where id=$id", { $id: id }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Talk(res.id, res.name, res.message, new Date(res.timestamp), res.roomid, res.type));
                }
            });
        });
    }

    list(roomid) {
        return new Promise( (resolve, reject) => {
            db.all("SELECT * FROM Talk where roomid=$1", {$1: roomid}, (err, res) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(res.map(t => new Talk(t.id, t.name, t.message, new Date(t.timestamp), t.roomid, t.type)
                    ));
                }
            });
        });
    }

    add(name, message, roomid) {
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO Talk (name, message, timestamp, roomid, type) VALUES ($1, $2, $3, $4, $5)",
                { $1: name, $2: message, $3: new Date().getTime(), $4: roomid, $5: 'message' },
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({id: this.lastID});
                    }
                });
        });
    }

};

class UserController {
    get(email) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM User where email=$email", { $email: email }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if(!res) {
                        resolve();
                    } else {
                        resolve(new User(res.id, res.name, res.email, res.password));
                    }
                }
            });
        });
    }

    getById(id) {
        return new Promise( (resolve, reject) => {
            db.get('SELECT * FROM User WHERE id=$id', { $id: id}, (err, res) => {
                if(err) {
                    reject(err);
                } else {
                    if(!res) {
                        resolve();
                    } else {
                        resolve(new User(res.id, res.name, res.email, res.password));
                    }
                }
            });
        });
    }

    add(name, email, password) {
        return new Promise( (resolve, reject) => {
            this.get(email).then(user => {
                if(user) {
                    resolve();
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);
                    db.run(
                        "INSERT INTO User (name, email, password) VALUES ($1, $2, $3)",
                        { $1: name, $2: email, $3: hash },
                        function(err) {
                            if (err) {
                                reject(err);
                            } else {
                                const payload = {
                                    subject: this.lastID
                                };
                                const token = jwt.sign(payload, config.jwt.secretKey);
                                resolve({token});
                            }
                        });
                }
            }).catch(err => {
                console.error(err);
                resolve();
            });
        });
    }

    signin(email, password) {
        return new Promise( (resolve, reject) => {
            this.get(email).then(user => {
                if(!user) {
                    reject(new Error('Invalid email or password'));
                } else {
                    const userId = user.id;
                    const match = bcrypt.compareSync(password, user.password);
                    if(match) {
                        const payload = {
                            subject: userId
                        };
                        const token = jwt.sign(payload, config.jwt.secretKey);
                        resolve({token});
                    } else {
                        reject(new Error('Invalid email or password'));
                    }
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
};

module.exports.RoomController = RoomController;
module.exports.TalkController = TalkController;
module.exports.UserController = UserController;
