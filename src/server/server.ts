import express from "express"
import path from "path"
import http from "http"
import socketIO from "socket.io"
import LuckyNumbersGame from "./luckyNumbersGame"
import RandomScreenNameGenerator from "./randomScreenNameGenerator"
import Player from "./player"

const port: number = 3000

class App {
    private server: http.Server
    private port: number

    private io: socketIO.Server
    private game: LuckyNumbersGame
    private randomScreenNameGenerator: RandomScreenNameGenerator
    private players: { [id: string]: Player } = {}

    constructor(port: number) {
        this.port = port

        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))
        app.use('/jquery', express.static(path.join(__dirname, '../../node_modules/jquery/dist')))
        app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist')))

        this.server = new http.Server(app)
        this.io = socketIO(this.server);

        this.game = new LuckyNumbersGame()

        this.randomScreenNameGenerator = new RandomScreenNameGenerator();

        this.io.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected : ' + socket.id)

            let screenName: ScreenName = this.randomScreenNameGenerator.generateRandomScreenName()

            this.players[socket.id] = new Player(screenName)

            socket.emit("playerDetails", this.players[socket.id].player)

            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id);
                if (this.players && this.players[socket.id]) {
                    delete this.players[socket.id]
                }
            });

            socket.on('chatMessage', function (chatMessage: ChatMessage) {
                socket.broadcast.emit('chatMessage', chatMessage)
            });
        })
    }

    public Start() {
        this.server.listen(this.port)
        console.log( `Server listening on port ${this.port}.` )
    }
}

new App(port).Start()