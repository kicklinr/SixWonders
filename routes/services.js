var express = require('express');
var router = express.Router();

/*
 * GET citation and violation info based on input.
 */
router.all('/citationViolationList', function(req, res) {
    var query = req.pgQuery;
    var values = [req.query.lastName];
	var sqlBase = 'SELECT * FROM citations INNER JOIN violations ON citations.citation_number = violations.citation_number WHERE citations.last_name = $1::text';
	
	var count=2;
	
	console.log(req.query);
	
	if(req.query.firstName!=null){
		values.push(req.query.firstName);
		sqlBase= sqlBase + " AND citations.first_name = $"+count+"::text";
		count = count +1;
	}
	else if(req.query.dob!=null){
		values.push(req.query.dob);
		sqlBase= sqlBase + " AND citations.dob = $"+count+"::text";
		count = count +1;
	}
	else if(req.query.driverLicense!=null){
		values.push(req.query.driverLicense);
		sqlBase= sqlBase + " AND citations.driverLicense = $"+count+"::text";
		count = count +1;
	}
	else if(req.query.citationNum!=null){
		values.push(req.query.citationNum);
		sqlBase= sqlBase + " AND citations.citationNum = $"+count+"::text";
		count = count +1;
	}
	console.log(sqlBase);
	console.log(values);
    query(sqlBase, values, function(err, rows, result) {
		res.json(rows);
		
		console.log(err);
    });
	
	
});

module.exports = router;
