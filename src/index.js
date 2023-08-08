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
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${username} has joined the ${room} room.`))

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        cbAcknowledgement()
    })

    socket.on("sendMessage", (msg, cbAcknowledgement) => {
        //init bad-words lib
        const filter = new Filter()
        // message containt bad words?
        if (filter.isProfane(msg)) {
            return cbAcknowledgement("Profanity is no allowed!")
        }

        const userSender = getUser(socket.id)

        io.to(userSender.room).emit("message", generateMessage(userSender.username, msg))
        cbAcknowledgement()
    })

    socket.on("disconnect", () => {
        const removedUser = removeUser(socket.id)
        if (removedUser) {
            io.to(removedUser.room).emit("message", generateMessage("Admin", `A ${removedUser.username} has left!`))

            io.to(removedUser.room).emit("roomData", {
                room: removedUser.room,
                users: getUsersInRoom(removedUser.room)
            })
        }
    })

    socket.on("shareLocation", (coords, cbAcknowledgement) => {
        const userSender = getUser(socket.id)
        io.to(userSender.room).emit("shareLocation", generateLocationMessage(userSender.username, `https://google.com/maps/?q=${coords.latitude},${coords.longitude}`))
        cbAcknowledgement()
    })
})


server.listen(port, () => {
    console.log(`Server is listen on port:${port}...`)
})