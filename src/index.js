const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server) //initialize a new instance of socket.io by passing the server (the HTTP server) object. 

const port = process.env.PORT || 3000


app.get(`/`, (req, res) => {
    res.sendFile(__dirname + `/index.html`)
})

io.on("connection", socket => {
    // console.log("user connected.")
    socket.on("chat message", msg => {
        io.emit("chat message", msg)
        // console.log(`message: ${msg}`)
    })
})

// start express server 
server.listen(port, () => {
    console.log(`Chat-app listening on port ${port}...`);
})

