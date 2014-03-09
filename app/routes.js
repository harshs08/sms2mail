/**
 * Created with JetBrains WebStorm.
 * User: harshsingh
 * Date: 3/8/14
 * Time: 6:28 AM
 * To change this template use File | Settings | File Templates.
 */

var User = require('./models/user');
var twilio = require('twilio');
var nodemailer = require("nodemailer");
var configAuth = require('../config/auth');


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

    // application -------------------------------------------------------------
    app.get('/twilio', function(req, res) {

        console.log("Hello: "+req.query.ToCountry);
        console.log("Hello: "+req.query.Body);
        var k =   req.query.Body.split("`") ;
        console.log(k[0]);
        console.log(k[1]);
        console.log(k[2]);

        // Create a SMTP transport object
        var transport = nodemailer.createTransport("SMTP", {
            //service: 'Gmail', // use well known service.
            // If you are using @gmail.com address, then you don't
            // even have to define the service name
            auth: {
                user: configAuth.emailAuth.uname,
                pass: configAuth.emailAuth.pwd
            }
        });

        var message = {

            // sender info
            from: 'harshs08@gmail.com  ',

            // Comma separated list of recipients
            to: k[0],

            // Subject of the message
            subject: k[1], //

            headers: {
                'X-Laziness-level': 1000
            },

            // plaintext body
            text: k[2]
        };

        console.log('Sending Mail');
        transport.sendMail(message, function(error){
            if(error){
                console.log('Error occured');
                console.log(error.message);
                return;
            }
            console.log('Message sent successfully!');

            // if you don't want to use this transport object anymore, uncomment following line
            //transport.close(); // close the connection pool
        });

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

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'], accessType: 'offline', approvalPrompt: 'force' }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

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