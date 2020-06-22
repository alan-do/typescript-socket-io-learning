"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const luckyNumbersGame_1 = __importDefault(require("./luckyNumbersGame"));
const port = 3000;
class App {
    constructor(port) {
        this.port = port;
        this.count = 0;
        const app = express_1.default();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
        this.server = new http_1.default.Server(app);
        this.io = socket_io_1.default(this.server);
        this.game = new luckyNumbersGame_1.default();
        this.io.on('connection', (socket) => {
            console.log('a user connected : ' + socket.id);
            //set random lucky number
            this.game.LuckyNumbers[socket.id] = Math.floor(Math.random() * 10);
            socket.emit("message", "Hello " + socket.id + ", your lucky number is " + this.game.LuckyNumbers[socket.id]);
            socket.broadcast.emit("message", "Everybody, say hello to " + socket.id);
            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id);
            });
            socket.on("res", (message) => {
                console.log(message);
                socket.emit("no-res", "emit from server");
            });
        });
        setInterval(() => {
            // set random number
            let randomNumber = Math.floor(Math.random() * 10);
            //check winners 
            let winners = this.game.GetWinners(randomNumber);
            //if exist winner => prints winner
            if (winners.length) {
                winners.forEach(w => {
                    this.count++;
                    this.io.to(w).emit("message", `You are winner  ${this.count} time`);
                });
            }
            //emit random number every second
            this.io.emit("random", randomNumber);
        }, 1000);
    }
    Start() {
        this.server.listen(this.port);
        console.log(`Server listening on port ${this.port}.`);
    }
}
new App(port).Start();
//# sourceMappingURL=server.js.map