const express = require("express")
const path = require("path")

const app = express()// create an express server
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, "../public") // __dirname = current directory (make path from current directory)


// Serving static files
app.use(express.static(publicDirectoryPath))

// start express server 
app.listen(port, () => {
    console.log(`Chat-app listening on port ${port}...`);
})

