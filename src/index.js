const path = require("path")
const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage, generateLocationMessage } = require("./utils/messages")
const { addUser,
    removeUser,
    getUser,
    getUsersInRoom } = require("./utils/users")


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

    socket.on("join", ({ username, room }, cbAcknowledgement) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return cbAcknowledgement(error)
        }

        socket.join(user.room)

        socket.emit("message", generateMessage("Welcome!"))
        socket.broadcast.to(user.room).emit("message", generateMessage(`${username} has joined the ${room} room.`))

        cbAcknowledgement()
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
        const removedUser = removeUser(socket.id)

        if (removedUser) {
            io.to(removedUser.room).emit("message", generateMessage(`A ${removedUser.username} has left!`))
        }
    })

    socket.on("shareLocation", (coords, callback) => {
        io.emit("shareLocation", generateLocationMessage(`https://google.com/maps/?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
})


server.listen(port, () => {
    console.log(`Server is listen on port:${port}...`)
})