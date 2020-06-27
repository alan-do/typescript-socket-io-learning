// interface user {
//   name: string,
//   age: number
// }
// class Client {
//   private socket: SocketIOClient.Socket
//   constructor() {
//     this.socket = io();
//     //reset to empty browser
//     this.socket.on("connect", function () {
//       console.log("connect")
//       document.body.innerHTML = ""
//     })
//     //put message disconnect and reload browser
//     this.socket.on("disconnect", function (message: any) {
//       console.log("disconnect " + message)
//       document.body.innerHTML += "Disconnected from Server : " + message + "<br/>"
//       location.reload();
//     })




//     this.socket.on("message", (message: any) => {
//       console.log(`this is client receive : ${message}`);
//       console.log(message)
//       document.body.innerHTML += message + "<br/>"
//       this.socket.emit("res", "emit from client")
//     })
//     this.socket.on("no-res", (message: any) => {

//       console.log(message)
//       document.body.innerHTML += message + "<br/>"

//     })
//     // this.socket.on("luckynumber", function (message: any) {
//     //   console.log(message)
//     //   document.body.innerHTML += message +"<br/>"
//     // })
//     // this.socket.on("winner", function (message: any) {
//     //   console.log(message)
//     //   document.body.innerHTML += message +"<br/>"
//     // })
//     // this.socket.on("message1", function (message: user) {
//     //   console.log(message)
//     //   document.body.innerHTML = message.name+ " "+message.age
//     // })
//     // this.socket.on("message2", function (message: any) {
//     //   console.log(message)
//     //   document.body.innerHTML = message
//     // })
//     this.socket.on("random", function (message: any) {
//       console.log(message)
//       document.body.innerHTML += "Winning number is " + message + "<br/>"
//     })

//   }
// }

// const client = new Client();
type ChatMessage = {
  message: string
  from: string
}

type ScreenName = {
  name: string
  abbreviation: string
}

type Player = {
  score: number
  screenName: ScreenName
}


class Client {
  private socket: SocketIOClient.Socket
  private player: Player

  constructor() {
    this.socket = io();

    this.socket.on("connect", function () {
      console.log("connect")
    })

    this.socket.on("disconnect", function (message: any) {
      console.log("disconnect " + message)
      location.reload();
    })

    this.socket.on("playerDetails", (player: Player) => {
      this.player = player
      $(".screenName").text(player.screenName.name)
      $(".score").text(player.score)
    })

    this.socket.on("chatMessage", (chatMessage: ChatMessage) => {
      $("#messages").append("<li><span class='float-right'><span class='circle'>" + chatMessage.from + "</span></span><div class='otherMessage'>" + chatMessage.message + "</div></li>")
      this.scrollChatWindow()
    })

    $(document).ready(() => {
      $('#messageText').keypress((e) => {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
          this.sendMessage()
          return false;
        }
      });
    })
  }

  private scrollChatWindow = () => {
    $('#messages').animate({
      scrollTop: $('#messages li:last-child').position().top
    }, 500);
    setTimeout(() => {
      let messagesLength = $("#messages li");
      if (messagesLength.length > 10) {
        messagesLength.eq(0).remove();
      }
    }, 500)
  }

  public sendMessage() {
    let messageText = $("#messageText").val();
    if (messageText.toString().length > 0) {

      this.socket.emit("chatMessage", <ChatMessage>{ message: messageText, from: this.player.screenName.abbreviation })

      $("#messages").append("<li><span class='float-left'><span class='circle'>" + this.player.screenName.abbreviation + "</span></span><div class='myMessage'>" + messageText + "</div></li>")
      this.scrollChatWindow()

      $("#messageText").val("");
    }
  }

  public showGame(id: number) {
    switch (id) {
      case 0:
        $("#gamePanel1").fadeOut(100)
        $("#gamePanel2").fadeOut(100)
        $("#gamePanel0").delay(100).fadeIn(100)
        break;
      case 1:
        $("#gamePanel0").fadeOut(100)
        $("#gamePanel2").fadeOut(100)
        $("#gamePanel1").delay(100).fadeIn(100)
        break;
      case 2:
        $("#gamePanel0").fadeOut(100)
        $("#gamePanel1").fadeOut(100)
        $("#gamePanel2").delay(100).fadeIn(100)
        break;
    }
  }
}

const client = new Client();