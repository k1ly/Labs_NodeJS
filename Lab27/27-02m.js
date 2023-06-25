import crypto from 'crypto';

export class ServerSign {
    publicKey;
    privateKey;
    sign;

    constructor() {
        let {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {type: 'pkcs1', format: 'pem'},
            privateKeyEncoding: {type: 'pkcs1', format: 'pem'},
        })
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.sign = crypto.createSign('SHA256');
    }

    createSignContext = (rs, cb) => {
        rs.pipe(this.sign);
        rs.on('end', () => cb({
            signature: this.sign.sign(this.privateKey),
            publicKey: this.publicKey
        }));
    }
}

export class ClientVerify {
    verify;
    signContext;

    constructor(signContext) {
        this.signContext = signContext;
        this.verify = crypto.createVerify('SHA256');
    }

    verifySignature = (rs, cb) => {
        rs.pipe(this.verify);
        rs.on('end', () => cb(this.verify.verify(this.signContext.publicKey, this.signContext.signature, 'hex')));
    }
}