// Passport JS for user Auth
const localStrategy = require("passport-local")
const bcrypt = require("bcrypt")

const initialize = async (passport, getUserByEmail, getUserById) => {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            // error - server - null
            // false no userfound 
            // message - error msg
            return done(null, false, { message: "No user with that email found" })
        }

        try {
            // this is the correct password for this user
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)

            }
            // this is an incorrect password for this user 
            else {
                return done(null, false, { message: "Password incorrect" })
            }
        } catch (error) {
            // application error 
            return done(error)
        }

    }
    // checks the inputfields 
    passport.use(new localStrategy({ usernameField: "email" }, authenticateUser))
    passport.serializeUser((user, done) => { done(null, user.id) })
    passport.deserializeUser((id, done) => { done(null, getUserById(id)) })

}

module.exports = initialize