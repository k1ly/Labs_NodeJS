import express from 'express';
import fs from 'fs';

let app = express();
app.use('/', express.static('.'));

app.get('/', (req, res) => {
    let wasmCode = fs.readFileSync('./functions.wasm');
    let wasmModule = new WebAssembly.Module(wasmCode);
    let wasmInstance = new WebAssembly.Instance(wasmModule);
    res.type('html').send(
        '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
        '<title>30-03</title>' +
        '</head>' +
        '<body>' +
        `<p>sum(3, 4) = ${wasmInstance.exports.sum(3, 4)}</p>` +
        `<p>sub(3, 4) = ${wasmInstance.exports.sub(3, 4)}</p>` +
        `<p>mul(3, 4) = ${wasmInstance.exports.mul(3, 4)}</p>` +
        '</body>' +
        '</html>'
    )
})

app.listen(3000);