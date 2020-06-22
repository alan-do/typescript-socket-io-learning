import express from "express"
import path from "path"
import http from "http"
import socketIO from "socket.io"

const port: number = 3000

class App {
    private server: http.Server
    private port: number

    constructor(port: number) {
        this.port = port

        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))

        this.server = new http.Server(app);
        const io: socketIO.Server = socketIO(this.server);
        io.on('connection', function(socket: socketIO.Socket){
            console.log('user connnected :'+ socket.id);
            // console.dir(socket);
            
            socket.on('disconnect', function(){
                console.log('socket disconnected: '+socket.id);
                
            })
            
        })
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log( `Server listening on port ${this.port}.` )
        })
    }
}

new App(port).Start()