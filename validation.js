const validation = (body) => {
    const errors = []
    // blanks
    if (body.email.trim() === "") {
        errors.push("Email cannot be blank")
    }

    if (body.password.trim() === "") {
        errors.push("Password cannot be blank")
    }
    if (body.fname.trim() === "") {
        errors.push("First name cannot be blank")

    }
    if (body.lname.trim() === "") {
        errors.push("Last name cannot be blank")

    }

    // email format
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(body.email)) {
        errors.push("Invalid Email")
    }
    // password format
    if (/^[A-Za-z]\w{7,14}$/.test(body.password)) {
        errors.push("Password Invalid")
    }

    // returns errors
    if (errors) {
        return null
    }
    else {
        return errors
    }
}

module.exports = validation 