// Require the twilio and HTTP modules
var twilio = require('twilio');

app.get('hi_there', function(req, res){

    var resp = new twilio.TwimlResponse();

    resp.message('Thanks, your message was received!');

    //Render the TwiML document using "toString"
    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    res.end(resp.toString());
});

console.log('Visit http://localhost:1337/ in your browser to see your TwiML document!');
