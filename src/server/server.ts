import express from "express"
import path from "path"
import http from "http"
import socketIO from "socket.io"
import LuckyNumbersGame from "./luckyNumbersGame"

const port: number = 3000

class App {

    private server: http.Server
    private port: number
    private count
    private io: socketIO.Server
    private game: LuckyNumbersGame

    constructor(port: number) {
        this.port = port
        this.count =0;
        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))

        this.server = new http.Server(app)
        this.io = socketIO(this.server);

        this.game = new LuckyNumbersGame()

        this.io.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected : ' + socket.id)

            //set random lucky number
            this.game.LuckyNumbers[socket.id] = Math.floor(Math.random() * 10)

            socket.emit("message", "Hello " + socket.id + ", your lucky number is " + this.game.LuckyNumbers[socket.id]);

            socket.broadcast.emit("message", "Everybody, say hello to " + socket.id)

            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id);
            })
            socket.on("res", (message: any)=>{
                console.log(message);
                socket.emit("no-res", "emit from server")
            })
        
        })
        
       
        setInterval(() => {
            // set random number
            let randomNumber: number = Math.floor(Math.random() * 10)
            //check winners 
            let winners = this.game.GetWinners(randomNumber);
            //if exist winner => prints winner
            if (winners.length) {
                winners.forEach(w => {
                    this.count ++;
                    this.io.to(w).emit("message", `You are winner  ${this.count} time`); 
                })
            }
            //emit random number every second
            this.io.emit("random", randomNumber)
        }, 1000)
    }

    public Start() {
        this.server.listen(this.port)
        console.log(`Server listening on port ${this.port}.`)
    }

}

new App(port).Start()