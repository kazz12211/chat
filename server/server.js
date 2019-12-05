const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const server = http.Server(app);
const socketio = require('socket.io');
const io = socketio(server);
const chatStore = require('./chat-store');
const TalkController = require('./db/db').TalkController;
const tc = new TalkController();

const port = process.env.PORT || 3000;

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({extended: true, limit: '20mb'}));
app.use(express.static(__dirname + '/../client/dist/client'));
app.use('/', require('./api/web'));
app.use('/api', require('./api/api'));

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });


    socket.on('join', message => {
        chatStore.join(message);
        socket.join(message.roomid);
        io.to(message.roomid).emit('message', {
            roomid: message.roomid,
            name: message.name,
            message: `${message.name}さんが入室しました`,
            id: message.id,
            timestamp: Date.now(),
            type: 'status'
        })
    });

    socket.on('disjoin', message => {
        chatStore.disjoin(message);
        socket.leave(message.roomid);
        io.to(message.roomid).emit('message', {
            roomid: message.roomid,
            name: message.name,
            message: `${message.name}さんが退室しました`,
            id: message.id,
            timestamp: Date.now(),
            type: 'status'
        });
    });

    socket.on('message', (message) => {
        console.log(message);
        tc.add(message.name, message.message, message.roomid).then(res => {
            const msg = {
                name: message.name, 
                message: message.message, 
                roomid: message.roomid, 
                id: message.id, 
                timestamp: Date.now(),
                type: 'message'
            }
            io.to(chatStore.getRoom(message.id)).emit('message', msg);
        }).catch(err => {
            console.error(err);
        });
    });
});

server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});