// Enviorment Variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// Project Dependcies 
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
// overide to delete (logout)
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')
const validation = require("./validation")


initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)
// list of active users
const users = []


app.set('view-engine', 'ejs')

// Project Middleware
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// Static Files
app.use(express.static('public'))
// load in CSS 
app.use('/css', express.static(__dirname + './public/css'))


// Routes 
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name, title: "Hello World" })
})

// gets login page 
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
// Sends Login user 
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

// Display register page 

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})
// Creates a user 
app.post('/register', checkNotAuthenticated, async (req, res) => {
    const { email, password, fname, lname } = req.body

    const response = validation({ email, password, fname, lname })

    if (response === null) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            users.push({
                id: Date.now().toString(),
                name: `${fname} ${lname}`,
                email: email,
                password: hashedPassword
            })
            res.redirect('/login')
        } catch {
            res.redirect('/register')
        }
    } else {
        res.send({ errors: response })
    }
    console.log(users)
})

// Log the user out 
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

// Middleware for projecting routes if user is either is Auth or not

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

// Server port 
app.listen(process.env.PORT, () => console.info(`App listening on port http://localhost:${process.env.PORT}`))