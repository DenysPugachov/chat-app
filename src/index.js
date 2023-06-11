const express = require("express")

// create an express server
const app = express()
const port = process.env.PORT || 3000


app.get("/", (req, res) => {
    res.send("Hello from chat-app.")
})


// start express server 
app.listen(port, () => {
    console.log(`Chat-app listening on port ${port}...`);
})