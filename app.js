const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

//load config
dotenv.config({ path: './config/config.env' })

//passport
require('./config/passport')(passport)

connectDB()

const app = express()

//bodyparser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//method Override
app.use(methodOverride(function (req, res) {
    if(req.body && typeof req.body === 'object' && '_method' in req.body){
        let method = req.body._method
        delete req.body._method
        return method
    }
}))


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// //handlebars helpers
// const { formatDate, stripTags, truncate, editIcon, select, } = require('./helpers/hbs')

// //handlebars
// app.engine('.hbs', exphbs({ helpers: {
//     formatDate,
//     stripTags
//     truncate,
//     editIcon,
//     select,
// }, defualtLayout: 'main', extname: '.hbs' }))
// app.set('view engine', '.hbs')

app.set('view engine', 'ejs')

//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({client: mongoose.connection.getClient(), dbName: "example-db-mongoose"})
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global variable
app.use(function (req, res, next){
    res.locals.user = req.user || null
    next()
})

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000


app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)