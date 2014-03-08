/**
 * Created with JetBrains WebStorm.
 * User: harshsingh
 * Date: 3/8/14
 * Time: 6:28 AM
 * To change this template use File | Settings | File Templates.
 */

var User = require('./models/user');

module.exports = function(app) {

    // api ---------------------------------------------------------------------
    // get all todos
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
        res.sendfile('./public/twilio.js'); // load the single view file (angular will handle the page changes on the front-end)
    });

    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};