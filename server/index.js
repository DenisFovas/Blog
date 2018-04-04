let express = require('express')
let bodyParser = require('body-parser')
let path = require('path');

const PORT = 3000
// Define the app
let app = express()

const ADMIN = require('./routes/admin')
const ARTICLES = require('./routes/articles')

/* Midlleware declaration */
app.use(bodyParser.json())


// Make use of the public folder
app.use(express.static(path.join(__dirname, './public')))

// Use this routing rules
app.use('/admin', ADMIN)
app.use('/article', ARTICLES)

// Home
app.get('/', (req, res) => {
    console.log('merge')
    // res.render('index.html');
    res.send('da')
})

// TODO: Make 404 page
// TODO: Make 500 page
app.listen(PORT || 3000, () => {
    console.log('Server started on ' + PORT || 3000)
})