// sms.js
var express = require('express');
var router = express.Router();

var twilioAccountPhone = '3145969058';


// Query Citations
router.all('/notify', function(req, res) {
  req.twilio.messages.create({ 
    to:   req.query.phone, 
    from: twilioAccountPhone, 
    body: "STL Justice Portal: There are 2 people ahead of you at BRENTWOOD MUNICIPAL COURT, and the expected wait is 20 minutes.",   
  }, function(err, data) {
      // Return a 500 if there was an error on Twilio's end
      if (err) {
          console.error(err);
          return res.status(500).send();
      }

      // Otherwise, respond with 200 OK
      res.status(200).send('');
  });
});

module.exports = router;