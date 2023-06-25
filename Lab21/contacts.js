import fs from 'fs';

class Contact {
    file;

    constructor(file) {
        this.file = file;
    }

    find = id => {
        let data = JSON.parse(fs.readFileSync(this.file).toString());
        return id ? data.find(e => e.id === id) : data;
    }

    create = contact => {
        let data = JSON.parse(fs.readFileSync(this.file).toString());
        contact.id = data.length + 1;
        data.push(contact);
        fs.writeFileSync(this.file, JSON.stringify(data, null, 2));
    }

    update = (id, contact) => {
        let data = JSON.parse(fs.readFileSync(this.file).toString());
        let entry = data.find(e => e.id === id);
        if (entry) {
            entry.name = contact.name;
            entry.phone = contact.phone;
        } else throw Error('Entry does not exist');
        fs.writeFileSync(this.file, JSON.stringify(data, null, 2));
    }

    destroy = id => {
        let data = JSON.parse(fs.readFileSync(this.file).toString());
        let entry = data.find(e => e.id === id);
        if (entry)
            data.splice(data.indexOf(entry), 1);
        else throw Error('Entry does not exist');
        fs.writeFileSync(this.file, JSON.stringify(data, null, 2));
    }
}

export default Contact;