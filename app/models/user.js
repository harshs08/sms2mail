/**
 * Created with JetBrains WebStorm.
 * User: harshsingh
 * Date: 3/8/14
 * Time: 6:29 AM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    Name : String,
    Token : String,
    Token_Secret: String
});