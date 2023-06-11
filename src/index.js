const express = require("express")

// create an express server
const app = express()
const port = process.env.PORT || 3000


// Serving static files
app.use(express.static(`public`))

// start express server 
app.listen(port, () => {
    console.log(`Chat-app listening on port ${port}...`);
})