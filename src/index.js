const path = require("path")
const express = require("express")
const http = require("http")
const socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, "../public")

app.use(express.static(publicDirPath))// serve files from static folder /public

let count = 0

io.on("connection", socket => {
    console.log("+++ New socket connection. +++")

    //socket => current connection
    socket.emit("countUpdated", count)

    socket.on("incrementCount", () => {
        console.log("incrementCount event received. ")
        count++
        //io => connection to all connected client
        io.emit("countUpdated", count)
    })

    socket.on("decrementCount", () => {
        console.log("decrementCount event received. ")
        count--
        io.emit("countUpdated", count)
    })
})


server.listen(port, () => {
    console.log(`Server is listen on port:${port}...`)
})