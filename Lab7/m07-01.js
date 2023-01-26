const url = require('url');
const fs = require('fs');

var rootPath;

const getContentType = ext => {
    switch (ext) {
        case 'html':
            return 'text/html;charset=utf-8';
        case 'css':
            return 'text/css';
        case 'js':
            return 'text/javascript';
        case 'png':
            return 'image/png';
        case 'docx':
            return 'application/msword';
        case 'json':
            return 'application/json';
        case 'xml':
            return 'application/xml';
        case 'mp4':
            return 'video/mp4';
        default:
            return null;
    }
}

const processStaticRequest = (request, response) => {
    if (request.method === 'GET') {
        let urlPath = url.parse(request.url).pathname;
        if (urlPath.match('^/.+\..+$')) {
            let path = `${rootPath}${urlPath}`;
            fs.access(path, fs.constants.R_OK, err => {
                if (err) {
                    response.writeHead(404, 'Resource not found');
                    response.end('Resource not found');
                } else {
                    let ext = path.substring(path.lastIndexOf('.') + 1);
                    let contentType = getContentType(ext);
                    if (contentType) {
                        response.writeHead(200, {'Content-Type': contentType});
                        fs.createReadStream(path).pipe(response);
                    } else {
                        response.writeHead(400, 'Bad request');
                        response.end('Bad request');
                    }
                }
            });
        }
    } else {
        response.writeHead(405, 'Method not allowed');
        response.end('Method not allowed');
    }
}

module.exports = root => {
    rootPath = root;
    return {processStaticRequest: processStaticRequest};
}
