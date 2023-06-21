const express = require("express")
const app = express()
const http = require("http")
const path = require("path")
const server = http.createServer(app)// create basic server
const { Server } = require("socket.io")
const io = new Server(server) //initialize a new instance of socket.io by passing the server (the HTTP server) object. 

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))// use public to serve files


io.on("connection", socket => {
    socket.on("chat message", msg => {
        io.emit("chat message", msg)
        // console.log(`message: ${msg}`)
    })
})


server.listen(port, () => {
    console.log(`Chat-app listening on port ${port}...`);
})