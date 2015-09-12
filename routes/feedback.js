var express = require('express');
var router = express.Router();


// expecting the following fields to be posted in the body of the request:
// citation_number, age, race, zip, income_range, violation, municipality, comment, rating
router.post('/ticket', function(req, res) {
  var query = req.pgQuery;

  var crypto = require('crypto');
  var sha1 = crypto.createHash('sha1').update(req.body.citation_number).digest("hex");

  console.log(sha1);
  var values = [sha1, req.body.age, req.body.race, req.body.zip, req.body.income_range, req.body.violation, req.body.municipality, req.body.comment, req.body.rating];

  query('INSERT INTO ticket_feedback(hashed_citation_number, age, race, zip, incomeRange, violation_description, municipality, optional_comment, experience_rating) VALUES ($1::text, $2::integer, $3::text, $4::text, $5::integer, $6::text, $7::text, $8::text, $9::integer);', values, function(err, rows, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
