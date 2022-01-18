const express = require("express")
const app = express()
// bcrypt - hash password
const bcrypt = require('bcrypt')
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

// initialize passport config
const initializePassport = require("./passport-config")
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)
const users = []

// setting enviorment variables 

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

app.set('view engine', 'ejs')
// access in request variable
app.use(express.urlencoded({ extended: false }))
app.use(flash())
// encrypt info
// resave - resave session variable if nothing has change
// save - save empty value if there is no empty value

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
// store session across the application
app.use(passport.session())


app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { title: 'Home Page', name: req.user.name })
})

// middlware function
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // proceed to the next 

        return next()
    }
    res.redirect("/login")
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    next()

}

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')

})
app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register.ejs")
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    // redirect back to home page
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true

}))
app.post("/register", checkNotAuthenticated, async (req, res) => {

    const { fname, lname, email, password } = req.body

    try {
        const hashPassword = await bcrypt.hash(password, 10)
        users.push(
            {
                id: Date.now().toString(),
                name: `${lname}, ${fname}`,
                email: email,
                password: hashPassword

            })
        res.redirect('/login')
    } catch (error) {
        res.redirect('/register')
    }
    console.log(users)
})
app.listen(process.env.PORT, () => console.info(`App listening on port http://localhost:${process.env.PORT}`))