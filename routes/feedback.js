var express = require('express');
var router = express.Router();

// service to add ticketing process feedback
// expecting the following fields to be posted in the body of the request:
// citation_number, age, race, gender, zip, income_range, violation, municipality, comment, rating
router.post('/ticket', function(req, res) {
  var query = req.pgQuery;

  var crypto = require('crypto');
  var sha1 = crypto.createHash('sha1').update(req.body.citation_number).digest("hex");

  var values = [sha1, req.body.age, req.body.race, req.body.gender, req.body.zip, req.body.income_range, req.body.violation, req.body.municipality, req.body.comment, req.body.rating];

  query('INSERT INTO ticket_feedback(hashed_citation_number, age, race, gender, zip, incomeRange, violation_description, municipality, optional_comment, experience_rating) VALUES ($1::text, $2::integer, $3::text, $4::text, $5::text, $6::integer, $7::text, $8::text, $9::text, $10::integer);', values, function(err, rows, result) {

    res.send(
      (err === null) ? { msg: '' } : (err.code == '23505') ? { msg: 'Feedback already received.' } : { msg: err }
    );
  });
});

// service to add court process feedback
// expecting the following fields to be posted in the body of the request:
// citation_number, age, race, gender, zip, income_range, violation, municipality, checkin_time, appearance_time, attorney, comment, rating
router.post('/court', function(req, res) {
  var query = req.pgQuery;

  var crypto = require('crypto');
  var sha1 = crypto.createHash('sha1').update(req.body.citation_number).digest("hex");

  var values = [sha1, req.body.age, req.body.race, req.body.gender, req.body.zip, req.body.income_range, req.body.violation, req.body.municipality, req.body.checkin_time, req.body.appearance_time, req.body.attorney, req.body.comment, req.body.rating];

  query('INSERT INTO court_feedback(hashed_citation_number, age, race, gender, zip, incomeRange, violation_description, municipality, checkin_time, appearance_time, attorney, optional_comment, experience_rating) VALUES ($1::text, $2::integer, $3::text, $4::text, $5::text, $6::integer, $7::text, $8::text, $9::timestamp, $10::timestamp, $11::boolean, $12::text, $13::integer);', values, function(err, rows, result) {
    res.send(
      (err === null) ? { msg: '' } : (err.code == '23505') ? { msg: 'Feedback already received.' } : { msg: err }
    );
  });
});

module.exports = router;
