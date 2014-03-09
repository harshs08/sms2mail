/**
 * Created with JetBrains WebStorm.
 * User: harshsingh
 * Date: 3/8/14
 * Time: 6:28 AM
 * To change this template use File | Settings | File Templates.
 */

var User = require('./models/user');
var twilio = require('twilio');

module.exports = function(app, passport) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/api/usr', function(req, res) {

        // use mongoose to get all todos in the database
        User.find(function(err, usrs) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(usrs); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/usr', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        User.create({
            text : req.body.text,
            done : false
        }, function(err, usrs) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, usrs) {
                if (err)
                    res.send(err)
                res.json(usrs);
            });
        });

    });

    // delete a todo
    app.delete('/api/usr/:usr_id', function(req, res) {
        User.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            User.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });

    // application -------------------------------------------------------------
    app.get('/twilio', function(req, res) {
        console.log("Hello: "+req.query.ToCountry);
        console.log("Hello: "+req.query.Body);
        var k =   req.query.Body.split("`") ;
         console.log(k[0]);
        console.log(k[1]);
        console.log(k[2]);

        //response
        var resp = new twilio.TwimlResponse();

        resp.message('Thanks, your message was received!');

        //Render the TwiML document using "toString"
        res.writeHead(200, {
            'Content-Type':'text/xml'
        });
        res.end(resp.toString());

        //res.sendfile('./public/twilio.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

//    app.get('/', function(req, res) {
//
//        res.sendfile('./public/index1.html'); // load the single view file (angular will handle the page changes on the front-end)
//    });
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}