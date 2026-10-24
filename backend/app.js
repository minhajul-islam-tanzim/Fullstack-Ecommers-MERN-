require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express()

app.use(cors())
app.use(express.json())



const PORT = process.env.PORT || 3001;


mongoose.connect(process.env.MONGO_URI).then(() => { 
    console.log("1st Wish is mongo connect successfully")

    app.listen(PORT, () => {
        console.log('2nd wish Server is running')
    })

}).catch(() => {
    console.log("1st False there is somethong wrong connected with Server")
})