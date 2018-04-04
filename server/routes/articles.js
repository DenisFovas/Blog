let express = require('express')
let router = express.Router()

router.get('/', (req, res) => {
    res.send('all articles here')
})

module.exports = router