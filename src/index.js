const path = require("path")
const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage, generateLocationMessage } = require("./utils/messages")

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, "../public")

// server gets files from static folder /public
app.use(express.static(publicDirPath))

// when new client is connected
io.on("connection", socket => {
    console.log("+++ New socket connection. +++")

    // io.emit => to EVERYONE
    // socket.on =>  to SINGLE client that refers to ...
    // socket.broadcast.emit => to EVERYONE EXCEPT ME


    socket.on("join", ({ username, room }) => {
        // .join() connet to the room name argument
        // emiting events for just that room
        socket.join(room)

        //io.to.emit => to everybody in a specific room.
        //socket.broadcast.to.emit => all in a room, excepts sender.

        socket.emit("message", generateMessage("Welcome!"))
        socket.broadcast.to(room).emit("message", generateMessage(`${username} has joined the ${room} room.`))
    })

    socket.on("sendMessage", (msg, cbAcknowledgement) => {
        //init bad-words lib
        const filter = new Filter()

        // message containt bad words?
        if (filter.isProfane(msg)) {
            return cbAcknowledgement("Profanity is no allowed!")
        }

        socket.broadcast.emit("spreadMessage", msg)
        cbAcknowledgement()

        io.to("Home").emit("message", generateMessage(msg))
    })

    socket.on("disconnect", () => {
        io.emit("message", generateMessage("A user has left!"))
    })

    socket.on("shareLocation", (coords, callback) => {
        io.emit("shareLocation", generateLocationMessage(`https://google.com/maps/?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
})


server.listen(port, () => {
    console.log(`Server is listen on port:${port}...`)
})