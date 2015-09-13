// checkin.js
var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

var twilioAccountPhone = '3145969058';
var MAX_CONTINUATIONS = 3;

router.all('/continuation', function(req, res) {
  // console.log("continuation ENTER ");
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

/*
 *  Authenticate user for court date checkin. 
 *  Returns citation information for user and queue status for given court and date.
 */
router.all('/auth', function(req, res) {
  console.log(req.query);
  var query  = req.pgQuery;
  var params = req.query;
  var courtDate = '09/13/2015'; 
  var values = [courtDate, params.firstName, params.lastName, params.dob]; // Assumes person only has one court date/municipality per day
  var citationSql = 
    "SELECT * FROM citations " +
    "LEFT OUTER JOIN violations ON citations.citation_number = violations.citation_number " +
    "WHERE to_char(citations.court_date, 'MM/DD/YYYY') =  $1::text  " +
    "AND citations.first_name = $2::text " + 
    "AND citations.last_name = $3::text  " +
    "AND to_char(citations.date_of_birth, 'MM/DD/YYYY') = $4::text ";

  // console.log(citationSql);    
  
  // Query for citation information
  query(citationSql, values, function(err, rows, result) {
    console.log(result);
    var citationResult = result;
    // console.log(citationResult);
    
    var loc = rows[0].court_location;
    
    var queueValues = [loc, courtDate];
    var queueSql = "select * from queue " + 
               "where upper(court_location) = upper($1::text)  " + 
               "and appearance_time is null  " + 
               "and court_date >= date $2::date + time '00:00'  " + 
               "order by court_date asc  ";
    res.json(citationResult);
    // // Query for queue information
    // query(queueSql, queueValues, function(err, rows, queueResult) {
    //   // var results = {
    //   //   'citation' : citationResult.rows, 
    //   //   'queue' : queueResult 
    //   // };
    //   var citation = {citationResult, queueResult};
    //   // console.log(results);
    //   res.json(results);
    // });
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

module.exports = router;
