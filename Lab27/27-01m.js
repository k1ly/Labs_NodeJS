import crypto from 'crypto';

export class ServerDH {
    diffieHellman;
    context

    constructor(aLength, g) {
        this.diffieHellman = crypto.createDiffieHellman(aLength, g);
        this.context = {
            p_hex: this.diffieHellman.getPrime('hex'),
            g_hex: this.diffieHellman.getGenerator('hex'),
            key_hex: this.diffieHellman.generateKeys('hex')
        };
    }

    createSecret = clientContext => this.diffieHellman.computeSecret(Buffer.from(clientContext.key_hex, 'hex'));
}

export class ClientDH {
    diffieHellman;
    context;

    constructor(serverContext) {
        let p = Buffer.from(serverContext.p_hex ?? '1111', 'hex');
        const g = Buffer.from(serverContext.g_hex ?? '1', 'hex');
        this.diffieHellman = crypto.createDiffieHellman(p, g)
        this.context = {
            p_hex: p.toString('hex'),
            g_hex: g.toString('hex'),
            key_hex: this.diffieHellman.generateKeys().toString('hex')
        };
    }

    createSecret = serverContext => this.diffieHellman.computeSecret(Buffer.from(serverContext.key_hex, 'hex'));
}