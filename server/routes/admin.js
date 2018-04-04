let express = require('express')
let router = express.Router()

router.get('/', (req, res) => {
    // Proba admin server side
    res.send('merge admin')
})

module.exports = router