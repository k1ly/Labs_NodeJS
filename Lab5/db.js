var util = require('util');
var ev = require('events');

function DB() {
    this.db = [];
    this.find = id => this.db.find(e => e.id === id);
    this.add = entry => {
        if (this.find(entry.id))
            throw Error('Duplicated id');
        else this.db.push(entry);
    }
    this.update = (id, entry) => {
        let index = this.db.indexOf(this.find(id));
        if (index > -1)
            this.db[index] = entry;
        else throw Error('Entry does not exist');
    }
    this.remove = id => {
        let index = this.db.indexOf(this.find(id));
        if (index > -1)
            this.db.splice(index, 1);
        else throw Error('Entry does not exist');
    }
}

util.inherits(DB, ev.EventEmitter);

module.exports = {DB};