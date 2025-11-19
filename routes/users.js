// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10


router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password 
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Store hashed password in your database.
        let sqlquery = "INSERT INTO users (first, last, email, username, password) VALUES (?,?,?,?,?)"
        // execute sql query
        let newrecord = [req.body.first, req.body.last, req.body.email, req.body.username, hashedPassword] //creates a new item
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err)
            } else {
                result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
                result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(result)
                //res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);   
            }
        })
    })
}) // closes router.post('/registered')

    // saving data in database
    //res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);   

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM users"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("usersList.ejs", {usersList:result})
     });
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})

router.post('/loggedIn', function (req, res, next) {
    let sqlquery = "SELECT * FROM users WHERE username = ?"
    const username = req.body.username
    const plainPassword = req.body.password

    db.query(sqlquery, [username], (err, results) => {
        if (err) {
            return next(err)
        }

        if (results.length === 0) { //checks if username is correct
            return res.send('Login failed, please check your username and password and try again.')
        }

        const hashedPassword = results[0].password; // get hashed password from database

        bcrypt.compare(plainPassword, hashedPassword, function(err, result) {
            if (err) {
                loginAttempt(username, false);
                return res.send('fatal error')
            }

            if (result == true) {
                loginAttempt(username, true);
                return res.send('You are now logged in, welcome back '+ username)
            } else {
                loginAttempt(username, false);
                return res.send('Login failed, please check your username and password and try again.')
            }
        })
    })
})

function loginAttempt(username, success) {
    let sqlquery = "INSERT INTO login_attempts (username, success) VALUES (?, ?)";
    const data = [username, success];

    db.query(sqlquery, data, (err, result) => {
        if (err) {
            console.error('Error logging login attempt:', err);
        }
    });
}
// Export the router object so index.js can access it
module.exports = router
