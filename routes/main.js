// Create a new router
const express = require("express")
const router = express.Router()
const { query, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('/users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
     if (err) {
        return res.redirect('./')
   }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
})

router.get('/books/addbook',redirectLogin, function(req, res, next){
    res.render('addbook.ejs')
});

router.get('/books/search',function(req, res, next){
    res.render('search.ejs')
});

router.get('/books/bargainbooks',function(req, res, next){
    // Query the database for books under £20 
    let sql = "SELECT * FROM books WHERE price < ?";
    db.query(sql, [20], (err, results) => { //query database for under 20
        if (err) return next(err);
        res.render('bargainbooks.ejs', { bargainBooks: results }); //render the page with the new set of books
    });
});

router.post('/books/bookadded',

    [query('name').isLength({ min: 1 }),
    query('name').trim().escape(),
    query('price').isNumeric()
    ]
    , function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price] //creates a new item
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price) // feed information back to user
    })
}) 

router.get('/books/search_result', 
    [query('search_text').isLength({ min: 1 }),
        query('search_text').trim().escape()
    ],

    function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('search.ejs') //resets page if wrong input
    }
    else {  

    // saving data in database
    const keyword = `%${req.query.search_text}%`; //creates variable for searching, added % so that it searches by character and not exact match
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?"
    // execute sql query

    db.query(sqlquery, [keyword], (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.render('search_result.ejs', {result: result}) // feed information back to user
    })
}})   

// Export the router object so index.js can access it
module.exports = router