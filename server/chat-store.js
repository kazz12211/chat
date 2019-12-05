class ChatStore {
    constructor() {
        this.store = {};
    }

    join(message) {
        const userobj = {
            room: message.roomid,
            user: message.name
        };
        this.store[parseInt(message.id)] = userobj;
    }

    disjoin(message) {
        delete this.store[message.id];
    }

    getRoom(id) {
        console.log(JSON.stringify(id));
        console.log(this.store);
        return this.store[id].room;
    }
}

const store = new ChatStore();
module.exports = store;

