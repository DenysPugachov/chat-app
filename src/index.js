const path = require("path")
const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const Filter = require("bad-words")

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

    socket.emit("message", "Wellcome!")

    socket.broadcast.emit("message", "A new user has joined!")

    socket.on("sendMessage", (msg, cbAcknowledgement) => {
        io.emit("spreadMessage", msg)
        cbAcknowledgement("Acknowledgement from index.js: Delivered!")
    })

    //Notify user about disconnected user
    socket.on("disconnect", () => {
        io.emit("message", "A user has left!")
    })

    socket.on("shareLocation", coords => {
        io.emit("message", `https://google.com/maps/?q=${coords.latitude},${coords.longitude}`)
    })
})


server.listen(port, () => {
    console.log(`Server is listen on port:${port}...`)
})