const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('Hello API')
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('node start on port '+ PORT)
})