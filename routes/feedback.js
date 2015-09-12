var express = require('express');
var router = express.Router();

// service to add ticketing process feedback
// expecting the following fields to be posted in the body of the request:
// citation_number, age, race, gender, def_city, def_state, income_range, violation, municipality, comment, rating
router.post('/ticket', function(req, res) {
  var query = req.pgQuery;

  var crypto = require('crypto');
  var sha1 = crypto.createHash('sha1').update(req.body.citation_number).digest("hex");

  var values = [sha1, req.body.age, req.body.race, req.body.gender, req.body.def_city, req.body.def_state, req.body.income_range, req.body.violation, req.body.municipality, req.body.comment, req.body.rating];

  query('INSERT INTO ticket_feedback(hashed_citation_number, age, race, gender, def_city, def_state, incomeRange, violation_description, municipality, optional_comment, experience_rating) VALUES ($1::text, $2::integer, $3::text, $4::text, $5::text, $6::text, $7::integer, $8::text, $9::text, $10::text, $11::integer);', values, function(err, rows, result) {

    res.send(
      (err === null) ? { msg: '' } : (err.code == '23505') ? { msg: 'Feedback already received.' } : { msg: err }
    );
  });
});

// service to add court process feedback
// expecting the following fields to be posted in the body of the request:
// citation_number, age, race, gender, def_city, def_state, income_range, violation, municipality, checkin_time, appearance_time, attorney, comment, rating
router.post('/court', function(req, res) {
  var query = req.pgQuery;

  var crypto = require('crypto');
  var sha1 = crypto.createHash('sha1').update(req.body.citation_number).digest("hex");

  var values = [sha1, req.body.age, req.body.race, req.body.gender, req.body.def_city, req.body.def_state, req.body.income_range, req.body.violation, req.body.municipality, req.body.checkin_time, req.body.appearance_time, req.body.attorney, req.body.comment, req.body.rating];

  query('INSERT INTO court_feedback(hashed_citation_number, age, race, gender, def_city, def_state, incomeRange, violation_description, municipality, checkin_time, appearance_time, attorney, optional_comment, experience_rating) VALUES ($1::text, $2::integer, $3::text, $4::text, $5::text, $6::text, $7::integer, $8::text, $9::text, $10::timestamp, $11::timestamp, $12::boolean, $13::text, $14::integer);', values, function(err, rows, result) {
    res.send(
      (err === null) ? { msg: '' } : (err.code == '23505') ? { msg: 'Feedback already received.' } : { msg: err }
    );
  });
});

module.exports = router;
