const Client = require('./clients');

class VNUSystemClient extends Client {
    constructor(){
        super("VNU_SYSTEM")
        return this
    }
}

const instance = new VNUSystemClient();
Object.freeze(instance);

module.exports = instance