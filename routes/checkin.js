// checkin.js
var express = require('express');
var router = express.Router();

var twilioAccountPhone = '3145969058';
var MAX_CONTINUATIONS = 3;

router.all('/continuation', function(req, res) {
  console.log("continuation ENTER ");
  var query  = req.pgQuery;
  var params = req.query;
  var values = [params.citationNo];
  var selectQuery = 'SELECT count from citation_continuation where citation_number = $1::text';
  var updateQuery = 'UPDATE citation_continuation SET count = count + 1 where citation_number =  $1::text';
  var insertQuery = 'INSERT INTO citation_continuation(citation_number, count) values ($1::text, $2::integer)';

  console.log(params);
  query(selectQuery, values, function(err, rows, result) {

    if (rows != null && rows.length > 0) {
      console.log("rows != null "  + rows);

      // selectQuery will return rows if citation has previously been continued
      var count = rows[0].count;
      
      // Cannot exceed 3 continuances (and, really, shouldn't be able to continue if jury trial)
      if (count < MAX_CONTINUATIONS) {
        query(updateQuery, values, function(err, rows, result) {
          console.log('Citation ' + params.citationNo +  ' continued [' + count + ']');
          res.send((err === null) ? 
                   '{"success" : "Updated Successfully", "status" : 200}' : 
                   '{"failure" : "Unknown Error", "status" : 520 }');
        });
      }
      else {
        // handle failure
        console.log('Citation ' + params.citationNo + ' cannot be continued [' + count + ']');
        res.send('{"failure" : "Unavailable For Legal Reasons", "status" : 451}');
      }
    }
    else {
      // Continue case
      values.push(1);
      query(insertQuery, values, function(err, rows, result) {
        console.log('Citation ' + params.citationNo +  ' continued');
        res.send((err === null) ? 
                 '{"success" : "Updated Successfully", "status" : 200}' : 
                 '{"failure" : "Unknown Error", "status" : 520 }');
      });
    }
  });
});



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

// Query Citations
router.all('/addToQueue', function(req, res) {
  var query  = req.pgQuery;
  var params = req.query;
  var values = [params.citationNo, params.courtLoc];
  var insertQuery = 'INSERT INTO queue(citation_number, court_location) values ($1::text, $2::text)';
  query(insertQuery, values, function(err, rows, result) {
    req.twilio.messages.create({
      to:   '3148524060',
      from: twilioAccountPhone,
      body: "STL Justice Portal: There are 2 people ahead of you at " + params.courtLoc + ", and the expected wait is 20 minutes.",
    }, function(err, data) {
        // Return a 500 if there was an error on Twilio's end
        if (err) {
            console.error(err);
            res.send('{"failure" : "Unknown Error", "status" : 520 }');
        }

        // Otherwise, respond with 200 OK
        res.status(200).send('{"success" : "Updated Successfully", "status" : 200}');
    });
  });
});

module.exports = router;
