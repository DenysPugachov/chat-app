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

io.on("connection", socket => {
    console.log("+++ New socket connection. +++")

    socket.on("sendMessage", msg => {
        io.emit("spreadMessage", msg)
    })
})


server.listen(port, () => {
    console.log(`Server is listen on port:${port}...`)
})