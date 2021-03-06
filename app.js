const config = require('./config/config.js');
const http = require('http');
const url = require('url');
const MailSender = require('./src/MailSender.js');
const RequestParametersParser = require('./src/RequestParametersParser.js');

const server = http.createServer();
const PORT = config.endpoint.port;
const ENDPOINT_PATH = config.endpoint.pathname;

server.on('request', (req, res) => {
    let endpointPathname = url.parse(req.url).pathname;
    if (endpointPathname === ENDPOINT_PATH) {
        RequestParametersParser.parse(req)
            .then(MailSender.sendMail, (error) => {
                res.writeHead(400, {'Content-type': 'text/plain'});
                res.end(`Email was not send, because of ${error}`);
            })
            .then(() => {
                res.writeHead(200, {'Content-type': 'text/plain'});
                res.end('OK');
            }, (error) => {
                res.writeHead(400, {'Content-type': 'text/plain'});
                res.end(`Email was not send, because of ${error}`);
            });
    } else {
        res.writeHead(400, {'Content-type': 'text/plain'});
        res.end('Bad endpoint request');
    }
});

server.listen(PORT, () => {
    console.log(`Server started on ${PORT} port`);
});
