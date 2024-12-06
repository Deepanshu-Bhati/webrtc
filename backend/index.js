"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 3000 });
let serverSocket = null;
let receiverSocket = null;
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data, isBinary) {
        const message = JSON.parse(data);
        if (message.type === 'sender') {
            serverSocket = ws;
            console.log("sendercalled");
        }
        else if (message.type === 'receiver') {
            receiverSocket = ws;
            console.log("receiver called");
        }
        else if (message.type === 'createoffer') {
            if (ws !== serverSocket)
                return;
            console.log("createoffer");
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'createoffer', sdp: message.sdp }));
        }
        else if (message.type === 'createanswer') {
            if (ws !== receiverSocket)
                return;
            console.log("createanswer");
            serverSocket === null || serverSocket === void 0 ? void 0 : serverSocket.send(JSON.stringify({ type: 'createanswer', sdp: message.sdp }));
        }
        else if (message.type === 'icecandidate') {
            if (ws === serverSocket) {
                console.log("candiadateserver" + message.candidate);
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'icecandidate', candidate: message.candidate }));
            }
            else if (ws === receiverSocket) {
                console.log("candiadatereceiver" + message.candidate);
                serverSocket === null || serverSocket === void 0 ? void 0 : serverSocket.send(JSON.stringify({ type: 'icecandidate', candidate: message.candidate }));
            }
        }
    });
});
