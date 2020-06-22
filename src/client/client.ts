interface user {
  name: string,
  age: number
}
class Client {
  private socket: SocketIOClient.Socket
  constructor() {
    this.socket = io();
    //reset to empty browser
    this.socket.on("connect", function () {
      console.log("connect")
      document.body.innerHTML = ""
    })
    //put message disconnect and reload browser
    this.socket.on("disconnect", function (message: any) {
      console.log("disconnect " + message)
      document.body.innerHTML += "Disconnected from Server : " + message + "<br/>"
      location.reload();
    })




    this.socket.on("message", (message: any) => {
      console.log(`this is client receive : ${message}`);
      console.log(message)
      document.body.innerHTML += message + "<br/>"
      this.socket.emit("res", "emit from client")
    })
    this.socket.on("no-res", (message: any) => {
    
      console.log(message)
      document.body.innerHTML += message + "<br/>"

    })
    // this.socket.on("luckynumber", function (message: any) {
    //   console.log(message)
    //   document.body.innerHTML += message +"<br/>"
    // })
    // this.socket.on("winner", function (message: any) {
    //   console.log(message)
    //   document.body.innerHTML += message +"<br/>"
    // })
    // this.socket.on("message1", function (message: user) {
    //   console.log(message)
    //   document.body.innerHTML = message.name+ " "+message.age
    // })
    // this.socket.on("message2", function (message: any) {
    //   console.log(message)
    //   document.body.innerHTML = message
    // })
    this.socket.on("random", function (message: any) {
      console.log(message)
      document.body.innerHTML += "Winning number is " + message + "<br/>"
    })

  }
}

const client = new Client();